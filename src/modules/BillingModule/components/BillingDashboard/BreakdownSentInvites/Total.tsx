import React, { memo } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LoadingLabel, NumberFormat } from '@alycecom/ui';

const useStyles = makeStyles(({ spacing }) => ({
  count: {
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

export interface IInvitesTotalProps {
  totalCount: number;
  isLoading: boolean;
}

const Total = ({ totalCount, isLoading }: IInvitesTotalProps) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h2" className={classes.count} data-testid="PlatformUsage.TotalInvites">
        {isLoading ? (
          <LoadingLabel className={classes.loader} />
        ) : (
          <NumberFormat format="0,0">{totalCount}</NumberFormat>
        )}
      </Typography>
      <Typography variant="subtitle2" className={classes.title}>
        Invites sent
      </Typography>
    </>
  );
};

export default memo(Total);
