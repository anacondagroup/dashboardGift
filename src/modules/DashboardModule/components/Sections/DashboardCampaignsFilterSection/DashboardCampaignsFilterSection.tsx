import { makeStyles } from '@mui/styles';
import { Box, Tab, Skeleton, Grid, Typography, Tabs } from '@mui/material';
import React, { memo, useCallback } from 'react';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { TrackEvent } from '@alycecom/services';
import { Features, User } from '@alycecom/modules';

import {
  CampaignBreakDownFilterTabs,
  TAB_VALUE_TO_STATUS,
} from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';
import {
  getActiveCampaignsListAmount,
  getAllCampaignsListAmount,
  getExpiredCampaignsListAmount,
  getDraftCampaignsListAmount,
} from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.selectors';
import { getStatusFilter } from '../../../store/breakdowns/campaignsManagement/filters/filters.selectors';
import { TCampaignTableSetValues } from '../../../store/breakdowns/campaignsManagement/filters/filters.types';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, breakpoints }) => ({
  root: {
    marginBottom: `-${spacing(3)}`,
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    minHeight: '95vh',
  },
  sidebar: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: '0 0 auto',
    flexDirection: 'column',
    paddingTop: spacing(5),
    paddingLeft: spacing(3),
    minHeight: '95vh',
    borderRight: `1px solid ${palette.divider}`,
  },
  tabsIndicator: {
    width: '100%',
    backgroundColor: palette.primary.superLight,
    borderRadius: 1,
  },
  tabs: {
    marginTop: spacing(4),
    marginLeft: `-${spacing(4)}`,
    width: 250,
  },
  tab: {
    width: '100%',
    height: 42,
    paddingLeft: spacing(4),
    color: palette.primary.main,
    fontSize: 18,
    fontWeight: 400,
    zIndex: 1,
  },
  tabWrapper: {
    justifyContent: 'flex-start',
  },
  tabSelected: {
    color: palette.primary.main,
    fontWeight: 700,
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
    color: palette.primary.main,
  },
  content: {
    backgroundColor: palette.background.paper,
    flexGrow: 1,
    minHeight: 'calc(100vh - 100px)',
    paddingTop: spacing(5),
    paddingLeft: spacing(7),
    paddingBottom: spacing(6),
    paddingRight: spacing(6),
    [breakpoints.down(breakpoints.values.lg)]: {
      paddingRight: spacing(3),
      paddingLeft: spacing(4),
    },
  },
}));

export interface IDashboardCampaignsFilterSectionProps {
  setValues: TCampaignTableSetValues;
  children: React.ReactNode;
}

const DashboardCampaignsFilterSection = ({ setValues, children }: IDashboardCampaignsFilterSectionProps) => {
  const classes = useStyles();
  const tabsClasses = {
    indicator: classes.tabsIndicator,
    root: classes.tabs,
  };
  const tabClasses = {
    wrapper: classes.tabWrapper,
    root: classes.tab,
    selected: classes.tabSelected,
    textColorSecondary: classes.tabSelected,
  };

  const { trackEvent } = TrackEvent.useTrackEvent();
  const allCampaignsAmount = useSelector(getAllCampaignsListAmount);
  const allActiveCampaignsAmount = useSelector(getActiveCampaignsListAmount);
  const allExpiredCampaignsAmount = useSelector(getExpiredCampaignsListAmount);
  const allDraftCampaignsAmount = useSelector(getDraftCampaignsListAmount);
  const userId = useSelector(User.selectors.getUserId);
  const hasSwagAddonFeature = useSelector(Features.selectors.hasFeatureFlags(Features.FLAGS.SWAG_ADD_ON));
  const hasA4MFeatureFlag = useSelector(Features.selectors.hasFeatureFlags(Features.FLAGS.ALYCE_FOR_MARKETING));
  const hasNewSwagCampaigns = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.GIFT_REDEMPTION_CODES_2_0));

  const showDrafts = hasSwagAddonFeature || hasA4MFeatureFlag || hasNewSwagCampaigns;

  const currentTabValue = useSelector(getStatusFilter);

  const handleChanges = useCallback(
    (event: React.ChangeEvent<unknown>, tabValue: CampaignBreakDownFilterTabs) => {
      trackEvent('Enterprise Dashboard — campaign statuses clicked', { userId, tabValue });
      setValues({ status: TAB_VALUE_TO_STATUS[tabValue], currentPage: 1 });
    },
    [userId, setValues, trackEvent],
  );

  return (
    <Grid container className={classes.root}>
      <Box className={classes.sidebar}>
        <Typography className={classes.header}>Campaigns</Typography>
        <Tabs
          classes={tabsClasses}
          orientation="vertical"
          value={currentTabValue ?? CampaignBreakDownFilterTabs.All}
          onChange={handleChanges}
        >
          <Tab
            classes={tabClasses}
            label={
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Box>All campaigns</Box>
                <Box>{Number.isNaN(allCampaignsAmount) ? <Skeleton width={25} height={25} /> : allCampaignsAmount}</Box>
              </Box>
            }
            value={CampaignBreakDownFilterTabs.All}
          />
          <Tab
            classes={tabClasses}
            label={
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Box display="flex">
                  <Icon color="green.dark" width={7} icon="circle" />
                  <Box pl={2}>Active</Box>
                </Box>
                <Box>
                  {Number.isNaN(allActiveCampaignsAmount) ? (
                    <Skeleton width={25} height={25} />
                  ) : (
                    allActiveCampaignsAmount
                  )}
                </Box>
              </Box>
            }
            value={CampaignBreakDownFilterTabs.Active}
          />
          {showDrafts && (
            <Tab
              classes={tabClasses}
              label={
                <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                  <Box display="flex">
                    <Icon color="grey.chambray50" width={7} icon="circle" />
                    <Box pl={2}>Drafts</Box>
                  </Box>
                  <Box>
                    {Number.isNaN(allDraftCampaignsAmount) ? (
                      <Skeleton width={25} height={25} />
                    ) : (
                      allDraftCampaignsAmount
                    )}
                  </Box>
                </Box>
              }
              value={CampaignBreakDownFilterTabs.Draft}
            />
          )}
          <Tab
            classes={tabClasses}
            label={
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Box display="flex">
                  <Icon color="red.light" width={7} icon="circle" />
                  <Box pl={2}>Expired</Box>
                </Box>
                <Box>
                  {Number.isNaN(allExpiredCampaignsAmount) ? (
                    <Skeleton width={25} height={25} />
                  ) : (
                    allExpiredCampaignsAmount
                  )}
                </Box>
              </Box>
            }
            value={CampaignBreakDownFilterTabs.Expired}
          />
          <Tab
            classes={tabClasses}
            label={
              <Box display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                <Box>Archived</Box>
              </Box>
            }
            value={CampaignBreakDownFilterTabs.Archived}
          />
        </Tabs>
      </Box>
      <Box display="flex" flex="1 1 auto">
        <Box display="flex" flexGrow={1}>
          <Box className={classes.content}>{children}</Box>
        </Box>
      </Box>
    </Grid>
  );
};

export default memo(DashboardCampaignsFilterSection);
