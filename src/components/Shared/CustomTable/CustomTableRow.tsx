import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { propertyByPath } from '@alycecom/utils';
import { TableLoadingLabel } from '@alycecom/ui';

import { ICustomTableColumn, IRowDataItem } from './CustomTable.types';

export const getFormattedValue = <T extends IRowDataItem>(
  { field, getValue, formatValue = v => v as string }: ICustomTableColumn<T>,
  dataItem: T,
): React.ReactNode => {
  const value = getValue ? getValue(dataItem) : propertyByPath(field)(dataItem);
  return value ? formatValue(value) : '-';
};

interface ICustomTableRowPropTypes<T extends IRowDataItem> {
  columns: ICustomTableColumn<T>[];
  isLoading: boolean;
  rowItem: T;
}

const CustomTableRow = <T extends IRowDataItem>({
  columns,
  isLoading,
  rowItem,
}: ICustomTableRowPropTypes<T>): JSX.Element => (
  <TableRow>
    {columns.map(column => (
      <React.Fragment key={column.field}>
        <TableCell role="cell">
          <TableLoadingLabel render={() => getFormattedValue(column, rowItem)} isLoading={isLoading} pr={2} />
        </TableCell>
      </React.Fragment>
    ))}
  </TableRow>
);

export default CustomTableRow;
