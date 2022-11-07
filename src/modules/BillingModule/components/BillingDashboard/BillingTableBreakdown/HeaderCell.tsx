import React from 'react';
import { TableCell, TableCellProps } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles(theme => ({
  headerCell: {
    fontSize: '0.75rem',
    lineHeight: '1.33',
    verticalAlign: 'bottom',
    paddingBottom: theme.spacing(1),
  },
}));

export type THeaderCellProps = TableCellProps;

const HeaderCell = (props: THeaderCellProps): JSX.Element => {
  const classes = useStyles();

  return <TableCell className={classes.headerCell} {...props} />;
};

export default HeaderCell;
