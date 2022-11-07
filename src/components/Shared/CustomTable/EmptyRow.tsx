import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { TableLoadingLabel } from '@alycecom/ui';

import { ICustomTableColumn, IRowDataItem } from './CustomTable.types';

interface IEmptyRowPropTypes<RowItem extends IRowDataItem> {
  columns: ICustomTableColumn<RowItem>[];
}

const EmptyRow = <RowItem extends IRowDataItem>({ columns }: IEmptyRowPropTypes<RowItem>): JSX.Element => (
  <TableRow>
    {columns.map(column => (
      <React.Fragment key={column.field}>
        <TableCell role="cell">
          <TableLoadingLabel render={() => '-'} isLoading pr={2} />
        </TableCell>
      </React.Fragment>
    ))}
  </TableRow>
);

export default EmptyRow;
