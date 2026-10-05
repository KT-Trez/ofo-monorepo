export class VideoId {
  private static readonly VIDEO_ID_PATTERN = /^[\w-]{1,64}$/;

  public readonly value: string;

  /** @throws TypeError for an invalid id. */
  constructor(value: string) {
    if (!VideoId.VIDEO_ID_PATTERN.test(value)) {
      throw new TypeError(`Invalid video id: "${value}"`);
    }

    this.value = value;
  }

  get url(): string {
    return `https://www.youtube.com/watch?v=${this.value}`;
  }
}
