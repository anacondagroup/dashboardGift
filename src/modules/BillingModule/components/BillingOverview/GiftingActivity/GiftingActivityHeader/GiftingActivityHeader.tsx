import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';

import { getGroupId } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { getGroupsMap, getOrg } from '../../../../store/customerOrg';
import { GroupsTeamsConstants } from '../../../../constants/groupsTeams.constants';
import EmailReport from '../../../EmailReport/EmailReport';

const styles = {
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 24,
    lineHeight: '32px',
    fontWeight: 400,
    color: ({ palette }: AlyceTheme) => palette.primary.main,
  },
} as const;

const GiftingActivityHeader = (): JSX.Element => {
  const orgInfo = useSelector(getOrg);
  const groupId = useSelector(getGroupId);
  const groupsMap = useSelector(getGroupsMap);

  const isAllGroups = groupId === GroupsTeamsConstants.AllGroupsAndTeams;
  const accountName = isAllGroups ? orgInfo.name : groupsMap[groupId].groupName;

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.title}>{accountName} Gifting Activity</Typography>
      <EmailReport />
    </Box>
  );
};

export default memo(GiftingActivityHeader);
