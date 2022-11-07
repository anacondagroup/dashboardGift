import { Theme } from '@mui/material';

const styles = {
  toggle: {
    marginTop: ({ spacing }: Theme) => spacing(1),
    marginLeft: ({ spacing }: Theme) => spacing(2),
    '& .MuiToggleButton-root': {
      textTransform: 'none',
      padding: ({ spacing }: Theme) => spacing(0, 2),
    },
  },
} as const;

export default styles;
