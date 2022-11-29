export const styles = {
  root: {
    width: 'calc(100% - 320px)',
    minHeight: '100vh',
    ml: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'common.white',
  },
  nonIntegration: {
    height: '100vh',
    width: '100%',
  },
  integration: {
    display: 'flex',
    width: 890,
    height: 600,
    pt: 5,
  },
  iframe: {
    borderWidth: 0,
    width: '100%',
    height: '100%',
  },
  hidden: {
    display: 'none',
  },
} as const;
