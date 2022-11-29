export const styles = {
  root: {
    position: 'fixed',
    top: 10,
    right: 0,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    pl: 44,
  },
  button: {
    fontSize: 16,
    height: 28,
    fontWeight: 400,
  },
  active: {
    color: 'common.white',
    backgroundColor: 'primary.main',
    '&:hover': {
      color: 'common.white',
      backgroundColor: 'primary.main',
    },
  },
  inactive: {
    color: 'primary.main',
    backgroundColor: 'common.white',
    '&:hover': {
      color: 'primary.main',
      backgroundColor: 'common.white',
    },
  },
} as const;
