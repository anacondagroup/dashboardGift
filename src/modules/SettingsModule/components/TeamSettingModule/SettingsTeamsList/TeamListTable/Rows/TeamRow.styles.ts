import { AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

export const styles = {
  teamNameLink: {
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: 16,
    fontWeight: 700,
    lineHeight: '20px',
    color: ({ palette }: AlyceTheme) => palette.link.main,
  },
  membersCount: {
    textAlign: 'right',
    fontWeight: 700,
    fontSize: 16,
    color: ({ palette }: AlyceTheme) => palette.grey.main,
  },
  teamNameWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    position: 'relative',
  },
  createButton: {
    width: 150,
    height: 48,
    color: ({ palette }: AlyceTheme) => palette.common.white,
    backgroundColor: ({ palette }: AlyceTheme) => palette.green.dark,
    '&:hover': {
      color: ({ palette }: AlyceTheme) => palette.common.white,
      backgroundColor: ({ palette }: AlyceTheme) => palette.green.mountainMeadowLight,
    },
  },
  editLink: {
    fontSize: 12,
    fontWeight: 400,
  },
  blockedLink: {
    cursor: 'default',
    color: ({ palette }: AlyceTheme) => palette.grey.main,
  },
  teamInfoWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  archivedDate: {
    fontSize: 12,
    fontWeight: 700,
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
} as const;

// TODO: This styles should be removed after refactoring ActionMenus and LinkButton components from @alycecom/ui package.
export const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  editLink: {
    fontSize: 12,
    fontWeight: 400,
  },
  blockedLink: {
    cursor: 'default',
    color: palette.grey.main,
  },
  actionButton: {
    display: 'none',
    position: 'absolute',
    right: 0,
    color: palette.link.main,
    height: 36,
  },
  visibleActionButton: {
    display: 'flex',
  },
}));
