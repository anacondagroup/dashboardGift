import React, { ReactNode, useCallback, useMemo, memo } from 'react';
import { SxProps, Table, TableBody, TableCell, TableRow } from '@mui/material';

import CustomTableRow from './CustomTableRow';
import { generateFakeItems } from './utils';
import { TABLE_SORT } from './customTable.constants';
import { TCustomTableSetValues } from './useCustomTable';
import { ICustomTableColumn, IRowDataItem } from './CustomTable.types';
import EmptyRow from './EmptyRow';
import CustomTableToolbar from './CustomTableToolbar';
import NoDataPlaceholder from './NoDataPlaceholder';
import CustomTableHead from './CustomTableHead';
import CustomTableFooter from './CustomTableFooter';

export interface IRenderRowPropTypes<Item extends IRowDataItem> {
  isLoading: boolean;
  columns: ICustomTableColumn<Item>[];
  rowDataItem: Item;
}

interface ICustomTablePropTypes<Item extends IRowDataItem> {
  sx?: SxProps;
  isLoading?: boolean;
  placeholder?: string;
  rowData: Item[];
  columns: ICustomTableColumn<Item>[];
  search: string;
  sortDirection: TABLE_SORT;
  sortField?: string | null;
  total?: number;
  limit: number;
  currentPage: number;
  setValues: TCustomTableSetValues;
  renderRow?: (props: IRenderRowPropTypes<Item>) => ReactNode;
  ToolbarComponent?: React.ElementType;
  ToolbarComponentProps?: Record<string, unknown>;
  NoDataComponent?: React.ElementType;
  NoDataComponentProps?: Record<string, unknown>;
  EmptyRowComponent?: React.ElementType;
  EmptyRowComponentProps?: Record<string, unknown>;
  TableHeadComponent?: React.ElementType;
  TableHeadComponentProps?: Record<string, unknown>;
  TableFooterComponent?: React.ElementType;
  TableFooterComponentProps?: Record<string, unknown>;
}

const CustomTable = <CustomTableRowItem extends IRowDataItem>({
  isLoading = false,
  placeholder = 'Search gifts',
  sx,
  columns,
  rowData,
  search,
  sortDirection,
  sortField,
  limit,
  total = 0,
  currentPage,
  setValues,
  renderRow,
  ToolbarComponent = CustomTableToolbar,
  ToolbarComponentProps = {},
  NoDataComponent = NoDataPlaceholder,
  NoDataComponentProps = {},
  EmptyRowComponent = EmptyRow,
  EmptyRowComponentProps = {},
  TableHeadComponent = CustomTableHead,
  TableHeadComponentProps = {},
  TableFooterComponent = CustomTableFooter,
  TableFooterComponentProps = {},
}: ICustomTablePropTypes<CustomTableRowItem>): JSX.Element => {
  const fakeItems = useMemo(() => generateFakeItems(limit), [limit]);

  const renderRows = useCallback(() => {
    if (isLoading) {
      return fakeItems.map(({ id }) => <EmptyRowComponent key={id} columns={columns} {...EmptyRowComponentProps} />);
    }
    if (renderRow) {
      return rowData.map(rowDataItem => renderRow({ columns, rowDataItem, isLoading }));
    }
    return rowData.map(rowDataItem => (
      <CustomTableRow key={rowDataItem.id} columns={columns} isLoading={isLoading} rowItem={rowDataItem} />
    ));
  }, [isLoading, columns, renderRow, rowData, EmptyRowComponent, EmptyRowComponentProps, fakeItems]);

  const handleSortChange = useCallback(
    (sort: string) => {
      setValues({
        sortField: sort,
        sortDirection: sortField === sort && sortDirection === TABLE_SORT.DESC ? TABLE_SORT.ASC : TABLE_SORT.DESC,
        currentPage: 1,
      });
    },
    [sortField, sortDirection, setValues],
  );

  return (
    <>
      <ToolbarComponent placeholder={placeholder} search={search} setValues={setValues} {...ToolbarComponentProps} />
      <Table padding="none" sx={sx}>
        <TableHeadComponent
          columns={columns}
          sortDirection={sortDirection}
          sortField={sortField}
          onSortChange={handleSortChange}
          {...TableHeadComponentProps}
        />
        <TableBody>
          {renderRows()}
          {rowData.length === 0 && !isLoading && (
            <TableRow>
              <TableCell colSpan={12}>
                <NoDataComponent {...NoDataComponentProps} />
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooterComponent
          limit={limit}
          total={total}
          currentPage={currentPage}
          onPaginationChange={setValues}
          {...TableFooterComponentProps}
        />
      </Table>
    </>
  );
};

export default memo(CustomTable) as typeof CustomTable;
