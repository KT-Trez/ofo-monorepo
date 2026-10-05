import { describe, expect, it } from 'vitest';
import type { YTErrorKinds } from './types.ts';
import { YTStderr } from './YT-stderr.ts';

describe('YtDlpStderr', () => {
  describe('classify', () => {
    // samples recorded from real yt-dlp output;
    const ERROR_SAMPLES: [YTErrorKinds, string][] = [
      ['video_unavailable', 'ERROR: [youtube] aaaaaaaaaaa: Video unavailable'],
      [
        'video_unavailable',
        'ERROR: [youtube] aaaaaaaaaaa: Video unavailable. This video has been removed by the uploader',
      ],
      [
        'video_unavailable',
        'ERROR: [youtube] aaaaaaaaaaa: Video unavailable. This video is no longer available because the YouTube account associated with this video has been terminated.',
      ],
      [
        'video_unavailable',
        'ERROR: [youtube] aaaaaaaaaaa: Video unavailable. This video contains content from SME, who has blocked it on copyright grounds',
      ],
      [
        'video_private',
        "ERROR: [youtube] aaaaaaaaaaa: Private video. Sign in if you've been granted access to this video",
      ],
      [
        'age_restricted',
        'ERROR: [youtube] aaaaaaaaaaa: Sign in to confirm your age. This video may be inappropriate for some users.',
      ],
      [
        'age_restricted',
        'ERROR: [youtube] aaaaaaaaaaa: This video is age-restricted and not available without logging in',
      ],
      [
        'region_blocked',
        'ERROR: [youtube] aaaaaaaaaaa: The uploader has not made this video available in your country',
      ],
      [
        'region_blocked',
        'ERROR: [youtube] aaaaaaaaaaa: Video unavailable. This video contains content from X, who has blocked it in your country on copyright grounds',
      ],
      ['live_stream', 'ERROR: [youtube] aaaaaaaaaaa: This live event will begin in 3 hours.'],
      ['live_stream', 'ERROR: [youtube] aaaaaaaaaaa: Premieres in 2 days'],
      [
        'blocked',
        'ERROR: [youtube] aaaaaaaaaaa: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication.',
      ],
      ['blocked', "ERROR: [youtube] aaaaaaaaaaa: Sign in to confirm you're not a bot"],
      [
        'blocked',
        'ERROR: Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)',
      ],
      ['blocked', 'ERROR: unable to download video data: HTTP Error 403: Forbidden'],
      [
        'extractor_outdated',
        'ERROR: [youtube] aaaaaaaaaaa: Unable to extract uploader id; please report this issue on https://github.com/yt-dlp/yt-dlp/issues?q= , filling out the appropriate issue template. Confirm you are on the latest version using yt-dlp -U',
      ],
      [
        'extractor_outdated',
        'ERROR: [youtube] aaaaaaaaaaa: Signature extraction failed: Some formats may be missing',
      ],
      [
        'extractor_outdated',
        'ERROR: [youtube] aaaaaaaaaaa: n challenge solving failed: Some formats may be missing. Ensure you have a supported JavaScript runtime and challenge solver script distribution installed.',
      ],
      [
        'extractor_outdated',
        'ERROR: [youtube] aaaaaaaaaaa: Only images are available for download. use --list-formats to see them',
      ],
      [
        'no_audio',
        'ERROR: [youtube] aaaaaaaaaaa: Requested format is not available. Use --list-formats for a list of available formats',
      ],
      ['no_audio', 'ERROR: Postprocessing: Output file does not contain any stream'],
      ['conversion', 'ERROR: Postprocessing: ffmpeg exited with code 1'],
      [
        'conversion',
        'ERROR: Postprocessing: ffprobe and ffmpeg not found. Please install or provide the path using --ffmpeg-location',
      ],
      ['conversion', 'ERROR: Postprocessing: Conversion failed!'],
      [
        'network',
        "ERROR: [youtube] aaaaaaaaaaa: Unable to download webpage: <urlopen error [Errno -3] Temporary failure in name resolution> (caused by URLError(gaierror(-3, 'Temporary failure in name resolution')))",
      ],
      [
        'network',
        'ERROR: [youtube] aaaaaaaaaaa: Unable to download API page: <urlopen error [Errno 111] Connection refused>',
      ],
      ['network', 'ERROR: unable to download video data: <urlopen error timed out>'],
      ['network', 'ERROR: [download] Got error: The read operation timed out'],
      [
        'network',
        'ERROR: [youtube] aaaaaaaaaaa: Unable to download JSON metadata: HTTP Error 503: Service Unavailable',
      ],
      ['unknown', 'ERROR: something nobody has seen before'],
      ['unknown', ''],
    ];

    it.for(ERROR_SAMPLES)('should classify as "%s": "%s"', ([kind, stderr]) => {
      // given / when
      const result = new YTStderr(stderr);

      // then
      expect(result.classify()).toBe(kind);
    });

    it('should ignore warnings when an ERROR line is present', () => {
      // given
      const stderr = [
        'WARNING: [youtube] aaaaaaaaaaa: Some web client https formats have been skipped; ffmpeg is recommended',
        'WARNING: No JS runtime was found; Unable to download webpage helper',
        "ERROR: [youtube] aaaaaaaaaaa: Private video. Sign in if you've been granted access to this video",
      ].join('\n');

      // when
      const result = new YTStderr(stderr);

      // then
      expect(result.classify()).toBe('video_private');
    });

    it('should fall back to the whole stderr when there are no ERROR lines', () => {
      // given / when
      const result = new YTStderr(
        'Traceback ...\nurllib.error.URLError: <urlopen error timed out>',
      ).classify();

      // then
      expect(result).toBe('network');
    });
  });

  describe('isThumbnailEmbedFailure', () => {
    it.for([
      'ERROR: Postprocessing: Supported filetypes for thumbnail embedding are: mp3, mkv/mka, ogg/opus/flac, m4a/mp4/m4v/mov',
      'ERROR: Postprocessing: mutagen is required for thumbnail embedding in Opus files. Install it with pip install mutagen',
      'ERROR: Postprocessing: Unable to embed using mutagen; Incorrect padding',
    ])('should recognise a thumbnail failure: "%s"', stderr => {
      // given / when
      const result = new YTStderr(stderr).isThumbnailEmbedFailure();

      // then
      expect(result).toBe(true);
    });

    it.for([
      'ERROR: [youtube] aaaaaaaaaaa: Private video',
      'ERROR: Postprocessing: ffmpeg exited with code 1',
    ])('should ignore unrelated failure: "%s"', stderr => {
      // given / when
      const result = new YTStderr(stderr).isThumbnailEmbedFailure();

      // then
      expect(result).toBe(false);
    });

    it('should ignore thumbnail words that only appear in warnings', () => {
      // given
      const stderr =
        'WARNING: Unable to embed thumbnail\nERROR: [youtube] aaaaaaaaaaa: Video unavailable';

      // when
      const result = new YTStderr(stderr).isThumbnailEmbedFailure();

      // then
      expect(result).toBe(false);
    });
  });

  describe('summarize', () => {
    it.for([
      ['ERROR: boom', 'WARNING: x\nERROR: boom\nERROR: later'],
      [null, 'nothing'],
    ] as const)('should return the first ERROR line: "%s"', ([summary, stderr]) => {
      // given / when
      const result = new YTStderr(stderr).summarize();

      // then
      expect(result).toBe(summary);
    });
  });
});
