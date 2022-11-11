import { Theme } from '@mui/material';

export const styles = {
  download: { display: 'flex', gap: ({ spacing }: Theme) => spacing(1), '&:hover': { textDecoration: 'underline' } },
  button: { height: 32 },
} as const;
