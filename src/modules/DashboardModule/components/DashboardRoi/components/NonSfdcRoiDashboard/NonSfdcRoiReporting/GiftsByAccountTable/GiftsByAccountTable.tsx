import React, { useCallback } from 'react';
import { TAcceptedGiftByEmailDomain, useGetAcceptedGiftsByEmailDomainQuery } from '@alycecom/services';
import { DISPLAY_DATE_FORMAT } from '@alycecom/ui';
import { useHistory, useRouteMatch } from 'react-router-dom';
import moment from 'moment';

import type { IRoiTableProps } from '../../../Shared/RoiTable/RoiTable';
import RoiTable from '../../../Shared/RoiTable/RoiTable';
import { useRoiTable } from '../../../../hooks';
import type { TRoiColumn } from '../../../Shared';
import { ROI_ROUTES } from '../../../../routePaths';

import GiftsByAccountTableRow from './GiftsByAccountTableRow';

const columns: TRoiColumn<TAcceptedGiftByEmailDomain>[] = [
  {
    label: 'Contact Name',
    field: 'contactName',
  },
  {
    label: 'Gift',
    field: 'giftProduct',
  },
  {
    label: 'Campaign',
    field: 'campaignName',
  },
  {
    label: 'Sent By(As)',
    field: 'sentAs',
  },
  {
    label: 'Sent On',
    field: 'sentAt',
    getFormattedValue: data => moment(data.sentAt).format(DISPLAY_DATE_FORMAT),
  },
  {
    label: 'Accepted On',
    field: 'claimedAt',
    getFormattedValue: data => moment(data.sentAt).format(DISPLAY_DATE_FORMAT),
  },
  {
    label: 'Meeting Booked',
    field: 'meetingBooked',
    getFormattedValue: data => (data.meetingBooked ? 'Yes' : 'No'),
  },
  {
    label: 'Gift Status',
    field: 'state',
  },
];

const GiftsByAccountTable = (): JSX.Element => {
  const {
    params: { emailDomain },
  } = useRouteMatch<{ emailDomain: string }>();
  const { push } = useHistory();

  const { filters: globalAndTableFilters, handleOffsetChange, handleRowsPerPageChange, handleSortChange } = useRoiTable<
    TAcceptedGiftByEmailDomain
  >();
  const { field, direction, limit, offset, ...filters } = globalAndTableFilters;
  const sort = { field, direction };
  const pagination = { limit, offset };

  const { data, currentData, isFetching } = useGetAcceptedGiftsByEmailDomainQuery({
    filters: { ...filters, sort, pagination },
    emailDomain,
  });
  const influencedOpportunities = currentData?.data || [];
  const total = currentData?.pagination?.total || data?.pagination?.total || 0;

  const getRowId = useCallback<IRoiTableProps<TAcceptedGiftByEmailDomain>['getRowId']>(row => row.giftId, []);

  const handleParentClick = useCallback(() => {
    push(ROI_ROUTES.REPORTING);
  }, [push]);

  return (
    <RoiTable
      title={emailDomain}
      parentTitle="Influenced Accounts"
      rows={influencedOpportunities}
      columns={columns}
      isLoading={isFetching}
      total={total}
      limit={limit}
      offset={offset}
      field={field}
      direction={direction}
      getRowId={getRowId}
      renderRow={({ data: rowData }) => (
        <GiftsByAccountTableRow key={`row-${getRowId(rowData)}`} data={rowData} columns={columns} getRowId={getRowId} />
      )}
      onParentClick={handleParentClick}
      onOffsetChange={handleOffsetChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      onSortChange={handleSortChange}
    />
  );
};

export default GiftsByAccountTable;
