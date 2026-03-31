// Color picking tool:
// https://m2.material.io/inline-tools/color/
// The standard is that lights and darks are one pick left/right of the main color.


export const themeSettings = {
  palette: {
    primary: {
      main: '#0094A2',
      light: '#00a9bc',
      veryLight: '#00b9ce',
      dark: '#01818a',
      veryDark: '#025e60',
      300: '#4ccedc',
      100: '#b1eaf0',
      50: '#e0f7f9',
    },
    secondary: {
      main: '#404fbd',
      light: '#5d69c8',
      veryLight: '#7a85d1',
      dark: '#3a47b3',
      veryDark: '#313ca7',
      100: '#c6caec',
      50: '#e8eaf7',
      900: '#1a1f87',
    },
    error: {
      main: '#f44336',
      light: '#ef5350',
      dark: '#e53935',
    },
    warning: {
      main: '#ff9800',
      light: '#ffa826',
      dark: '#fb8d00',
    },
    warningSoft: {
      main: '#ffc266',
      light: '#ffd490',
      dark: '#ffb44a',
    },
    info: {
      main: '#2196f3',
      light: '#42a4f5',
      dark: '#1f87e5',
    },
    success: {
      main: '#4caf50',
      light: '#66bb69',
      dark: '#43a046',
    },
    text: {
      black: '#212121',
      darkGrey: '#595959',
      lightGrey: '#a8a8a8',
      offWhite: '#e1e1e1',
      white: '#eeeeee',
    },
    misc: {
      ignoredBackground: '#cfd8dc',
      skeletonBackground: '#f3f3f3',
      skeletonForeground: '#ecebeb',
    },
  },
  spacing: size => `${ size * 0.5 }em`,
  breakpoints: {
    values: {
      xxs: 0,
      xs: 380,
      sm: 600,
      hmd: 780,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
  typography: {
    h1: {
      fontSize: '2.8rem',
      fontWeight: 500,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 500,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    h6: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
  },
};