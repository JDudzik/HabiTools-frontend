import {
  createTheme,
  ThemeProvider as MaterialThemeProvider,
  responsiveFontSizes,
} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { RootStyles } from './RootStyles';
import { themeSettings } from 'lib/data';

const materialDesignTheme = responsiveFontSizes(createTheme(themeSettings), { factor: 2 });

export const ThemeSetter = (props) => {
  return (
    <>
      <CssBaseline />
      <MaterialThemeProvider theme={ materialDesignTheme }>
        <EmotionThemeProvider theme={ materialDesignTheme }>
          <RootStyles>
            {props.children}
          </RootStyles>
        </EmotionThemeProvider>
      </MaterialThemeProvider>
    </>
  );
};
