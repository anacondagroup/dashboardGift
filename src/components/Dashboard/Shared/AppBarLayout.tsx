import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useUrlQuery } from '@alycecom/hooks';

import AppBar from '../../AppBar/AppBar';
import ProspectingSidebar from '../../../modules/GiftingFlow/components/Sidebar';
import { makeGetTeamIdByCampaignId } from '../../../store/campaigns/campaigns.selectors';

import DashboardLayout from './DashboardLayout';

export interface IAppBarLayoutProps {
  children: React.ReactNode;
  classes?: {
    dashboardLayout?: string;
  };
}

const AppBarLayout = ({ children, classes = {} }: IAppBarLayoutProps): JSX.Element => {
  const { campaignId: campaignIdFromUrl = '', teamId: teamIdFromUrl = '', contactId } = useUrlQuery([
    'campaignId',
    'teamId',
    'contactId',
  ]);

  const teamIdFromCampaign = useSelector(
    useMemo(() => makeGetTeamIdByCampaignId(campaignIdFromUrl), [campaignIdFromUrl]),
  );
  const sidebarTeamId = parseInt(teamIdFromUrl, 10) || teamIdFromCampaign;

  return (
    <>
      <AppBar />
      <DashboardLayout className={classes.dashboardLayout}>{children}</DashboardLayout>
      <ProspectingSidebar key={contactId} teamId={sidebarTeamId as number} />
    </>
  );
};

export default AppBarLayout;
