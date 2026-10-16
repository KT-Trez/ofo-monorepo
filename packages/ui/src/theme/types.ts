import type { ValueOf } from 'type-fest';

// Colors

// todo: systematize colors: color -> hover -> pressed

/** Semantic color tokens. Components use only these, never `palette` directly. */
export const ThemeColor = {
  /** Screen background. */
  Bg: 'bg',
  /** Base surface: sheets, cards and grouped settings. */
  SurfaceBase: 'surfaceBase',
  /** Surface one level above the base, e.g. a raised card. */
  SurfaceRaised: 'surfaceRaised',
  /** Highest surface: mini-player, dropdowns. */
  SurfaceElevated: 'surfaceElevated',
  /** Hovered or pressed surface. */
  SurfaceHover: 'surfaceHover',
  /** Inverted surface: toast, selection bar. */
  SurfaceInverse: 'surfaceInverse',
  /** Hovered `surfaceInverse`, e.g. the inverse icon button on the web. Not in the design system yet. */
  SurfaceInverseHover: 'surfaceInverseHover',

  /** Default divider and outline. */
  Border: 'border',
  /** Stronger outline, e.g. outlined buttons. */
  BorderStrong: 'borderStrong',

  TextPrimary: 'textPrimary',
  TextSecondary: 'textSecondary',
  TextTertiary: 'textTertiary',
  /** Text on `surfaceInverse`. */
  TextInverse: 'textInverse',
  /** Text on amber: always dark, never white. */
  TextOnAccent: 'textOnAccent',
  /** Light text and icons on covers, the same in both themes. Always on an `overlay*`. */
  TextOnMedia: 'textOnMedia',

  Accent: 'accent',
  AccentHover: 'accentHover',
  AccentPressed: 'accentPressed',
  /** Accent-colored text (darker in the light theme for contrast). */
  AccentText: 'accentText',
  /** Tinted background for accent highlights. */
  AccentSubtle: 'accentSubtle',

  Success: 'success',
  SuccessSubtle: 'successSubtle',
  Danger: 'danger',
  DangerSubtle: 'dangerSubtle',
  /** Hovered `dangerSubtle`, e.g. the danger button on the web. Not in the design system yet. */
  DangerSubtleHover: 'dangerSubtleHover',
  Info: 'info',
  InfoSubtle: 'infoSubtle',

  /** Backdrop behind sheets and dialogs. */
  Scrim: 'scrim',
  /** Unfilled part of progress and seek bars. */
  ProgressTrack: 'progressTrack',
  /** Cover dimming under the equalizer of the playing track. */
  OverlayCover: 'overlayCover',
  /** Dimming of a selected cover. */
  OverlaySelected: 'overlaySelected',
  /** Background of icon buttons on a cover. */
  OverlayControl: 'overlayControl',
} as const;
export type ThemeColors = ValueOf<typeof ThemeColor>;

// Typography

export const ThemeFontFamily = {
  /** Geist, for all text. */
  Text: 'text',
  /** Geist Mono with tabular figures, for every number (BPM, times, sizes, counters, dates). */
  Number: 'number',
} as const;
export type ThemeFontFamilies = ValueOf<typeof ThemeFontFamily>;

/**
 * Font weights. On Android a custom font cannot change weight through `fontWeight`,
 * so every weight is a separate font family in `fontFamily`.
 */
export const ThemeFontWeight = {
  Regular: 'regular',
  Medium: 'medium',
  Semibold: 'semibold',
  Bold: 'bold',
  Extrabold: 'extrabold',
} as const;
export type ThemeFontWeights = ValueOf<typeof ThemeFontWeight>;

/** Letter spacing in em, as in the design system. */
export const ThemeLetterSpacing = {
  Display: 'display',
  Title: 'title',
  Body: 'body',
  Label: 'label',
  Number: 'number',
} as const;
export type ThemeLetterSpacings = ValueOf<typeof ThemeLetterSpacing>;

/** Line height as a ratio of the font size. */
export const ThemeLineHeight = {
  Tight: 'tight',
  Snug: 'snug',
  Body: 'body',
} as const;
export type ThemeLineHeights = ValueOf<typeof ThemeLineHeight>;

/**
 * Ready-made text styles, matching what the OFO app design actually uses.
 *
 * - Spread a variant into a style and add the color from `theme.colors`; a variant never includes
 * color.
 * - For a different weight, replace `fontFamily` with another entry of `fontFamily.text`
 *   (e.g. `fontFamily.text.semibold` for a row title). `fontWeight` does not work: Android needs
 *   a separate font family per weight. Size, line height and tracking stay as defined.
 * - Every number uses a `number*` variant; all other text uses Geist.
 * - One-off sizes stay local to their component: the full player track title (26/800),
 *   bottom navigation labels and badges (10–11 px).
 */
