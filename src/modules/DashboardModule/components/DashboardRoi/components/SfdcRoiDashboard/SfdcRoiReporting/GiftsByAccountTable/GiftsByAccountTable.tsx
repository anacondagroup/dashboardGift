import React, { useCallback } from 'react';
import { TAcceptedGiftByEmailDomain } from '@alycecom/services';
import { DISPLAY_DATE_FORMAT } from '@alycecom/ui';
import { useHistory, useRouteMatch } from 'react-router-dom';
import moment from 'moment';

import RoiTable from '../../../Shared/RoiTable/RoiTable';
import { ROI_ROUTES } from '../../../../routePaths';
import { GiftsByAccountTableRow, GiftsByAccountTableTitle, IRoiTableProps, TRoiColumn } from '../../../Shared';
import { useGetAcceptedGiftsByAccount } from '../../../../hooks/useGetAcceptedGiftsByAccount';
import { useGetInfluencedOpportunities } from '../../../../hooks/useGetInfluencedOpportunities';
import { useRoiTable } from '../../../../hooks';

const columns: TRoiColumn<TAcceptedGiftByEmailDomain>[] = [
  {
    label: 'Contact Name',
    field: 'contactName',
    isSortable: true,
  },
  {
    label: 'Gift',
    field: 'giftProduct',
    isSortable: true,
  },
  {
    label: 'Campaign',
    field: 'campaignName',
    isSortable: true,
  },
  {
    label: 'Sent By(As)',
    field: 'sentAs',
    isSortable: true,
  },
  {
    label: 'Sent On',
    field: 'sentAt',
    isSortable: true,
    getFormattedValue: data => moment(data.sentAt).format(DISPLAY_DATE_FORMAT),
  },
  {
    label: 'Accepted On',
    field: 'claimedAt',
    isSortable: true,
    getFormattedValue: data => moment(data.claimedAt).format(DISPLAY_DATE_FORMAT),
  },
  {
    label: 'Meeting Booked',
    field: 'meetingBooked',
    isSortable: true,
    getFormattedValue: data => (data.meetingBooked ? 'Yes' : 'No'),
  },
  {
    label: 'Gift Status',
    field: 'state',
    isSortable: true,
  },
];

const GiftsByAccountTable = (): JSX.Element => {
  const {
    params: { accountId },
  } = useRouteMatch<{ accountId: string }>();
  const { push } = useHistory();

  const { filters: globalAndTableFilters, handleOffsetChange, handleRowsPerPageChange, handleSortChange } = useRoiTable<
    TAcceptedGiftByEmailDomain
  >();
  const { field, direction, limit, offset, ...filters } = globalAndTableFilters;

  const { data: influencedOpportunity, isFetching: isInfluencedOpportunitiesLoading } = useGetInfluencedOpportunities({
    ...filters,
    limit: 10,
    offset: 0,
  });
  const influencedOpportunityNumber = influencedOpportunity?.pagination?.total || 0;

  const { data, currentData, isFetching, isWaitingForFilters } = useGetAcceptedGiftsByAccount({
    accountId,
    filters: globalAndTableFilters,
  });
  const influencedOpportunities = currentData?.data || [];
  const accountName = currentData?.account.name || '';
  const total = currentData?.pagination?.total || data?.pagination?.total || 0;
  const isLoading = isFetching || isWaitingForFilters || isInfluencedOpportunitiesLoading;

  const getRowId = useCallback<IRoiTableProps<TAcceptedGiftByEmailDomain>['getRowId']>(row => row.giftId, []);

  const handleParentClick = useCallback(() => {
    push(ROI_ROUTES.REPORTING);
  }, [push]);

  return (
    <RoiTable
      header={
        <GiftsByAccountTableTitle
          total={influencedOpportunityNumber}
          parentTitle="Influenced Accounts"
          title={accountName}
          isLoading={isLoading}
          onParentClick={handleParentClick}
        />
      }
      rows={influencedOpportunities}
      columns={columns}
      isLoading={isWaitingForFilters || isFetching}
      total={total}
      limit={limit}
      offset={offset}
      field={field}
      direction={direction}
      getRowId={getRowId}
      renderRow={({ data: rowData }) => (
        <GiftsByAccountTableRow key={`row-${getRowId(rowData)}`} data={rowData} columns={columns} getRowId={getRowId} />
      )}
      onOffsetChange={handleOffsetChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onSortChange={handleSortChange}
    />
  );
};

export default GiftsByAccountTable;
