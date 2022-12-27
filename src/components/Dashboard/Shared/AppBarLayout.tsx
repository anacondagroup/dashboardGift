import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useUrlQuery } from '@alycecom/hooks';
import classNames from 'classnames';
import { makeStyles } from '@mui/styles';

import AppBar from '../../AppBar/AppBar';
import ProspectingSidebar from '../../../modules/GiftingFlow/components/Sidebar';
import { makeGetTeamIdByCampaignId } from '../../../store/campaigns/campaigns.selectors';

import DashboardLayout from './DashboardLayout';

export interface IAppBarLayoutProps {
  children: React.ReactNode;
  disabledGutters?: boolean;
  classes?: {
    dashboardLayout?: string;
  };
}

const useStyles = makeStyles({
  disabledGutters: {
    padding: 0,
  },
});

const AppBarLayout = ({ children, classes = {}, disabledGutters = false }: IAppBarLayoutProps): JSX.Element => {
  const appBarClasses = useStyles();
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
      <DashboardLayout
        className={classNames(classes.dashboardLayout, { [appBarClasses.disabledGutters]: disabledGutters })}
      >
        {children}
      </DashboardLayout>
      <ProspectingSidebar key={contactId} teamId={sidebarTeamId as number} />
    </>
  );
};

export default AppBarLayout;
