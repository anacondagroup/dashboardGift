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
  Paper,
} from '@mui/material';
import { fakeItemsFactory, pickNotEmptyAndNil } from '@alycecom/utils';
import {
  DateFormat,
  IColumn,
  IDefaultRowData,
  NumberFormat,
  TableCellTooltip,
  TableDataRow,
  TableHeadRow,
} from '@alycecom/ui';
import qs from 'query-string';
import {
  TTransaction,
  useGetTransactionsQuery,
  useGetTransactionTypesQuery,
  TransactionType,
  useGetOrganizationBillingHierarchyQuery,
  useGetOrganizationQuery,
} from '@alycecom/services';
import { SHORT_DATE_FORMAT } from '@alycecom/modules';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { tabsKeys } from '../../../../../constants/sidebarTabs.constants';
import {
  getTransactionTypeIds,
  getPagination,
  getDateRange,
} from '../../../store/ui/transactionsFilters/transactionsFilters.selectors';
import { getTransactionTypeNamesMap } from '../../../helpers/billingTransactions.helpers';
import { setCurrentPage } from '../../../store/ui/transactionsFilters/transactionsFilters.reducer';
import { getSelectedGroupOrTeam } from '../../../store/billing.selectors';

import { styles } from './Transactions.styles';

type TRowData = IDefaultRowData & TTransaction;

const Transactions = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { data: organization } = useGetOrganizationQuery();
  const orgId = organization?.id;

  const { isFetching: hierarchyIsFetching } = useGetOrganizationBillingHierarchyQuery();

  const { data: transactionTypes = [], isFetching: isTransactionTypesFetching } = useGetTransactionTypesQuery();

  const {
    deposit: { accountId },
  } = useSelector(getSelectedGroupOrTeam);
  const { total, perPage, currentPage } = useSelector(getPagination);
  const { from, to } = useSelector(getDateRange);
  const operationTypes = useSelector(getTransactionTypeIds);

  const { data: operations, isFetching } = useGetTransactionsQuery(
    {
      accountId,
      filters: {
        dateRange: from && to ? { from, to, toIncluded: true, fromIncluded: true } : undefined,
        operationTypes,
        page: currentPage,
        perPage,
      },
    },
    { skip: isTransactionTypesFetching || !orgId, refetchOnMountOrArgChange: true },
  );

  const selectedTransactionTypes = useSelector(getTransactionTypeIds);

  const isLoading = isFetching || hierarchyIsFetching;
  const isTableEmpty = !isLoading && operations?.data?.length === 0;

  const showRemainingDeposit = selectedTransactionTypes.length === transactionTypes.length;

  const typeNamesMap = useMemo(() => getTransactionTypeNamesMap(transactionTypes), [transactionTypes]);

  const rows = useMemo(
    () => fakeItemsFactory(operations?.data ?? [], isLoading, id => ({ id: String(id) })) as TRowData[],
    [isLoading, operations],
  );

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

  const handleClickInvoiceLink = useCallback(() => {
    trackEvent('Invoice reference — clicked');
  }, [trackEvent]);

  /* eslint-disable react/prop-types */
  const columns = useMemo<IColumn<TRowData>[]>(
    () => [
      {
        id: 'operatedAt',
        name: 'Date',
        hideSorting: true,
        render: ({ id, operatedAt }) => (
          <span data-testid={`DepositLedger.List.OperatedAt.${id}`}>
            <DateFormat value={operatedAt} format={SHORT_DATE_FORMAT} />
          </span>
        ),
      },
      {
        id: 'amount',
        name: 'Amount',
        hideSorting: true,
        render: ({ id, amount }) => (
          <Box
            component="span"
            data-testid={`DepositLedger.List.Amount.${id}`}
            sx={[amount.amount > 0 && styles.positiveAmount]}
          >
            <TableCellTooltip title={<NumberFormat format="$0,0.00">{amount.amount}</NumberFormat>} />
          </Box>
        ),
      },
      ...(showRemainingDeposit
        ? [
            {
              id: 'remaining',
              name: 'Balance',
              hideSorting: true,
              render: ({ id, accountRemaining }: TRowData) => (
                <Box
                  component="span"
                  data-testid={`DepositLedger.List.Remaining.${id}`}
                  sx={[accountRemaining.amount > 0 && styles.positiveAmount]}
                >
                  <TableCellTooltip title={<NumberFormat format="$0,0.00">{accountRemaining.amount}</NumberFormat>} />
                </Box>
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
            <TableCellTooltip title={<>{typeNamesMap[typeId] || typeId}</>} />
          </span>
        ),
      },
      {
        id: 'reference',
        name: 'Reference',
        hideSorting: true,
        render: ({ id, references, typeId, invoiceUrl }) => {
          let ref: JSX.Element;
          let refTitle = '';

          if (typeId === TransactionType.GiftingWithdrawal && references && references?.giftId) {
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

          if (typeId === TransactionType.HistoricInvoice && references?.invoiceId) {
            refTitle = `inv. #${references.invoiceId}`;
            ref = <span>{refTitle}</span>;
          }

          if ((typeId === TransactionType.Deposit || typeId === TransactionType.Withdraw) && invoiceUrl !== null) {
            refTitle = `invoice`;
            ref = (
              <Link
                data-testid={`DepositLedger.List.Invoice.Link.${id}`}
                href={invoiceUrl}
                target="_blank"
                onClick={handleClickInvoiceLink}
              >
                invoice
              </Link>
            );
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
    [typeNamesMap, showRemainingDeposit, handleClickGiftLink, handleClickInvoiceLink],
  );

  return (
    <Paper sx={styles.paper} elevation={4}>
      {isTableEmpty ? (
        <Box width={1} p={1} display="flex" justifyContent="center" alignItems="center">
          <Typography className="H3-Dark">Nothing to show</Typography>
        </Box>
      ) : (
        <Table sx={styles.table}>
          <colgroup>
            <Box component="col" sx={styles.colDate} />
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
          {total > perPage && (
            <TableFooter>
              <TableRow>
                <TablePagination
                  data-testid="Operations.Pagination"
                  rowsPerPageOptions={[perPage]}
                  colSpan={6}
                  count={total}
                  rowsPerPage={perPage}
                  page={currentPage - 1}
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
    </Paper>
  );
};

export default memo(Transactions);
