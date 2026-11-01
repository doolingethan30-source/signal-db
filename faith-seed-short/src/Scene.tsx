import React, { useLayoutEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { loopSin, pop, tween, type V3 } from './anim';
import { Bunny, Hedgehog, Squirrel } from './characters/Critters';
import { Daisy } from './characters/Daisy';
import { Finn } from './characters/Finn';
import { Peep, WateringCan } from './characters/Peep';
import { Environment } from './Environment';
import { Ball, Shadow, SparkleBurst, Twinkle } from './parts';
import * as T from './timeline';
import { Apple, Sprout, Tree } from './Tree';

const CameraRig: React.FC<{ f: number; raw: number }> = ({ f, raw }) => {
  const { camera, scene } = useThree();
  const { pos, look } = T.camera(f, raw);
  useLayoutEffect(() => {
    camera.position.set(...pos);
    camera.lookAt(new THREE.Vector3(...look));
    camera.updateProjectionMatrix();
  });
  useLayoutEffect(() => {
    scene.fog = new THREE.Fog('#DCEFEA', 16, 70);
  }, [scene]);
  return null;
};

const Soil: React.FC<{ f: number }> = ({ f }) => {
  const s = T.soil(f);
  const dry = new THREE.Color('#9A6A43');
  const wetC = new THREE.Color('#5E3B22');
  const moundColor = dry.clone().lerp(wetC, s.wet);
  return (
    <group position={T.PLANT}>
      {s.hole > 0.01 && (
        <mesh position={[0, 0.006, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={s.hole}>
          <circleGeometry args={[0.13, 24]} />
          <meshStandardMaterial color="#3E2716" roughness={1} />
        </mesh>
      )}
      {s.pile > 0.01 && <Ball rad={0.11} p={[0.2, 0, 0.12]} s={[1.1 * s.pile, 0.55 * s.pile, 1 * s.pile]} c="#9A6A43" r={1} />}
      {s.mound > 0.01 && (
        <group scale={[1 + s.wiggle, 1 - s.wiggle, 1 + s.wiggle]}>
          <mesh position={[0, 0, 0]} scale={[s.mound, s.mound * 0.42, s.mound]}>
            <sphereGeometry args={[0.2, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={moundColor} roughness={1} />
          </mesh>
          {[0, 1, 2, 3, 4].map((i) => {
            const a = i * 1.3;
            return <Ball key={i} rad={0.03} p={[Math.cos(a) * 0.16 * s.mound, 0.015, Math.sin(a) * 0.16 * s.mound]} c={moundColor.getStyle()} r={1} seg={10} />;
          })}
        </group>
      )}
    </group>
  );
};

const Seed: React.FC<{ pos: V3; f: number }> = ({ pos, f }) => (
  <group position={pos}>
    <Ball rad={0.04} s={[0.8, 1.15, 0.8]} c="#A8743F" r={0.35} e="#FFC860" ei={0.25 + 0.25 * Math.max(0, Math.sin((f / 8) * Math.PI))} />
    {/* twinkle that catches Finn's eye */}
    <Twinkle p={[0.05, 0.08, 0.05]} size={f > 36 && f < 96 ? 0.06 * Math.abs(Math.sin(((f - 36) / 20) * Math.PI)) : 0} rot={f * 0.05} />
    <SparkleBurst p={[0, 0, 0.05]} t={tween(f, 104, 136)} radius={0.25} count={7} size={0.05} />
  </group>
);

const Droplets: React.FC<{ f: number; peep: ReturnType<typeof T.peep> }> = ({ f, peep }) => {
  if (f < 284 || f > 336) return null;
  // spout tip position (see WateringCan geometry + Peep can mount)
  const tilt = T.canTilt(f);
  const ly = 0.27 + 0.085 * Math.cos(tilt) - 0.26 * Math.sin(tilt);
  const lz = 0.3 + 0.085 * Math.sin(tilt) + 0.26 * Math.cos(tilt);
  const start: V3 = [peep.pos[0] + Math.sin(peep.rotY) * lz, ly + peep.lift, peep.pos[2] + Math.cos(peep.rotY) * lz];
  const drops = [];
  for (let k = 0; k < 26; k++) {
    const born = 284 + k * 1.6;
    const t = (f - born) / 9;
    if (t < 0 || t > 1 || born > 328) continue;
    const spread = ((k * 37) % 10) / 10 - 0.5;
    const spread2 = ((k * 61) % 10) / 10 - 0.5;
    const x = start[0] + spread * 0.12 * t - 0.04 * t;
    const z = start[2] + spread2 * 0.12 * t;
    const y = start[1] - t * t * (start[1] - 0.05);
    drops.push(
      <mesh key={k} position={[x, y, z]} scale={[1, 1.6, 1]}>
        <sphereGeometry args={[0.018, 10, 8]} />
        <meshStandardMaterial color="#7FD0FF" roughness={0.1} emissive="#5BB8F0" emissiveIntensity={0.35} transparent opacity={0.9} />
      </mesh>,
    );
  }
  return <>{drops}</>;
};

export const Scene: React.FC<{ raw: number }> = ({ raw }) => {
  const f = Math.max(0, raw); // story frame (clamped; ambient motion uses raw)
  const finn = T.finn(f, raw);
  const daisy = T.daisy(f, raw);
  const peep = T.peep(f, raw);
  const bunny = T.bunny(f, raw);
  const squirrel = T.squirrel(f, raw);
  const hedgehog = T.hedgehog(f, raw);
  const seed = T.seed(f, finn);
  const sprout = T.sprout(f, pop);
  const treeSway = -0.03 * loopSin(f, 10) * tween(f, 500, 560);
  const apples = T.sharedApples(f, { finn, daisy, peep, bunny, squirrel, hedgehog }, treeSway);
  const can = T.canState(f, peep);
  const holdingCan = can.held;

  return (
    <>
      <CameraRig f={f} raw={raw} />
      <hemisphereLight args={['#DDF3FF', '#7DBB55', 1.25]} />
      <directionalLight position={[4, 8, 6]} intensity={2.3} color="#FFF0D8" />
      <directionalLight position={[-5, 4, -6]} intensity={1.1} color="#E8F6FF" />
      <directionalLight position={[-3, 2, 8]} intensity={0.45} color="#FFFFFF" />
      <ambientLight intensity={0.25} />

      <Environment f={raw} />
      <Soil f={f} />
      {seed.visible && <Seed pos={seed.pos} f={f} />}
      <Sprout s={sprout.s} y={sprout.y} />
      <SparkleBurst p={[0, 0.3, 0.1]} t={tween(f, 408, 436)} radius={0.3} count={7} size={0.06} />
      {f >= 452 && <Shadow p={[0, 0, 0]} r={1.6 * tween(f, 470, 540)} o={0.8} />}
      <Tree f={f} shared={[apples[0].detached, apples[1].detached, apples[2].detached]} />
      {apples.map((a, i) => (a.detached ? <Apple key={i} p={a.pos} /> : null))}

      <Finn p={finn} />
      <Daisy p={daisy} />
      <Peep p={peep} can={holdingCan} canTilt={T.canTilt(f)} />
      {!holdingCan && (
        <>
          <Shadow p={can.pos} r={0.16} />
          <group position={can.pos} rotation={[0, can.rotY ?? -0.6, 0]}>
            <WateringCan />
          </group>
        </>
      )}
      <Droplets f={f} peep={peep} />
      <Bunny p={bunny} />
      <Squirrel p={squirrel} />
      <Hedgehog p={hedgehog} />
    </>
  );
};
