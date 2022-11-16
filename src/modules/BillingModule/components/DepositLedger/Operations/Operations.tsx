import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Link,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory, pickNotEmptyAndNil } from '@alycecom/utils';
import {
  AlyceTheme,
  DateFormat,
  IColumn,
  IDefaultRowData,
  NumberFormat,
  TableCellTooltip,
  TableDataRow,
  TableHeadRow,
} from '@alycecom/ui';
import classNames from 'classnames';
import qs from 'query-string';

import {
  getOperations,
  getOperationsIsLoading,
  getPagination,
  IOperationType,
  getTypes,
  setCurrentPage,
  getSelectedTypes,
} from '../../../store/operations';
import { getHierarchyIsLoading } from '../../../store/customerOrg';
import { IOperation } from '../../../types';
import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { tabsKeys } from '../../../../../constants/sidebarTabs.constants';
import { OperationType } from '../../../constants/operations.constants';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  table: {
    tableLayout: 'fixed',
  },
  colDate: {
    width: 240,
  },
  positiveAmount: {
    color: palette.green.superDark,
  },
}));

type TRowData = IDefaultRowData & IOperation;

const Operations = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const operations = useSelector(getOperations);
  const operationsIsLoading = useSelector(getOperationsIsLoading);
  const hierarchyIsLoading = useSelector(getHierarchyIsLoading);
  const selectedTypes = useSelector(getSelectedTypes);

  const isLoading = operationsIsLoading || hierarchyIsLoading;
  const isTableEmpty = !isLoading && operations.length === 0;

  const types = useSelector(getTypes);

  const typesNamesMap = useMemo(() => {
    const childrenTypes = types.reduce((acc: IOperationType[], item) => [...acc, ...(item.children || [])], []);
    return childrenTypes.reduce<Record<string, string>>(
      (map, type) => ({
        ...map,
        [type.id]: type.name,
      }),
      {},
    );
  }, [types]);

  const showRemainingDeposit = selectedTypes.length === types.length;

  const rows = useMemo(() => fakeItemsFactory(operations, isLoading, id => ({ id: String(id) })) as TRowData[], [
    isLoading,
    operations,
  ]);

  const pagination = useSelector(getPagination);

  const handleChangePage = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      dispatch(setCurrentPage(page + 1));
    },
    [dispatch],
  );

  const handleClickGiftLink = useCallback(
    (giftId?: number) => {
      if (giftId) {
        trackEvent('Deposit ledger — reference clicked', { giftId });
      }
    },
    [trackEvent],
  );

  /* eslint-disable react/prop-types */
  const columns = useMemo<IColumn<TRowData>[]>(
    () => [
      {
        id: 'operatedAt',
        name: 'Date',
        hideSorting: true,
        render: ({ id, operatedAt }) => (
          <span data-testid={`DepositLedger.List.OperatedAt.${id}`}>
            <DateFormat value={operatedAt} format="YYYY-MM-DD" />
          </span>
        ),
      },
      {
        id: 'amount',
        name: 'Amount',
        hideSorting: true,
        render: ({ id, amount }) => (
          <span
            data-testid={`DepositLedger.List.Amount.${id}`}
            className={classNames({ [classes.positiveAmount]: amount.amount > 0 })}
          >
            <TableCellTooltip title={<NumberFormat format="$0,0.00">{amount.amount}</NumberFormat>} />
          </span>
        ),
      },
      ...(showRemainingDeposit
        ? [
            {
              id: 'remaining',
              name: 'Balance',
              hideSorting: true,
              render: ({ id, accountRemaining }: TRowData) => (
                <span
                  data-testid={`DepositLedger.List.Remaining.${id}`}
                  className={classNames({ [classes.positiveAmount]: accountRemaining.amount > 0 })}
                >
                  <TableCellTooltip title={<NumberFormat format="$0,0.00">{accountRemaining.amount}</NumberFormat>} />
                </span>
              ),
            },
          ]
        : []),
      {
        id: 'type',
        name: 'Operation type',
        hideSorting: true,
        render: ({ id, typeId }) => (
          <span data-testid={`DepositLedger.List.Type.${id}`}>
            <TableCellTooltip title={<>{typesNamesMap[typeId] || typeId}</>} />
          </span>
        ),
      },
      {
        id: 'reference',
        name: 'Reference',
        hideSorting: true,
        render: ({ id, references, typeId }) => {
          let ref: JSX.Element;
          let refTitle = '';

          if (typeId === OperationType.GiftingWithdrawal && references && references?.giftId) {
            const params = {
              contact_id: references.contactId,
              gift_id: references.giftId,
              status_id: references.statusId,
              sidebar_tab: tabsKeys.SEND_GIFT,
            };
            const link = `${window.APP_CONFIG.dashboardHost}?${qs.stringify(pickNotEmptyAndNil(params))}`;
            ref = (
              <Link
                data-testid={`DepositLedger.List.Reference.Link.${id}`}
                href={link}
                target="_blank"
                onClick={() => handleClickGiftLink(references.giftId)}
              >
                gift #{references.giftId}
              </Link>
            );
            refTitle = `gift #${references.giftId}`;
          }

          if (typeId === OperationType.HistoricInvoice && references?.invoiceId) {
            refTitle = `inv. #${references.invoiceId}`;
            ref = <span>{refTitle}</span>;
          }

          return (
            <span data-testid={`DepositLedger.List.Reference.${id}`}>
              <TableCellTooltip title={refTitle} renderLabel={() => ref} />
            </span>
          );
        },
      },
      {
        id: 'note',
        name: 'Note',
        hideSorting: true,
        render: ({ id, comment }) => (
          <span data-testid={`DepositLedger.List.Note.${id}`}>
            <TableCellTooltip title={<>{comment || ''}</>} />
          </span>
        ),
      },
    ],
    [typesNamesMap, showRemainingDeposit, classes.positiveAmount, handleClickGiftLink],
  );

  return (
    <Box width={1} mt={2} pt={3} pr={3} pb={1} pl={3}>
      {isTableEmpty ? (
        <Box width={1} p={1} display="flex" justifyContent="center" alignItems="center">
          <Typography className="H3-Dark">Nothing to show</Typography>
        </Box>
      ) : (
        <Table className={classes.table}>
          <colgroup>
            <col className={classes.colDate} />
            <col />
            {showRemainingDeposit && <col />}
            <col />
            <col />
            <col />
          </colgroup>
          <TableHead>
            <TableHeadRow columns={columns} />
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableDataRow columns={columns} data={row} isLoading={isLoading} key={row.id} />
            ))}
          </TableBody>
          {pagination.total > pagination.perPage && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  data-testid="Operations.Pagination"
                  rowsPerPageOptions={[pagination.perPage]}
                  colSpan={6}
                  count={pagination.total}
                  rowsPerPage={pagination.perPage}
                  page={pagination.currentPage - 1}
                  SelectProps={{
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      )}
    </Box>
  );
};

export default memo(Operations);
