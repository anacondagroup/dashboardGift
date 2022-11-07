import { makeStyles } from '@mui/styles';

export const useStyles = makeStyles(theme => ({
  container: {
    borderRadius: 5,
    backgroundColor: `${theme.background.default}`,
    padding: `0 ${theme.spacing(1)} ${theme.spacing(1)} ${theme.spacing(1)}`,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  arrowDown: {
    margin: theme.spacing(1),
    pointerEvents: 'none',
  },
}));
