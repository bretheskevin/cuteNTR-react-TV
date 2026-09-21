import {isTV} from './tv';

export const FOCUS_RING_COLOR = '#BB86FC';
export const FOCUS_RING_WIDTH = 3;
export const OVERSCAN = isTV ? 48 : 0;
export const TV_MIN_TARGET_SIZE = isTV ? 48 : 0;
export const tvFontScale = (baseSize: number): number =>
  isTV ? Math.round(baseSize * 1.3) : baseSize;
export const tvPadding = (basePadding: number): number =>
  isTV ? Math.round(basePadding * 1.5) : basePadding;
