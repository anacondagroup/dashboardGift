import React, { memo } from 'react';
import { TableRow, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, TableLoadingLabel } from '@alycecom/ui';

const useStyle = makeStyles<AlyceTheme>({
  line: {
    height: 56,
  },
});

const EmptyRowPlaceholder = (): JSX.Element => {
  const classes = useStyle();
  return (
    <TableRow className={classes.line}>
      <TableCell padding="checkbox">
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
      <TableCell role="cell">
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
      <TableCell role="cell" width={300}>
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
      <TableCell role="cell" width={300}>
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
      <TableCell role="cell" width={200}>
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
      <TableCell role="cell" width={200}>
        <TableLoadingLabel render={() => '-'} isLoading pr={2} />
      </TableCell>
    </TableRow>
  );
};

export default memo(EmptyRowPlaceholder);
