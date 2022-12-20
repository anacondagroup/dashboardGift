import React, { memo, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { SettingsLayout, User } from '@alycecom/modules';
import { Sidebar } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import SettingsAppBar from '../SettingsModule/components/SettingsAppBar/SettingsAppBar';

import DownloadReports from './components/DownloadReports';
import { useReportingTrackEvent } from './hooks/useReportingTrackEvent';

export const ReportingModule = (): JSX.Element => {
  const trackEvent = useReportingTrackEvent();

  const user = useSelector(User.selectors.getUser);

  useEffect(() => {
    trackEvent('Gifting insights — visited');
  }, [trackEvent]);

  return (
    <>
      <SettingsAppBar breadcrumbs={<></>} />
      <SettingsLayout sidebar={<Sidebar userName={user.firstName} avatarUrl={user.avatar} baseUrl="" items={[]} />}>
        <Route exact path="/reporting/download-reports" component={DownloadReports} />
      </SettingsLayout>
    </>
  );
};

export default memo(ReportingModule);
