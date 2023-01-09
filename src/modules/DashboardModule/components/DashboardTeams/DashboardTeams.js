import React, { memo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { Grid } from '@mui/material';
import { useScrollTop, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import DashboardSection from '../../../../components/Dashboard/Shared/DashboardSection';
import TeamsBreakdown from '../Breakdowns/TeamsBreakdown/TeamsBreakdown';
import TeamsBreakdownLoader from '../../hoc/BreakdownLoaders/TeamsBreakdownLoader';
import { teamsDownloadReportRequest } from '../../store/breakdowns/teams/teams.actions';
import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import { useTrackPage } from '../../../../hooks/useTrackPage';
import { getTeamsReportIsLoading } from '../../store/breakdowns/teams/teams.selectors';
import GiftInvitationReportButton from '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';

const DashboardTeams = () => {
  const dispatch = useDispatch();

  useTrackPage('Enterprise Dashboard — visit teams page');
  useScrollTop();

  const {
    campaignId,
    teamsSearch,
    teamsSort = 'name',
    teamsDirection = 'asc',
    dateRangeFrom,
    dateRangeTo,
    includeArchived,
  } = useUrlQuery([
    'campaignId',
    'teamsSearch',
    'teamsSort',
    'teamsDirection',
    'dateRangeFrom',
    'dateRangeTo',
    'teamId',
    'contactId',
    'includeArchived',
  ]);
  const updateUrl = useSetUrlQuery();

  const isTeamsReportLoading = useSelector(getTeamsReportIsLoading);
  const handleDownload = useCallback(
    () =>
      dispatch(
        teamsDownloadReportRequest({
          search: teamsSearch,
          sort: teamsSort,
          sortDirection: teamsDirection,
        }),
      ),
    [dispatch, teamsDirection, teamsSearch, teamsSort],
  );

  const { trackEvent } = TrackEvent.useTrackEvent();
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const handleChangeDateRange = useCallback(
    ({ from, to, preset }) => {
      updateUrl({ dateRangeFrom: from, dateRangeTo: to, teamsPage: '0' });
      trackEvent('Date range - Changed', { page: 'teams', preset, userId, adminId }, { traits: { adminId } });
    },
    [adminId, trackEvent, updateUrl, userId],
  );

  return (
    <>
      <DashboardHeader
        header="How are things going?"
        subHeader="Here’s a breakdown of how teams are performing with Alyce"
      />
      <Grid container justifyContent="flex-end">
        <GiftInvitationReportButton useDateSelect includeArchived={includeArchived} />
      </Grid>
      <TeamsBreakdownLoader
        sort={teamsSort}
        sortDirection={teamsDirection}
        campaignId={campaignId}
        search={teamsSearch}
        includeArchived={includeArchived}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        render={({ breakdown, isLoading }) => (
          <DashboardSection
            disabledCollapse
            title="Your teams"
            icon="users"
            subtitle=""
            showDownloadReport={breakdown && !!breakdown.length}
            isReportLoading={isTeamsReportLoading}
            onDownloadReport={handleDownload}
          >
            <TeamsBreakdown isLoading={isLoading} breakdown={breakdown} onChangeDateRange={handleChangeDateRange} />
          </DashboardSection>
        )}
      />
    </>
  );
};

export default memo(DashboardTeams);
