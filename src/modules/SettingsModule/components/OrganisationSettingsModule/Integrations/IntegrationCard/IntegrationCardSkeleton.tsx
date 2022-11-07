import React from 'react';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Box, Grid, Skeleton } from '@mui/material';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    border: `solid 1px ${palette.divider}`,
    padding: spacing(3),
    width: 362,
    minWidth: 200,
    minHeight: 344,
  },
  titleContainer: {
    height: '35px',
  },
}));

const IntegrationCardSkeleton = (): JSX.Element => {
  const classes = useStyles();

  return (
    <Grid data-testid="WorkatoIntegrations.CardSkeleton" item container direction="column" className={classes.root}>
      <Grid container className={classes.titleContainer}>
        <Grid item xs={10}>
          <Skeleton variant="text" width={80} />
        </Grid>
        <Grid item xs={2}>
          <Skeleton variant="circular" width={40} height={40} />
        </Grid>
      </Grid>

      <Grid item>
        <Box pb={1}>
          <Skeleton variant="text" width={300} />
          <Skeleton variant="text" width={300} />
          <Skeleton variant="text" width={300} />
          <Skeleton variant="text" width={300} />
          <Skeleton variant="text" width={230} />
        </Box>
      </Grid>

      <Grid item>
        <Skeleton variant="rectangular" width={100} height={48} />
      </Grid>
    </Grid>
  );
};

export default IntegrationCardSkeleton;
