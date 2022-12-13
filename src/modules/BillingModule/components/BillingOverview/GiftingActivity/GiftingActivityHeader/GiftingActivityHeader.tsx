import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';
import { useGetOrganizationQuery, GroupsTeamsIdentifier } from '@alycecom/services';

import { getGroupId } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import EmailReport from '../../../EmailReport/EmailReport';
import { getGroupsMap } from '../../../../store/billing.selectors';

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
  const { data: organization } = useGetOrganizationQuery();

  const groupId = useSelector(getGroupId);
  const groupsMap = useSelector(getGroupsMap);

  const isAllGroups = groupId === GroupsTeamsIdentifier.AllGroupsAndTeams;
  const accountName = isAllGroups ? organization?.name : groupsMap[groupId].groupName;

  return (
    <Box sx={styles.root}>
      <Typography sx={styles.title}>{accountName} Gifting Activity</Typography>
      <EmailReport />
    </Box>
  );
};

export default memo(GiftingActivityHeader);
