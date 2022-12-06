import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  KPIValueBudget: {
    pr: 2,
    color: ({ palette }: AlyceTheme) => palette.green.dark,
    '&:hover': {
      color: ({ palette }: AlyceTheme) => palette.green.dark,
    },
  },
  negativeDeposit: {
    color: ({ palette }: AlyceTheme) => palette.red.main,
    '&:hover': {
      color: ({ palette }: AlyceTheme) => palette.red.main,
    },
  },
  button: {
    ml: -1,
    fontSize: 12,
    color: ({ palette }: AlyceTheme) => palette.link.main,
    '&:hover': {
      color: ({ palette }: AlyceTheme) => palette.link.main,
    },
  },
} as const;
