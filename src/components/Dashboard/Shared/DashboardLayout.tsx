import React from 'react';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

const useStyles = makeStyles(({ spacing }) => ({
  layout: {
    display: 'flex',
    flexDirection: 'column',
    padding: spacing(3),
  },
}));

export interface IDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayout = ({ className, children }: IDashboardLayoutProps): JSX.Element => {
  const classes = useStyles();
  return <div className={classNames(classes.layout, className)}>{children}</div>;
};

export default DashboardLayout;
