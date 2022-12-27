import React from 'react';
import { Paper } from '@mui/material';
import { useSelector } from 'react-redux';
import { GroupsTeamsIdentifier } from '@alycecom/services';

import { getGroupId } from '../../../store/ui/overviewFilters/overviewFilters.selectors';

import AccountGiftingActivityTable from './AccountGiftingActivityTable';
import GroupGiftingActivityTable from './GroupGiftingActivityTable';
import GiftingActivityHeader from './GiftingActivityHeader';

const styles = {
  root: {
    width: 1,
    mt: 4,
    p: 2,
    pt: 3,
  },
} as const;

const GiftingActivity = (): JSX.Element => {
  const groupId = useSelector(getGroupId);
  const isAllGroups = groupId === GroupsTeamsIdentifier.AllGroupsAndTeams;
  return (
    <Paper sx={styles.root} elevation={4}>
      <GiftingActivityHeader />
      {isAllGroups ? <AccountGiftingActivityTable /> : <GroupGiftingActivityTable />}
    </Paper>
  );
};

export default GiftingActivity;
