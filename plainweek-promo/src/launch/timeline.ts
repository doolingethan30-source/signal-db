import {easeInOut, prog} from '../anim';
import {L} from './theme';

// Theme amounts over the film (only the themes scene and hero change them).
export const DARK_IN = L.themes[0] + 30;
export const GLASS_IN = L.themes[0] + 64;

export const darkAt = (frame: number) => Math.min(prog(frame, DARK_IN, 14, easeInOut), 1 - prog(frame, GLASS_IN, 14, easeInOut));
export const glassAt = (frame: number) => prog(frame, GLASS_IN, 16, easeInOut);
