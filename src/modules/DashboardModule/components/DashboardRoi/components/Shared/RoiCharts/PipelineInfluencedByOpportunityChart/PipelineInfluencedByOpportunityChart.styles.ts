import { Theme } from '@mui/material';

const styles = {
  titleContainer: { display: 'flex', height: 68, justifyContent: 'space-between' },
  title: { marginLeft: ({ spacing }: Theme) => spacing(2) },
  container: { marginBottom: ({ spacing }: Theme) => spacing(5) },
} as const;

export default styles;
