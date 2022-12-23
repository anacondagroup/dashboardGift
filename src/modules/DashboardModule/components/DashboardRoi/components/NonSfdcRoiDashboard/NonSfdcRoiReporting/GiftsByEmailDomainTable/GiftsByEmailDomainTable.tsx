import React, { useCallback } from 'react';
import { TAcceptedGiftByEmailDomain } from '@alycecom/services';
import { DISPLAY_DATE_FORMAT } from '@alycecom/ui';
import { useHistory, useRouteMatch } from 'react-router-dom';
import moment from 'moment';

import type { IRoiTableProps } from '../../../Shared/RoiTable/RoiTable';
import RoiTable from '../../../Shared/RoiTable/RoiTable';
import { useRoiTable } from '../../../../hooks';
import type { TRoiColumn } from '../../../Shared';
import { ROI_ROUTES } from '../../../../routePaths';
import { GiftsByAccountTableRow, GiftsByAccountTableTitle } from '../../../Shared';
import { useGetInfluencedAccounts } from '../../../../hooks/useGetInfluencedAccounts';
import { useGetAcceptedGiftsByEmailDomain } from '../../../../hooks/useGetAcceptedGiftsByEmailDomain';

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
    getFormattedValue: data => data.sentAt && moment(data.sentAt).format(DISPLAY_DATE_FORMAT),
  },
  {
    label: 'Accepted On',
    field: 'claimedAt',
    isSortable: true,
    getFormattedValue: data => data.claimedAt && moment(data.claimedAt).format(DISPLAY_DATE_FORMAT),
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

const GiftsByEmailDomainTable = (): JSX.Element => {
  const {
    params: { emailDomain },
  } = useRouteMatch<{ emailDomain: string }>();
  const { push } = useHistory();

  const { filters: globalAndTableFilters, handleOffsetChange, handleRowsPerPageChange, handleSortChange } = useRoiTable<
    TAcceptedGiftByEmailDomain
  >();
  const { field, direction, limit, offset, ...filters } = globalAndTableFilters;

  const { data: influencedAccounts, isFetching: isInfluencedAccountsLoading } = useGetInfluencedAccounts({
    ...filters,
    limit: 10,
    offset: 0,
  });
  const influencedAccountsNumber = influencedAccounts?.pagination?.total || 0;

  const { data, currentData, isFetching, isWaitingForFilters } = useGetAcceptedGiftsByEmailDomain({
    emailDomain,
    filters: globalAndTableFilters,
  });
  const influencedOpportunities = currentData?.data || [];
  const total = currentData?.pagination?.total || data?.pagination?.total || 0;
  const isLoading = isFetching || isInfluencedAccountsLoading || isWaitingForFilters;

  const getRowId = useCallback<IRoiTableProps<TAcceptedGiftByEmailDomain>['getRowId']>(row => row.giftId, []);

  const handleParentClick = useCallback(() => {
    push(ROI_ROUTES.REPORTING);
  }, [push]);

  return (
    <RoiTable
      header={
        <GiftsByAccountTableTitle
          total={influencedAccountsNumber}
          parentTitle="Influenced Accounts"
          title={emailDomain}
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

export default GiftsByEmailDomainTable;
