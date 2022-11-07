import React, { memo } from 'react';
import { Route } from 'react-router-dom';
import { SettingsLayout, User } from '@alycecom/modules';
import { Sidebar } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import SettingsAppBar from '../SettingsModule/components/SettingsAppBar/SettingsAppBar';

import DownloadReports from './components/DownloadReports';

export const ReportingModule = (): JSX.Element => {
  const user = useSelector(User.selectors.getUser);

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
