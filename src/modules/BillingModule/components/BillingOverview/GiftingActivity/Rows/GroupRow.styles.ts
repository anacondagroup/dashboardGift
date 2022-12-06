import { AlyceTheme } from '@alycecom/ui';

export const styles = {
  tableRow: {
    cursor: 'pointer',
  },
  notExpandableRow: {
    ml: 2.25,
  },
  groupNameRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  groupNameWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  groupNameText: {
    color: ({ palette }: AlyceTheme) => palette.primary.main,
    fontWeight: 'bold',
    fontSize: 14,
    lineHeight: '18px',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  groupStartBalance: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
    fontWeight: 400,
    fontSize: 14,
    lineHeight: '16px',
    ml: 2.5,
    mt: 0.5,
  },
  icon: {
    fontSize: 14,
    mr: 0.5,
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
} as const;
