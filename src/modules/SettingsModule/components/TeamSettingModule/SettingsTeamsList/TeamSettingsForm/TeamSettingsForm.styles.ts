import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    pt: 2,
  },
  content: {
    width: '100%',
    mt: 1,
    px: 3,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
  cancelButton: {
    width: 100,
    height: 48,
    borderRadius: 1,
    color: 'green.dark',
    border: ({ palette }: AlyceTheme) => `1px solid ${palette.green.dark}`,
    '&:hover': {
      borderColor: ({ palette }: AlyceTheme) => palette.green.mountainMeadowLight,
    },
  },
  submitButton: {
    width: 100,
    height: 48,
    borderRadius: 1,
    color: ({ palette }: AlyceTheme) => palette.common.white,
    backgroundColor: ({ palette }: AlyceTheme) => palette.green.dark,
    '&:hover': {
      backgroundColor: ({ palette }: AlyceTheme) => palette.green.mountainMeadowLight,
    },
  },
} as const;
