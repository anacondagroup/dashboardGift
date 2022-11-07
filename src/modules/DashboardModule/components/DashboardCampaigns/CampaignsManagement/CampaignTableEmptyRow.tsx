import React from 'react';
import { Box, TableCell, TableRow } from '@mui/material';
import { TableLoadingLabel } from '@alycecom/ui';

import { ICustomTableColumn, IRowDataItem } from '../../../../../components/Shared/CustomTable/CustomTable.types';

interface IEmptyRowPropTypes<RowItem extends IRowDataItem> {
  columns: ICustomTableColumn<RowItem>[];
}

const CampaignTableEmptyRow = <RowItem extends IRowDataItem>({ columns }: IEmptyRowPropTypes<RowItem>): JSX.Element => (
  <TableRow>
    <TableCell padding="checkbox">
      <TableLoadingLabel isLoading render={() => '-'} />
    </TableCell>
    {columns.map(column => (
      <TableCell
        key={column.field}
        align={column.align}
        style={{ maxWidth: column.maxWidth, minWidth: column.minWidth, width: column.width }}
      >
        <Box pr={3}>
          <TableLoadingLabel align={column.align} isLoading render={() => '-'} />
        </Box>
      </TableCell>
    ))}
  </TableRow>
);

export default CampaignTableEmptyRow;
