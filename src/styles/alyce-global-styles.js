import { makeStyles } from '@mui/styles';
import { GlobalFonts } from '@alycecom/ui';

import 'lato-font/css/lato-font.css';
import './transitions.css';
import './appcues.css';

const useStyles = makeStyles(({ typography, palette }) => ({
  '@global': {
    ...GlobalFonts,

    '*, *::before, *::after': {
      boxSizing: 'inherit',
    },
    body: {
      margin: 0,
      backgroundColor: '#fafafa',
    },
    '@media print': {
      body: {
        backgroundColor: '#fff',
      },
    },

    html: {
      boxSizing: 'border-box',
      '-webkit-font-smoothing': 'antialiased',
      '-moz-osx-font-smoothing': 'grayscale',
      fontSize: 16,
      fontWeight: typography.body2.fontWeight,
      fontFamily: typography.body2.fontFamily,
      lineHeight: typography.body2.lineHeight,
      color: '#4a4a4a',
    },
    a: {
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: 'bold',
      color: palette.link.main,
    },
    'a:hover': {
      color: palette.link.dark,
    },
    'a:active': {
      color: palette.link.light,
    },

    '.fas.fa-level-up, .fa-level-up': {
      transform: 'rotate(45deg)',
      marginLeft: 5,
    },
    '.fa.fa-level-up': {
      transform: 'rotate(45deg)',
      top: -5,
      marginLeft: 5,
    },
  },
}));

const GlobalStyles = () => {
  useStyles();

  return null;
};

export default GlobalStyles;
