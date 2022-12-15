import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  root: {
    mt: 2,
  },
  autocomplete: {
    mt: 2,
  },
  formControl: {
    width: 350,
  },
  wrapper: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  label: {
    fontSize: 16,
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
  icon: {
    ml: 1,
    mt: 4,
    color: ({ palette }: AlyceTheme) => palette.primary.superLight,
  },
  plusIcon: {
    mr: 1,
  },
  tooltip: {
    width: 180,
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  optionContent: {
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
} as const;
