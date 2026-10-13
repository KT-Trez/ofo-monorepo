export const COVER_MAX_WIDTH = 1280;
export const COVER_MAX_HEIGHT = 720;
export const COVER_WEBP_QUALITY = 100;

export const DEFAULT_COVER_ASPECT = 16 / 9;

export const HTTP_PATTERN = /^https?:\/\//i;
export const JPEG_PATTERN = /\.jpe?g(?:$|\?)/i;

export const KNOWN_THUMBNAIL_SIZES: [pattern: RegExp, width: number, height: number][] = [
  [/\/maxres(?:default|1|2|3)?\./, 1280, 720],
  [/\/hq720\./, 1280, 720],
  [/\/sddefault\./, 640, 480],
  [/\/hqdefault\./, 480, 360],
  [/\/mqdefault\./, 320, 180],
  [/\/default\./, 120, 90],
];

export const THUMBNAIL_FETCH_TIMEOUT_MS = 10_000;
export const THUMBNAIL_MAX_BYTES = 5 * 1024 * 1024;

/** Distance from pure black (sharp `trim` threshold) still treated as a letterbox bar. */
export const TRIM_THRESHOLD = 24;
/** A trim removing more than this share of the image is ignored (dark scene, not black bars). */
export const TRIM_MIN_AREA_RATIO = 0.4;
export const TRIM_MIN_SIDE_PX = 64;