export const ThemeTextVariant = {
  /** Title of the playlist details screen. */
  HeadingLg: 'headingLg',
  /** Bottom sheet titles and the track details title. */
  HeadingMd: 'headingMd',
  /** Section headings inside content, e.g. "Utwory w playliście". */
  HeadingSm: 'headingSm',
  /** Bold one-line titles: settings row titles (e.g. "Synchronizacja"), compact top bar title. */
  TitleSm: 'titleSm',
  /** Default text: list row titles, text fields. */
  Body: 'body',
  /** Toast text, segmented control, mini-player title, small buttons, messages in sheets. */
  BodySm: 'bodySm',
  /** Secondary lines: artist, track count, descriptions. */
  Caption: 'caption',
  /** Artist line in the mini-player, text field helper text, small meta. */
  CaptionSm: 'captionSm',
  /** Uppercase section labels and badges, never sentences. Usually colored `textTertiary`. */
  Label: 'label',
  /** The metronome BPM readout only. */
  NumberBpm: 'numberBpm',
  /** Times, sizes, dates and counters in rows, the seek bar and settings, e.g. "1:23", "−2:19", "4.2 MB". */
  NumberTime: 'numberTime',
} as const;
export type ThemeTextVariants = ValueOf<typeof ThemeTextVariant>;

/** Narrow type instead of `TextStyle`, so a variant can be spread into a Unistyles style without type conflicts. */
export type ThemeTextStyle = {
  fontFamily: string;
  fontSize: number;
  fontVariant?: 'tabular-nums'[];
  letterSpacing: number;
  lineHeight: number;
  textTransform?: 'uppercase';
};

export type ThemeTypography = {
  fontFamily: Record<ThemeFontFamilies, Record<ThemeFontWeights, string>>;
  fontSize: Record<ThemeTextVariants, number>;
  letterSpacing: Record<ThemeLetterSpacings, number>;
  lineHeight: Record<ThemeLineHeights, number>;
  variants: Record<ThemeTextVariants, ThemeTextStyle>;
};

// Layout

export const ThemeRadius = {
  /** The only corner radius, for every rectangle. */
  Default: 'default',
  /** Not a second radius: only true circles and pills (Play, switch, dots, progress bar). */
  Pill: 'pill',
} as const;
export type ThemeRadii = ValueOf<typeof ThemeRadius>;

/**
 * Spacing, 4 px base, for gaps, padding and margins.
 * The design also uses a few off-scale values locally (6, 10, 14 px in toasts, buttons and menus);
 * new components should stick to the scale.
 */
export const ThemeSpace = {
  None: 'none',
  /** Between stacked text lines: title and subtitle in rows and cards, seek bar and its time labels. */
  TwoXs: '2xs',
  /** Between an icon and its text in small elements (bottom nav item, download status, badge); title and subtitle in the top bar. */
  Xs: 'xs',
  /** Default gap between buttons and controls; vertical padding of rows, toasts and the sheet header. */
  Sm: 'sm',
  /** Between a cover and its text in list rows and the mini-player; gutter of the playlist card grid. */
  Md: 'md',
  /** Padding inside sections and cards; between sheet content and its actions. */
  Lg: 'lg',
  /** Between major blocks of the player and the metronome; between sections on the home and search screens. */
  Xl: 'xl',
  /** Between sections on the library and settings screens; bottom padding of sheets. */
  TwoXl: '2xl',
  /** Large separation, rare (e.g. empty states). */
  ThreeXl: '3xl',
  /** Not used by the current design; reserved for larger layouts. */
  FourXl: '4xl',
  /** Not used by the current design; reserved for larger layouts. */
  FiveXl: '5xl',
  /** Horizontal padding of screens, list rows, the top bar and sheets. Use it instead of `lg` for screen edges. */
  ScreenInset: 'screenInset',
} as const;
export type ThemeSpaces = ValueOf<typeof ThemeSpace>;

