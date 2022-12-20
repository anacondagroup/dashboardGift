import React, { memo, useCallback, useState, useMemo } from 'react';
import { Toolbar, Button, Tabs, Box, AppBar as MuiAppBar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Link, useRouteMatch } from 'react-router-dom';
import { TBudgetUtilization, TrackEvent, useGetBudgetUtilizationByUserIdQuery } from '@alycecom/services';
import { Icon, Divider, Tooltip, AlyceTheme } from '@alycecom/ui';
import { useScrollPosition, useSetUrlQuery } from '@alycecom/hooks';
import { Features, User } from '@alycecom/modules';
import { useSelector } from 'react-redux';

import appBarLogo from '../../assets/images/white_bird.svg';
import { tabsKeys } from '../../constants/sidebarTabs.constants';
import { hasBudgetToSpend } from '../../helpers/budget.helpers';
import { INSUFFICIENT_BUDGET_TOOLTIP_MESSAGE } from '../../modules/SettingsModule/constants/budget.constants';
import usePermissions from '../../hooks/usePermissions';
import { PermissionKeys } from '../../constants/permissions.constants';

import ToolbarProfile from './ToolbarProfile';
import ToolbarInvitations from './ToolbarInvitations';
import TabLink from './TabLink';
import SettingsLink from './SettingsLink';
import AppcuesTooltip from './AppcuesTooltip';
import ToolbarUserBudget from './ToolbarUserBudget/ToolbarUserBudget';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  root: {
    marginTop: undefined,
    flexGrow: 1,
  },
  tabs: {
    flexGrow: 1,
  },
  tabsIndicator: {
    height: '0%',
  },
  hiddenTab: {
    display: 'none',
  },
  disabledButton: {
    '&.Mui-disabled': {
      backgroundColor: palette.background.default,
    },
  },
}));

const AppBar = () => {
  const classes = useStyles();
  const updateUrlFunc = useSetUrlQuery();
  const userId = useSelector(User.selectors.getUserId);

  const permissions = usePermissions();
  const hasOrganizationSettings = permissions.includes(PermissionKeys.OrganisationAdmin);
  const teamsIds = useSelector(User.selectors.getUserCanManageTeams);
  const hasAnalyticReportsFeature = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ANALYTICS_REPORTING));

  const isAnalyticReportsAllowed = hasAnalyticReportsFeature && (hasOrganizationSettings || teamsIds.length > 0);

  const { params: { selectedTab = '/' } = {} } =
    useRouteMatch<{ selectedTab: string }>('/:selectedTab(teams|campaigns|billing|marketplace)?') || {};

  const isROIEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ROI));
  const [elevation, setElevation] = useState(1);
  const { trackEvent } = TrackEvent.useTrackEvent();

  const handleScroll = useCallback(scroll => {
    if (scroll.y > 280) {
      setElevation(0);
    } else {
      setElevation(1);
    }
  }, []);
  useScrollPosition(handleScroll);

  const sendGiftHandler = useCallback(() => {
    updateUrlFunc({ sidebarTab: tabsKeys.SEND_GIFT });
    trackEvent('Gifting flow - clicked send a gift');
  }, [trackEvent, updateUrlFunc]);

  const hasBudgetManagementLimit = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT), []),
  );

  const {
    data: budgetUtilization,
    isLoading: isLoadingBudgetUtilization,
    isFetching: isFetchingBudgetUtilization,
  } = useGetBudgetUtilizationByUserIdQuery(
    {
      userId,
    },
    { skip: !hasBudgetManagementLimit },
  );

  const budgetUtilizations = useMemo(() => {
    if (!isLoadingBudgetUtilization && !isFetchingBudgetUtilization && budgetUtilization) {
      return Object.values(budgetUtilization.entities) as TBudgetUtilization[];
    }
    return [] as TBudgetUtilization[];
  }, [budgetUtilization, isLoadingBudgetUtilization, isFetchingBudgetUtilization]);

  const hasNoAvailableBudget = useMemo(() => !hasBudgetToSpend(budgetUtilizations), [budgetUtilizations]);

  return (
    <MuiAppBar position="sticky" elevation={elevation}>
      <Toolbar>
        <Link to={isROIEnabled ? '/roi' : '/teams'}>
          <img src={appBarLogo} alt="Alyce" width={37} />
        </Link>

        <div className={classes.tabs}>
          <Tabs
            value={selectedTab}
            indicatorColor="secondary"
            textColor="inherit"
            classes={selectedTab === '/' && !isROIEnabled ? { indicator: classes.tabsIndicator } : undefined}
          >
            <TabLink to="/" label={isROIEnabled ? 'Dashboard' : 'Home'} value="/" />
            <TabLink to="/teams" label="Teams" value="teams" />
            <TabLink to="/campaigns" label="Campaigns" value="campaigns" />
            <TabLink
              to="/marketplace"
              label="Marketplace"
              badge="New"
              showUntil="2021-04-19"
              value="marketplace"
              data-testid="marketplace_link"
            />
            {isAnalyticReportsAllowed && (
              <TabLink to="/reporting/download-reports" label="Gifting Insights" value="giftingInsights" />
            )}
          </Tabs>
        </div>
        <Box flex="0 0 auto" display="flex" height="100%" py={1.5} flexDirection="row" justifyContent="flex-end">
          <SettingsLink />

          <Divider color="dividerBlue" my={0.5} shift={1} orientation="vertical" />

          <AppcuesTooltip />

          <ToolbarProfile />

          <Divider color="dividerBlue" mx={1.5} my={0.5} shift={1} orientation="vertical" />

          {hasBudgetManagementLimit ? (
            <ToolbarUserBudget
              budgetUtilizations={budgetUtilizations}
              budgetUtilizationIsLoading={isLoadingBudgetUtilization || isFetchingBudgetUtilization}
            />
          ) : (
            <ToolbarInvitations boxProps={{ minWidth: 85, maxWidth: 130, pr: 2.5 }} />
          )}

          {hasBudgetManagementLimit && hasNoAvailableBudget ? (
            <Tooltip title={INSUFFICIENT_BUDGET_TOOLTIP_MESSAGE} arrow placement="bottom-end">
              <Button
                variant="contained"
                startIcon={<Icon icon="gift" color="disabled" />}
                disabled={hasNoAvailableBudget}
                className={classes.disabledButton}
              >
                Send a gift
              </Button>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              onClick={sendGiftHandler}
              startIcon={<Icon icon="gift" color="primary" />}
            >
              Send a gift
            </Button>
          )}
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default memo(AppBar);
