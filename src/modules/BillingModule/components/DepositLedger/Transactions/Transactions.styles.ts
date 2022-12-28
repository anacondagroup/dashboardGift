import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  table: {
    tableLayout: 'fixed',
  },
  colDate: {
    width: 240,
  },
  positiveAmount: {
    color: ({ palette }: AlyceTheme) => palette.green.superDark,
  },
  paper: {
    width: '100%',
    p: 2,
    pt: 3,
    mt: 3,
  },
} as const;
