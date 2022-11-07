import React from 'react';
import { Box, BoxProps, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ spacing, breakpoints, palette }) => ({
  root: {
    backgroundColor: palette.common.white,
    maxWidth: 1240,
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    margin: spacing(0, 'auto'),
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    [breakpoints.down('xs')]: {
      margin: spacing(0, -0.5),
      width: `calc(100% + ${spacing(1)})`,
    },
    [breakpoints.up('sm')]: {
      margin: spacing(0, -1),
      width: `calc(100% + ${spacing(2)})`,
    },
  },
}));

export interface IFilterLayoutProps extends Omit<BoxProps, 'title'> {
  title: JSX.Element;
  actions: JSX.Element;
  children: JSX.Element;
  afterFilters?: JSX.Element;
}

const FilterLayout = ({ title, actions, children, afterFilters, ...rootProps }: IFilterLayoutProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.root} {...rootProps}>
      <Grid container wrap="nowrap" justifyContent="space-between" alignItems="center">
        <Box display="flex" alignItems="center" width={1} maxWidth={930}>
          <Box display="flex" mr={2} alignItems="center" justifyContent="flex-end" flexShrink={0} width={125}>
            {title}
          </Box>
          <Box className={classes.grid}>{children}</Box>
        </Box>
        <Box minWidth={166} ml={1} flexShrink={0} display="flex" justifyContent="space-between">
          {actions}
        </Box>
      </Grid>
      {afterFilters}
    </Box>
  );
};

export default FilterLayout;
