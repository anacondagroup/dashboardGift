import React, { useCallback } from 'react';
import { TInfluencedOpportunities, useGetInfluencedOpportunitiesQuery } from '@alycecom/services';
import { Theme } from '@mui/material';
import { useHistory } from 'react-router-dom';

import RoiTable, { IRoiTableProps } from '../../../Shared/RoiTable/RoiTable';
import { RoiTableClickableRow, TRoiColumn } from '../../../Shared';
import { NumberFormattingOptions, toDateFromNow, toFormattedPrice, toRoi } from '../../../../utils';
import { useRoiTable } from '../../../../hooks';
import { ROI_ROUTES } from '../../../../routePaths';

const columns: TRoiColumn<TInfluencedOpportunities>[] = [
  {
    label: 'Account Name',
    tooltipText: 'Determined based on Salesforce Account Name',
    field: 'accountName',
    isSortable: true,
  },
  {
    label: 'Latest Accept',
    tooltipText: 'Time since the most recent gift was  accepted',
    field: 'recentClaimedGiftDate',
    getFormattedValue: data => data.recentClaimedGiftDate && toDateFromNow(data.recentClaimedGiftDate),
    isSortable: true,
  },
  {
    label: 'Campaign Purpose',
    tooltipText: 'Campaign purpose for the most recently accepted gift',
    field: 'claimedGiftCampaignPurpose',
    isSortable: true,
  },
  {
    label: 'Unique Recipients',
    align: 'center',
    tooltipText: 'Number of recipients that have been sent, viewed, or accepted a gift',
    field: 'uniqueRecipientCount',
    isSortable: true,
  },
  {
    label: 'Accepted Gifts',
    align: 'center',
    tooltipText: 'Number of gifts that have been accepted',
    field: 'acceptedGiftsCount',
    isSortable: true,
  },
  {
    label: 'Booked Meetings',
    align: 'center',
    tooltipText: 'Number of meetings that have been booked via Alyce meeting booker',
    field: 'bookedMeetingsCount',
    isSortable: true,
  },
  {
    label: 'Total Spend',
    align: 'right',
    tooltipText: 'Total amount of spend on accepted gifts ',
    field: 'claimedGiftsCost',
    getFormattedValue: data => toFormattedPrice(data.claimedGiftsCost, NumberFormattingOptions.LargeWithDecimals),
    isSortable: true,
    styles: {
      paddingRight: ({ spacing }: Theme) => spacing(2),
    },
  },
  {
    label: 'Total Influenced',
    align: 'right',
    tooltipText:
      'Sum of the opportunity value for all opportunities where a gift influenced the opportunity (Influenced Open ARR + Closed-Won ARR)',
    field: 'claimedGiftsOpportunitiesSum',
    getFormattedValue: data => toFormattedPrice(data.claimedGiftsOpportunitiesSum),
    styles: {
      color: ({ palette }) => palette.grey.main,
      paddingRight: ({ spacing }: Theme) => spacing(2),
    },
    isSortable: true,
  },
  {
    label: 'Closed-won Arr',
    align: 'right',
    tooltipText: 'Sum of the opportunity value that was Closed-Won where a gift influenced the opportunity',
    field: 'closedWonOpportunitiesSum',
    getFormattedValue: data => toFormattedPrice(data.closedWonOpportunitiesSum),
    styles: {
      color: ({ palette }) => palette.green.fruitSalad,
      paddingRight: ({ spacing }: Theme) => spacing(2),
    },
    isSortable: true,
  },
  {
    label: 'Roi',
    align: 'right',
    tooltipText: 'Total influenced opportunity value measured as a return on gift spend\n',
    field: 'roi',
    getFormattedValue: data => toRoi(data.roi),
    styles: {
      color: ({ palette }) => palette.text.primary,
      fontWeight: 'bold',
      paddingRight: ({ spacing }: Theme) => spacing(2),
    },
    isSortable: true,
  },
];

const SfdcInfluencedAccountTable = (): JSX.Element => {
  const { push } = useHistory();
  const {
    filters: globalAndTableFilters,
    handleOffsetChange,
    handleRowsPerPageChange,
    handleSortChange,
    handleTableFiltersChange,
  } = useRoiTable<TInfluencedOpportunities>();
  const { field, direction, limit, offset, ...filters } = globalAndTableFilters;
  const sort = { field, direction };
  const pagination = { limit, offset };

  const { data, currentData, isFetching } = useGetInfluencedOpportunitiesQuery({ ...filters, sort, pagination });
  const influencedOpportunities = currentData?.data || [];
  const total = currentData?.pagination?.total || data?.pagination?.total || 0;

  const getRowId = useCallback<IRoiTableProps<TInfluencedOpportunities>['getRowId']>(row => row.accountName, []);

  const handleAccountSelected = useCallback(
    ({ accountId }: TInfluencedOpportunities) => {
      push(`${ROI_ROUTES.REPORTING}/${accountId}/accepted-gifts`);
    },
    [push],
  );

  return (
    <RoiTable
      title="Influenced Accounts"
      rows={influencedOpportunities}
      columns={columns}
      isLoading={isFetching}
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
      onOffsetChange={handleOffsetChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onSortChange={handleSortChange}
    />
  );
};

export default SfdcInfluencedAccountTable;
