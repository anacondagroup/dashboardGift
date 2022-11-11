import { Theme } from '@mui/material';

export const styles = {
  titleContainer: { display: 'flex', height: 68, justifyContent: 'space-between' },
  title: { marginLeft: ({ spacing }: Theme) => spacing(2) },
  container: { height: 940, marginBottom: ({ spacing }: Theme) => spacing(7) },
} as const;
