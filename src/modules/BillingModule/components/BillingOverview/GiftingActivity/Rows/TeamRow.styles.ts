import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  teamNameRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  teamName: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
    fontWeight: 400,
    pl: 2,
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
  },
  indent: {
    pl: 2,
  },
  link: {
    textDecoration: 'underline',
  },
  teamStartBalance: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '16px',
    ml: 2,
    mt: 0.5,
  },
  linkButton: {
    fontSize: 14,
    lineHeight: '18px',
    color: ({ palette }: AlyceTheme) => palette.link.main,
    textDecoration: 'underline',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  archivedAt: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
  },
} as const;
