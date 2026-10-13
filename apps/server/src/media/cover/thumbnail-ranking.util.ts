import type { Thumbnail } from '@ofo/ytdlp/mapper/types';
import {
  DEFAULT_COVER_ASPECT,
  HTTP_PATTERN,
  JPEG_PATTERN,
  KNOWN_THUMBNAIL_SIZES,
} from './constants.js';

type Candidate = { score: number; url: string };

const isHttpUrl = (url: string): boolean => HTTP_PATTERN.test(url);

const parseKnownSize = (thumbnail: Thumbnail): { height: number; width: number } | null => {
  if (thumbnail.height && thumbnail.height > 0 && thumbnail.width && thumbnail.width > 0) {
    return { height: thumbnail.height, width: thumbnail.width };
  }

  for (const [pattern, width, height] of KNOWN_THUMBNAIL_SIZES) {
    if (pattern.test(thumbnail.url)) {
      return { height, width };
    }
  }

  return null;
};

/**
 * Ranks thumbnail after the crop: a 4:3 image is assumed to be a letterboxed 16:9 one, so it is
 * worth 75% of its area, a 16:9 one 100%.
 */
const rankByArea = (height: number, width: number): number => {
  const aspect = width / height;
  const fit =
    aspect > DEFAULT_COVER_ASPECT ? DEFAULT_COVER_ASPECT / aspect : aspect / DEFAULT_COVER_ASPECT;

  return width * height * fit;
};

export function rankThumbnails(thumbnails: readonly Thumbnail[]): string[] {
  const candidates: Candidate[] = [];
  const scoredUrls = new Set<string>();

  for (const thumbnail of thumbnails) {
    if (!thumbnail.url || !isHttpUrl(thumbnail.url) || scoredUrls.has(thumbnail.url)) {
      continue;
    }

    scoredUrls.add(thumbnail.url);

    const size = parseKnownSize(thumbnail);
    const scoreByFormat = JPEG_PATTERN.test(thumbnail.url) ? 0.5 : 0;
    const scoreBySize = size ? rankByArea(size.height, size.width) : 0;

    candidates.push({ score: scoreByFormat + scoreBySize, url: thumbnail.url });
  }

  return candidates.toSorted((a, b) => b.score - a.score).map(candidate => candidate.url);
}
