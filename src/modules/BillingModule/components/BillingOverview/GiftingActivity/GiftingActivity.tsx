import React from 'react';
import { Box } from '@mui/material';
import { useSelector } from 'react-redux';

import { getGroupId } from '../../../store/ui/overviewFilters/overviewFilters.selectors';
import { GroupsTeamsConstants } from '../../../constants/groupsTeams.constants';

import AccountGiftingActivityTable from './AccountGiftingActivityTable';
import GroupGiftingActivityTable from './GroupGiftingActivityTable';
import GiftingActivityHeader from './GiftingActivityHeader';

const styles = {
  root: {
    width: '100%',
    mt: 4,
  },
} as const;

const GiftingActivity = (): JSX.Element => {
  const groupId = useSelector(getGroupId);
  const isAllGroups = groupId === GroupsTeamsConstants.AllGroupsAndTeams;
  return (
    <Box sx={styles.root}>
      <GiftingActivityHeader />
      {isAllGroups ? <AccountGiftingActivityTable /> : <GroupGiftingActivityTable />}
    </Box>
  );
};

export default GiftingActivity;
