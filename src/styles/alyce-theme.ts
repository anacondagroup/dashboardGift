import { createTheme } from '@mui/material';
import { theme as commonTheme } from '@alycecom/ui';

export const theme = createTheme({
  ...commonTheme,
  breakpoints: {
    ...commonTheme.breakpoints,
    values: {
      xs: 0,
      sm: 600,
      md: 1024,
      lg: 1440,
      xl: 1680,
    },
  },
});
