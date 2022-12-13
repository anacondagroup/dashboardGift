import React from 'react';
import { useSelector } from 'react-redux';
import { useGetOrganizationQuery, GroupsTeamsIdentifier } from '@alycecom/services';

import AccountBalance from '../../AccountBalance';
import { getDateRange, getGroupId } from '../../../store/ui/overviewFilters/overviewFilters.selectors';

const Overview = (): JSX.Element => {
  const { data: organization } = useGetOrganizationQuery();
  const orgId = organization?.id;

  const groupId = useSelector(getGroupId);
  const dateRange = useSelector(getDateRange);

  const accountId = groupId === GroupsTeamsIdentifier.AllGroupsAndTeams ? String(orgId) : groupId;

  return <AccountBalance accountId={accountId} fromDate={dateRange.from} toDate={dateRange.to} />;
};

export default Overview;
