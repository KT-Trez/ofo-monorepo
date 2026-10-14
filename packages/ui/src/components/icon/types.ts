import type { ValueOf } from 'type-fest';

/**
 * Add a line here to use a new Material Symbols Rounded glyph.
 * The value is the glyph's ligature name.
 *
 * @see {@linkhttps://fonts.google.com/icons}
 */
export const IconGlyph = {
  AccountCircle: 'account_circle',
  Add: 'add',
  ArrowBack: 'arrow_back',
  ArrowDownward: 'arrow_downward',
  ArrowUpward: 'arrow_upward',
  Block: 'block',
  BrightnessAuto: 'brightness_auto',
  Check: 'check',
  CheckCircle: 'check_circle',
  ChevronRight: 'chevron_right',
  Close: 'close',
  CloudDone: 'cloud_done',
  CloudDownload: 'cloud_download',
  CloudOff: 'cloud_off',
  DarkMode: 'dark_mode',
  Delete: 'delete',
  Dns: 'dns',
  Download: 'download',
  DownloadDone: 'download_done',
  Downloading: 'downloading',
  DragIndicator: 'drag_indicator',
  Edit: 'edit',
  Error: 'error',
  ExpandMore: 'expand_more',
  HideImage: 'hide_image',
  History: 'history',
  Home: 'home',
  Image: 'image',
  LibraryAdd: 'library_add',
  LibraryMusic: 'library_music',
  LightMode: 'light_mode',
  Logout: 'logout',
  Merge: 'merge',
  MoreVert: 'more_vert',
  NorthWest: 'north_west',
  Pause: 'pause',
  PlayArrow: 'play_arrow',
  PlaylistAdd: 'playlist_add',
  ProgressActivity: 'progress_activity',
  QueueMusic: 'queue_music',
  Refresh: 'refresh',
  Remove: 'remove',
  Repeat: 'repeat',
  Schedule: 'schedule',
  Search: 'search',
  SelectAll: 'select_all',
  Settings: 'settings',
  SkipNext: 'skip_next',
  SkipPrevious: 'skip_previous',
  SortByAlpha: 'sort_by_alpha',
  Stop: 'stop',
  StopCircle: 'stop_circle',
  SwapVert: 'swap_vert',
  Timer: 'timer',
  TouchApp: 'touch_app',
  Translate: 'translate',
  Tune: 'tune',
} as const;
export type IconName = ValueOf<typeof IconGlyph>;

export const IconWeight = {
  /** Inside buttons and the large player controls. */
  Medium: 'medium',
  /** The default everywhere else. */
  Regular: 'regular',
} as const;
export type IconWeights = ValueOf<typeof IconWeight>;

export type IconProps = {
  /** Defaults to `textPrimary`. */
  color?: string;
  /** Filled glyph, for active and selected states (bottom nav, play). */
  isFilled?: boolean;
  name: IconName;
  /** Defaults to 24. The design uses 18–20 inside buttons and 32–40 in the player. */
  size?: number;
  /** Defaults to `regular`. */
  weight?: IconWeights;
};
