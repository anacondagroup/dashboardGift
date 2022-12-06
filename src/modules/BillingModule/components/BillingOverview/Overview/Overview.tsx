import React from 'react';
import { useSelector } from 'react-redux';

import AccountBalance from '../../AccountBalance';
import { getDateRange, getGroupId } from '../../../store/ui/overviewFilters/overviewFilters.selectors';
import { getOrg } from '../../../store/customerOrg';
import { GroupsTeamsConstants } from '../../../constants/groupsTeams.constants';

const Overview = (): JSX.Element => {
  const { id: orgId } = useSelector(getOrg);

  const groupId = useSelector(getGroupId);
  const dateRange = useSelector(getDateRange);

  const accountId = groupId === GroupsTeamsConstants.AllGroupsAndTeams ? String(orgId) : groupId;

  return <AccountBalance accountId={accountId} fromDate={dateRange.from} toDate={dateRange.to} />;
};

export default Overview;
