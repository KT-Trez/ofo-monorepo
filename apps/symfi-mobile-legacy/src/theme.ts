import { DefaultTheme } from 'react-native-paper';
import type { ThemeProp } from 'react-native-paper/src/types';

export const theme: ThemeProp = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#006878',
    onPrimary: '#ffffff',
    primaryContainer: '#a6eeff',
    onPrimaryContainer: '#001f25',
    /**
     * Secondary color is used for:
     * - FAB
     * - Controls, ex.: sliders, switches
     * - Highlighting text
     * - Progress bars
     * - Links, headlines
     */
    secondary: '#974811',
    onSecondary: '#ffffff',
    secondaryContainer: '#ffdbca',
    onSecondaryContainer: '#331200',
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#410002',
    background: '#fbfcfd',
    onBackground: '#191c1d',
    surface: '#fbfcfd',
    onSurface: '#191c1d',
    outline: '#6f797b',
    surfaceVariant: '#dbe4e7',
    onSurfaceVariant: '#3f484b',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    // additional colors
    inversePrimary: '#83d2e5',
    inverseSurface: '#2b3133',
    inverseOnSurface: '#ecf2f3',
    surfaceDisabled: '#d5dbdd',
    onSurfaceDisabled: '#515d61', // todo
    outlineVariant: '#BFC8CB',
    shadow: '#000000',
    scrim: '#000000',
    // tertiary: '#5D5B7D',
    // onTertiary: '#FFFFFF',
    // tertiaryContainer: '#E3DFFF',
    // onTertiaryContainer: '#191836',
    elevation: {
      level0: 'transparent',
      // Note: Color values with transparency cause RN to transfer shadows to children nodes
      // instead of View component in Surface. Providing solid background fixes the issue.
      // Opaque color values generated with `palette.primary99` used as background
      level1: '#ffffff', // palette.primary40, alpha 0.05
      level2: '#eff4f6', // palette.primary40, alpha 0.08
      level3: '#e9eff1', // palette.primary40, alpha 0.11
      level4: '#e4e9eb', // palette.primary40, alpha 0.12
      level5: '#dee3e5', // palette.primary40, alpha 0.14
    },
  },
  dark: false,
  roundness: 5,
};

// background, surface #fff
// error #b00020

// primary #00d35f (appbar, fab)
// primaryVariant #00bf75 (statusbar)

// secondary #d30074
// secondaryVariant #970067
