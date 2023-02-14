import React, { useCallback } from 'react';
import { RoiReportTypes, TInfluencedAccounts } from '@alycecom/services';
import { useHistory } from 'react-router-dom';

import { RoiTable, RoiTableClickableRow, TRoiColumn, RoiSendReportButton, IRoiTableProps } from '../../../Shared';
import { useRoiTable } from '../../../../hooks';
import { NumberFormattingOptions, toFormattedPrice, toRoiDateFormat } from '../../../../utils';
import { ROI_ROUTES } from '../../../../routePaths';
import { useGetInfluencedAccounts } from '../../../../hooks/useGetInfluencedAccounts';

const columns: TRoiColumn<TInfluencedAccounts>[] = [
  {
    label: 'Account Name',
    tooltipText: 'Determined based on recipient email address',
    field: 'emailDomain',
    isSortable: true,
  },
  {
    label: 'Latest Accept',
    tooltipText: 'Time since the most recent gift was  accepted',
    field: 'claimedAt',
    isSortable: true,
    getFormattedValue: data => data.claimedAt && toRoiDateFormat(data.claimedAt),
  },
  {
    label: 'Campaign Purpose',
    tooltipText: 'Campaign purpose for the most recently accepted gift',
    field: 'campaignPurpose',
    isSortable: true,
  },
  {
    label: 'Unique Recipients',
    align: 'right',
    tooltipText:
      'Number of unique individuals tied to an opportunitiy within this account who have been sent one or more gifts',
    field: 'uniqueRecipients',
    isSortable: true,
  },
  {
    label: 'Accepted Gifts',
    align: 'right',
    tooltipText: 'Number of gifts accepted that are tied to opportunities within the account',
    field: 'acceptedGifts',
    isSortable: true,
  },
  {
    label: 'Meetings Booked',
    align: 'right',
    tooltipText: 'Number of meetings that have been booked via Alyce meeting booker',
    field: 'meetingsBooked',
    isSortable: true,
  },
  {
    label: 'Total Spend',
    align: 'right',
    tooltipText: 'Total spend on gifts tied to opportunities within this account',
    field: 'totalSpent',
    getFormattedValue: data => toFormattedPrice(data.totalSpent, NumberFormattingOptions.LargeWithDecimals),
    isSortable: true,
  },
];

const InfluencedAccountsTable = (): JSX.Element => {
  const { push } = useHistory();

  const {
    filters,
    handleOffsetChange,
    handleRowsPerPageChange,
    handleSortChange,
    handleTableFiltersChange,
  } = useRoiTable<TInfluencedAccounts>();
  const { field, direction, limit, offset } = filters;

  const { data, currentData, isFetching, isWaitingForFilters } = useGetInfluencedAccounts(filters);
  const influencedAccounts = currentData?.data || [];
  const total = currentData?.pagination?.total || data?.pagination?.total || 0;
  const getRowId = useCallback<IRoiTableProps<typeof influencedAccounts[number]>['getRowId']>(
    row => row.emailDomain,
    [],
  );
  const handleAccountSelected = useCallback(
    (account: TInfluencedAccounts) => {
      push(`${ROI_ROUTES.REPORTING}/${account.emailDomain}/accepted-gifts`);
    },
    [push],
  );

  return (
    <RoiTable
      title="Influenced Accounts"
      rows={influencedAccounts}
      columns={columns}
      isLoading={isWaitingForFilters || isFetching}
      total={total}
      limit={limit}
      offset={offset}
      field={field}
      direction={direction}
      getRowId={getRowId}
      toolbarProps={{
        placeholder: 'Search Account Name',
        onFiltersChange: handleTableFiltersChange,
      }}
      renderRow={({ data: rowData }) => (
        <RoiTableClickableRow
          key={`row-${getRowId(rowData)}`}
          data={rowData}
          columns={columns}
          getRowId={getRowId}
          onRowSelected={handleAccountSelected}
        />
      )}
      headerControls={
        <RoiSendReportButton reportType={RoiReportTypes.AcceptedGifts} disabled={isFetching} filters={filters} />
      }
      onOffsetChange={handleOffsetChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onSortChange={handleSortChange}
    />
  );
};

export default InfluencedAccountsTable;
