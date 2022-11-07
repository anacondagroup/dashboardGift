import React, { useCallback, useMemo } from 'react';
import { Box, Paper, Table, TableBody, TableContainer } from '@mui/material';
import type { RowLimit } from '@alycecom/ui';

import { generateFakeItems } from '../../../../../../../components/Shared/CustomTable/utils';

import RoiTableNoData from './RoiTableNoData';
import RoiTableRow from './RoiTableRow';
import { TRoiColumn } from './roiTable.types';
import RoiTableEmptyRow from './RoiTableEmptyRow';
import RoiTableHead, { IRoiTableHeadProps } from './RoiTableHead';
import RoiTableTools, { IRoiTableToolsProps } from './RoiTableTools';
import RoiTablePagination from './RoiTablePagination';
import RoiTableTitle from './RoiTableTitle';

const styles = {
  paper: {
    padding: 3,
  },
  tableHeader: {
    paddingBottom: 2,
    fontSize: '24px',
  },
  tooltip: {
    width: 190,
  },
  totalPlaceholder: {
    display: 'inline-block',
    mr: 1,
    width: 30,
    height: 8,
  },
} as const;

export type TRenderRowProps<RowItem> = {
  columns: TRoiColumn<RowItem>[];
  data: RowItem;
  getRowId: (rowData: RowItem) => number | string;
};

export interface IRoiTableProps<RowItem> extends IRoiTableHeadProps<RowItem> {
  title: string;
  parentTitle?: string;
  columns: TRoiColumn<RowItem>[];
  rows: RowItem[];
  isLoading?: boolean;
  total: number;
  limit: RowLimit;
  offset: number;
  getRowId: (rowData: RowItem) => number | string;
  renderRow?: (props: TRenderRowProps<RowItem>) => JSX.Element;
  onParentClick?: () => void;
  onOffsetChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: RowLimit) => void;
  toolbarProps?: IRoiTableToolsProps<RowItem>;
}

const RoiTable = <RowItem,>({
  title,
  parentTitle,
  columns,
  rows,
  isLoading = false,
  total,
  limit,
  offset,
  field,
  direction,
  getRowId,
  renderRow,
  onParentClick,
  onOffsetChange,
  onRowsPerPageChange,
  onSortChange,
  toolbarProps,
}: IRoiTableProps<RowItem>): JSX.Element => {
  const fakeItems = useMemo(() => generateFakeItems(limit), [limit]);
  const noData = rows.length === 0 && isLoading === false;

  const renderEmptyRows = useCallback(
    () => fakeItems.map(({ id }) => <RoiTableEmptyRow key={`EmptyRow-${id}`} columns={columns} />),
    [fakeItems, columns],
  );

  return (
    <Paper sx={styles.paper}>
      <RoiTableTitle
        title={title}
        total={total}
        parentTitle={parentTitle}
        isLoading={isLoading}
        onParentClick={onParentClick}
      />

      {toolbarProps && <RoiTableTools {...toolbarProps} />}

      <TableContainer component={Box}>
        <Table>
          <RoiTableHead field={field} direction={direction} columns={columns} onSortChange={onSortChange} />

          <TableBody>
            {isLoading && renderEmptyRows()}

            {!isLoading &&
              rows.map(data =>
                renderRow ? (
                  renderRow({ columns, data, getRowId })
                ) : (
                  <RoiTableRow key={`row-${getRowId(data)}`} columns={columns} data={data} getRowId={getRowId} />
                ),
              )}

            {noData && <RoiTableNoData colSpan={columns.length} />}
          </TableBody>
        </Table>
      </TableContainer>

      <RoiTablePagination
        total={total}
        limit={limit}
        offset={offset}
        onOffsetChange={onOffsetChange}
        onLimitChange={onRowsPerPageChange}
      />
    </Paper>
  );
};

export default RoiTable;
