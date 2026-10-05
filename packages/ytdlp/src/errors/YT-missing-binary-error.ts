type YTBinary = 'ffmpeg' | 'ffprobe' | 'yt-dlp';

export class YTMissingBinaryError extends Error {
  readonly binary: YTBinary;
  readonly path: string;

  constructor(binary: YTBinary, path: string) {
    super(`"${binary}" is missing or not executable: "${path}"`);

    this.binary = binary;
    this.name = 'YTMissingBinaryError';
    this.path = path;
  }
}
