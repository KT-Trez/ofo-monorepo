import { YTErrorKind, type YTErrorKinds } from './types.ts';

export class YTStderr {
  private static readonly ERROR_LINE_PATTERN = /^\s*ERROR:/i;
  /**
   * All `stderr` classification patterns. They are matched against the `ERROR:` lines, first match
   * wins, so the order matters.
   */
  private static readonly ERROR_PATTERNS: [YTErrorKinds, RegExp][] = [
    [YTErrorKind.VideoPrivate, /private video|this video is private/i],
    [YTErrorKind.AgeRestricted, /confirm your age|age[- ]restricted|inappropriate for some users/i],
    [
      YTErrorKind.RegionBlocked,
      /not made this video available in your country|not available in your country|in your country|geo[- ]?restrict|not available from your location/i,
    ],
    [
      YTErrorKind.LiveStream,
      /live event will begin|premieres? (?:in|will begin)|is a live stream|live stream recording is not (?:currently )?available/i,
    ],
    [
      YTErrorKind.Blocked,
      /not a bot|http error 429|too many requests|http error 403|sign in to confirm|this helps protect our community|unusual traffic/i,
    ],
    [
      YTErrorKind.ExtractorOutdated,
      /unable to extract|please report this issue|signature extraction failed|nsig extraction failed|n challenge solving failed|only images are available|failed to extract any player response|update yt-dlp|yt-dlp is outdated/i,
    ],
    [
      YTErrorKind.VideoUnavailable,
      /video unavailable|video is unavailable|video is no longer available|video has been removed|account associated with this video has been terminated|removed by the uploader|blocked it on copyright grounds|does not exist|http error 404|http error 410/i,
    ],
    [
      YTErrorKind.NoAudio,
      /requested format is not available|does not contain any stream|no audio (?:stream|track)|audio stream not found/i,
    ],
    [
      YTErrorKind.Conversion,
      /postprocessing|ffmpeg|ffprobe|conversion failed|audio conversion failed/i,
    ],
    [
      YTErrorKind.Network,
      /unable to download (?:webpage|json metadata|api page)|urlopen error|temporary failure in name resolution|name or service not known|getaddrinfo failed|connection (?:reset|refused|aborted)|network is unreachable|timed out|remote end closed connection|incompleteread|ssl:|http error 5\d\d|transporterror/i,
    ],
  ];
  /** Matches the failures of `--embed-thumbnail`. */
  private static readonly THUMBNAIL_ERROR_PATTERN =
    /embed(?:ding)? (?:the )?thumbnail|thumbnail embedding|embedthumbnail|mutagen|unable to embed|thumbnail/i;

  private readonly errorLines: string[];
  private readonly text: string;

  constructor(text: string) {
    this.errorLines = text.split(/\r?\n/).filter(line => YTStderr.ERROR_LINE_PATTERN.test(line));
    this.text = text;
  }

  classify(): YTErrorKinds {
    const text = this.errorText();

    for (const [kind, pattern] of YTStderr.ERROR_PATTERNS) {
      if (pattern.test(text)) {
        return kind;
      }
    }

    return YTErrorKind.Unknown;
  }

  isThumbnailEmbedFailure(): boolean {
    return YTStderr.THUMBNAIL_ERROR_PATTERN.test(this.errorText());
  }

  /** The first `ERROR:` line, used as the human-readable message of a `YtDlpError`. */
  summarize(): string | null {
    return this.errorLines.at(0)?.trim() ?? null;
  }

  private errorText(): string {
    return this.errorLines.length > 0 ? this.errorLines.join('\n') : this.text;
  }
}
