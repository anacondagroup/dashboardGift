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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export type TRenderTableHeaderProps = {};

export interface IRoiTableProps<RowItem> extends IRoiTableHeadProps<RowItem> {
  title?: string;
  header?: React.ReactElement;
  renderTableHeader?: (props: TRenderTableHeaderProps) => JSX.Element;
  columns: TRoiColumn<RowItem>[];
  rows: RowItem[];
  isLoading?: boolean;
  total: number;
  limit: RowLimit;
  offset: number;
  getRowId: (rowData: RowItem) => number | string;
  renderRow?: (props: TRenderRowProps<RowItem>) => JSX.Element;
  onOffsetChange: (newPage: number) => void;
  onRowsPerPageChange: (newLimit: RowLimit) => void;
  toolbarProps?: IRoiTableToolsProps<RowItem>;
  headerControls?: React.ReactElement;
}

const RoiTable = <RowItem,>({
  title = '',
  header,
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
  onOffsetChange,
  onRowsPerPageChange,
  onSortChange,
  toolbarProps,
  headerControls,
}: IRoiTableProps<RowItem>): JSX.Element => {
  const fakeItems = useMemo(() => generateFakeItems(limit), [limit]);
  const noData = rows.length === 0 && isLoading === false;

  const renderEmptyRows = useCallback(
    () => fakeItems.map(({ id }) => <RoiTableEmptyRow key={`EmptyRow-${id}`} columns={columns} />),
    [fakeItems, columns],
  );

  return (
    <Paper sx={styles.paper}>
      {header ? (
        <Box>{header}</Box>
      ) : (
        <RoiTableTitle title={title} total={total} isLoading={isLoading}>
          {headerControls}
        </RoiTableTitle>
      )}

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
