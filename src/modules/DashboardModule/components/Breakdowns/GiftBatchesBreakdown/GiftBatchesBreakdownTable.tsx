import React, { memo, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  TablePagination,
  TableSortLabel,
  Box,
} from '@mui/material';
import { IColumn, IDefaultRowData, TableDataRow, TableCellTooltip, LinkButton, AlyceTheme } from '@alycecom/ui';
import { fakeItemsFactory } from '@alycecom/utils';
import moment from 'moment';
import { makeStyles } from '@mui/styles';
import { useSetUrlQuery } from '@alycecom/hooks';

import {
  getGiftBatchesList,
  getIsGiftBatchesLoading,
  TGiftBatches,
  TPagination,
  TSort,
  GiftBatchesTableFields,
} from '../../../store/breakdowns/giftBatches';
import { GiftingFlowType } from '../../../../GiftingFlow/types/giftingFlow.types';
import { tabsKeys } from '../../../../../constants/sidebarTabs.constants';

type TRowData = IDefaultRowData & TGiftBatches;

export interface IGiftsBatchesBreakdownProps {
  sort: TSort;
  children: React.ReactNode;
  pagination: TPagination;
  onChangeSort: (newSort: string) => void;
  onPageChange: (_: unknown, nextPage: number) => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  colorSuccess: {
    color: palette.green.fruitSalad,
    fontWeight: 'bold',
  },
  tableWidth: {
    maxWidth: 400,
  },
  buttonTotal: {
    background: 'none',
    border: 'none',
    padding: 0,
    font: 'inherit',
    cursor: 'pointer',
    outline: 'inherit',
    color: palette.link.main,
    fontWeight: 'bold',
  },
}));

const GiftBatchesBreakdownTable = ({
  sort,
  children,
  pagination,
  onChangeSort,
  onPageChange,
}: IGiftsBatchesBreakdownProps) => {
  const classes = useStyles();
  const updateUrlFunc = useSetUrlQuery();
  const giftBatchesList = useSelector(getGiftBatchesList);
  const isLoading = useSelector(getIsGiftBatchesLoading);

  const getFormattedDate = useCallback((itemDate: string | null) => {
    const formattedDate: string = itemDate ? moment(itemDate).format('ll') : '-';
    return formattedDate;
  }, []);

  const handleOpenGiftFlowBar = useCallback(
    (batchId: number) => {
      updateUrlFunc({
        batchId,
        flowType: GiftingFlowType.Prospecting,
        sidebarTab: tabsKeys.SEND_GIFT,
      });
    },
    [updateUrlFunc],
  );

  /* eslint-disable react/prop-types */
  const columns = useMemo<IColumn<TRowData>[]>(
    () => [
      {
        id: GiftBatchesTableFields.GiftsCount,
        name: 'total Recipients',
        align: 'left',
        render: ({ giftsCount, sentAt, id }) =>
          sentAt ? (
            <span data-testid="GiftBatchesBreakdown.GiftTable.Status">{giftsCount ?? '-'}</span>
          ) : (
            <LinkButton
              data-testid="GiftBatchesBreakdown.GiftTable.GiftsCount.Button"
              className={classes.buttonTotal}
              onClick={() => handleOpenGiftFlowBar(id)}
            >
              {giftsCount}
            </LinkButton>
          ),
      },
      {
        id: GiftBatchesTableFields.DefaultProduct,
        name: 'default Gift',
        align: 'left',
        render: ({ defaultProduct }) => (
          <Box
            maxWidth={200}
            textOverflow="ellipsis"
            overflow="hidden"
            data-testid="GiftBatchesBreakdown.GiftTable.DefaultProduct"
          >
            <TableCellTooltip title={<span>{defaultProduct?.name ?? '-'}</span>} />
          </Box>
        ),
      },
      {
        id: GiftBatchesTableFields.Campaign,
        name: 'campaign',
        align: 'left',
        render: ({ campaign }) => (
          <Box
            maxWidth={200}
            textOverflow="ellipsis"
            overflow="hidden"
            data-testid="GiftBatchesBreakdown.GiftTable.Campaign"
          >
            <TableCellTooltip title={<span>{campaign?.name ?? '-'}</span>} />
          </Box>
        ),
      },
      {
        id: GiftBatchesTableFields.SendAs,
        name: 'sent By(as)',
        align: 'left',
        render: ({ sendAs }) => (
          <Box
            maxWidth={200}
            textOverflow="ellipsis"
            overflow="hidden"
            data-testid="GiftBatchesBreakdown.GiftTable.SendAs"
          >
            <TableCellTooltip title={<span>{sendAs?.fullName ?? '-'}</span>} />
          </Box>
        ),
      },
      {
        id: GiftBatchesTableFields.SentAt,
        name: 'sent On',
        align: 'left',
        render: ({ sentAt }) => (
          <span data-testid="GiftBatchesBreakdown.GiftTable.SendAt">{getFormattedDate(sentAt)}</span>
        ),
      },
      {
        id: GiftBatchesTableFields.Status,
        name: 'status',
        align: 'left',
        hideSorting: true,
        render: ({ sentAt }) =>
          sentAt ? (
            <span data-testid="GiftBatchesBreakdown.GiftTable.Status">
              <span className={classes.colorSuccess}>Sent</span> (see above)
            </span>
          ) : (
            <span data-testid="GiftBatchesBreakdown.GiftTable.Status">Not yet sent</span>
          ),
      },
    ],
    [getFormattedDate, classes, handleOpenGiftFlowBar],
  );

  const rows = useMemo(() => fakeItemsFactory(giftBatchesList, isLoading, id => ({ id })) as TRowData[], [
    giftBatchesList,
    isLoading,
  ]);

  return (
    <>
      {children}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map(column => (
              <TableCell key={column.id}>
                {!column.hideSorting && (
                  <TableSortLabel
                    direction={sort.direction}
                    active={sort.column === column.id}
                    onClick={() => onChangeSort(column.id)}
                  >
                    {column.name}
                  </TableSortLabel>
                )}
                {column.hideSorting && column.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableDataRow
              columns={columns}
              data={row}
              isLoading={isLoading}
              key={row.id}
              className={classes.tableWidth}
            />
          ))}
        </TableBody>

        {pagination.total > pagination.perPage && (
          <TableFooter>
            <TableRow>
              <TablePagination
                data-testid="GiftBatches.Table.Pagination"
                rowsPerPageOptions={[pagination.perPage]}
                colSpan={12}
                count={pagination.total}
                rowsPerPage={pagination.perPage}
                page={pagination.currentPage}
                SelectProps={{
                  native: true,
                }}
                onPageChange={onPageChange}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </>
  );
};

export default memo(GiftBatchesBreakdownTable);
