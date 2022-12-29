import { AlyceTheme } from '@alycecom/ui';
import { Theme } from '@mui/material';

export const styles = {
  tableContainer: {
    borderRadius: 2,
  },
  skeletonContainer: {
    height: '30px',
  },
  avatarContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '130px',
  },
  headerTitle: {
    color: 'primary.main',
    fontSize: 12,
  },
  tableParameter: {
    color: 'primary.main',
  },
  userContainer: {
    marginLeft: '10px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  tableCell: {
    padding: '0 5px',
  },
  tableCellBox: {
    display: 'flex',
    padding: 'none',
    justifyContent: 'center',
  },
  budgetAndRefreshContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: ({ spacing }: Theme) => spacing(0.5),
    gap: ({ spacing }: Theme) => spacing(0.5),
  },
  budgetField: {
    width: 100,
    textAlign: 'right',
    input: {
      color: 'primary.main',
      fontWeight: 'bold',
      textAlign: 'right',
    },
  },
  utilizationContainer: {
    textAlign: 'right',
    color: 'primary.main',
  },
  warningIcon: {
    cursor: 'unset',
    color: ({ palette }: AlyceTheme) => palette.error.main,
    marginRight: ({ spacing }: AlyceTheme) => spacing(2),
  },
} as const;
