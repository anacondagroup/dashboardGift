import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-start',
    height: 60,
  },
  kpiItem: {
    alignItems: 'center',
    justifyContent: 'center',
    mx: 3,
  },
  kpiTitle: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
  },
  startBalance: {
    fontSize: 24,
    lineHeight: '36px',
  },
  endBalance: {
    fontSize: 32,
    lineHeight: '40px',
  },
  dateKpi: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
  negative: {
    color: ({ palette }: AlyceTheme) => palette.red.main,
  },
  positive: {
    color: ({ palette }: AlyceTheme) => palette.green.dark,
  },
} as const;
