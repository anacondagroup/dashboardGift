import React, { memo } from 'react';
import { Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(() => ({
  subtitle: {
    lineHeight: 1.5,
  },
}));

export interface IBreakdownHeaderProps {
  title: string;
  subtitle: string;
}

const BreakdownHeader = ({ title, subtitle }: IBreakdownHeaderProps) => {
  const classes = useStyles();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3">{title}</Typography>
        </Grid>
      </Grid>
      <Typography variant="subtitle2" className={classes.subtitle}>
        {subtitle}
      </Typography>
    </>
  );
};

export default memo(BreakdownHeader);
