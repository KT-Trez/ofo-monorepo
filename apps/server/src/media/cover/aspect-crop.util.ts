import { DEFAULT_COVER_ASPECT } from './constants.js';

export type Box = { height: number; left: number; top: number; width: number };

const fitWithin = (box: Box, width: number, height: number): Box => ({
  height: Math.max(1, Math.min(height, box.height)),
  left: box.left + Math.floor((box.width - width) / 2),
  top: box.top + Math.floor((box.height - height) / 2),
  width: Math.max(1, Math.min(width, box.width)),
});

/** Largest centered 16:9 box inside `box` (the box itself when it is 16:9 already). */
export function toAspect(box: Box): Box {
  if (box.width / box.height > DEFAULT_COVER_ASPECT) {
    return fitWithin(box, Math.round(box.height * DEFAULT_COVER_ASPECT), box.height);
  }

  return fitWithin(box, box.width, Math.round(box.width / DEFAULT_COVER_ASPECT));
}
