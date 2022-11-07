import { Theme } from '@mui/material';

const styles = {
  title: { margin: '4px 0 32px 16px' },
  container: { marginBottom: ({ spacing }: Theme) => spacing(5) },
} as const;

export default styles;