/** Fixed heights and dimensions of layout elements and controls. */
export const ThemeSize = {
  /** Top bar height. */
  TopBar: 'topBar',
  /** Bottom navigation height. */
  BottomNav: 'bottomNav',
  /** Mini-player height; it floats `space.sm` above the bottom navigation. */
  MiniPlayer: 'miniPlayer',
  /** Minimum height of list rows (tracks, playlists). */
  Row: 'row',
  /** Cover thumbnail size in list rows. */
  CoverRow: 'coverRow',
  /** Small buttons and icon buttons, compact segmented control. */
  ControlSm: 'controlSm',
  /** Default buttons, icon buttons and segmented control; also the minimum touch target. */
  ControlMd: 'controlMd',
  /** Previous/next icon buttons in the player; metronome controls. */
  ControlLg: 'controlLg',
  /** The main round play button in the player. */
  ControlXl: 'controlXl',
  /** Text field and autocomplete height. */
  Field: 'field',
  /** Text field height with a label, which sits above the text inside the field. */
  FieldLabelled: 'fieldLabelled',
  /** Badge height. */
  Badge: 'badge',
  /** Checkbox box, e.g. bulk selection in track rows. */
  Checkbox: 'checkbox',
  /** Width of the grab handle at the top of a bottom sheet. */
  SheetHandle: 'sheetHandle',
  /** Switch track height. */
  SwitchHeight: 'switchHeight',
  /** Switch thumb diameter; it sits centred in the track. */
  SwitchThumb: 'switchThumb',
  /** Switch track width. */
  SwitchWidth: 'switchWidth',
  /** Minimum touch area (Android guideline). Smaller controls extend to it with `hitSlop`. */
  TouchTarget: 'touchTarget',
} as const;
export type ThemeSizes = ValueOf<typeof ThemeSize>;

// Elevation

/**
 * Shadows as CSS `boxShadow` strings (React Native 0.76+ with the New Architecture, also works on
 * web). Elevation comes mainly from surface colors (`surfaceBase` → `surfaceRaised` →
 * `surfaceElevated`); shadows are only for elements that float above the content. Cards and rows
 * have none. In the dark theme shadows are stronger, in the light theme softer and warm-tinted;
 * `accent` is the same in both.
 */
export const ThemeShadow = {
  /** Small elements lifted off their track: the seek bar thumb. */
  Raised: 'raised',
  /** Floating layers: mini-player, toast, selection bar, autocomplete dropdown. */
  Overlay: 'overlay',
  /** Bottom sheets; the shadow is cast upwards. */
  Sheet: 'sheet',
  /** Accent glow, only for the active metronome beat dot. */
  Accent: 'accent',
} as const;
export type ThemeShadows = ValueOf<typeof ThemeShadow>;

// Motion

/** Animation durations in ms. */
export const ThemeDuration = {
  /** Hover and press feedback. */
  Fast: 'fast',
  /** Switches and tabs. */
  Base: 'base',
  /** Sheets. */
  Slow: 'slow',
} as const;
export type ThemeDurations = ValueOf<typeof ThemeDuration>;

/** Curves as control points for Reanimated's `Easing.bezier(...)`. */
export const ThemeEasing = {
  Out: 'out',
  InOut: 'inOut',
  /** Slight overshoot, e.g. the switch thumb. */
  Snap: 'snap',
} as const;
export type ThemeEasings = ValueOf<typeof ThemeEasing>;

export type CubicBezier = readonly [x1: number, y1: number, x2: number, y2: number];

/** Scale on press. */
export const ThemePressScale = {
  Button: 'button',
  IconButton: 'iconButton',
} as const;
export type ThemePressScales = ValueOf<typeof ThemePressScale>;

export type ThemeMotion = {
  duration: Record<ThemeDurations, number>;
  easing: Record<ThemeEasings, CubicBezier>;
  pressScale: Record<ThemePressScales, number>;
};

// Themes

export const ThemeName = {
  Light: 'light',
  Dark: 'dark',
} as const;
export type ThemeNames = ValueOf<typeof ThemeName>;

export const ThemePreference = {
  System: 'system',
  ...ThemeName,
} as const;
export type ThemePreferences = ValueOf<typeof ThemePreference>;

// Opacity

export const ThemeOpacity = {
  /** Disabled controls: buttons, icon buttons. */
  Disabled: 'disabled',
} as const;
export type ThemeOpacities = ValueOf<typeof ThemeOpacity>;

export type AppTheme = {
  colors: Record<ThemeColors, string>;
  motion: ThemeMotion;
  opacity: Record<ThemeOpacities, number>;
  radius: Record<ThemeRadii, number>;
  shadows: Record<ThemeShadows, string>;
  size: Record<ThemeSizes, number>;
  space: Record<ThemeSpaces, number>;
  typography: ThemeTypography;
};

export type AppThemes = Record<ThemeNames, AppTheme>;
