import React, { memo } from 'react';
import { Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LoadingLabel, NumberFormat } from '@alycecom/ui';

const useStyles = makeStyles(({ spacing }) => ({
  money: {
    fontSize: '2rem',
    lineHeight: '1.31',
    fontWeight: 'bold',
  },
  title: {
    fontSize: '0.75rem',
    lineHeight: '1.35',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loader: {
    width: 36,
    marginTop: spacing(1),
    marginBottom: spacing(2),
  },
}));

export interface ITotalProps {
  totalCount: number;
  totalMoney: number;
  isLoading: boolean;
}

const Total = ({ totalMoney, totalCount, isLoading }: ITotalProps) => {
  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item>
        <Typography variant="h2" className={classes.money} data-testid="PlatformUsage.TotalAccepted">
          {isLoading ? (
            <LoadingLabel className={classes.loader} />
          ) : (
            <>
              <NumberFormat format="$0,0.00">{totalMoney}</NumberFormat>
            </>
          )}
        </Typography>
        <Typography variant="subtitle2" className={classes.title}>
          Gifts accepted ($)
        </Typography>
      </Grid>
      <Grid item>
        <Typography variant="h2" className={classes.money} data-testid="PlatformUsage.TotalAcceptedCount">
          {isLoading ? (
            <LoadingLabel className={classes.loader} />
          ) : (
            <>
              <NumberFormat format="0,0">{totalCount}</NumberFormat>
            </>
          )}
        </Typography>
        <Typography variant="subtitle2" className={classes.title}>
          Gifts accepted (#)
        </Typography>
      </Grid>
    </Grid>
  );
};

export default memo(Total);
