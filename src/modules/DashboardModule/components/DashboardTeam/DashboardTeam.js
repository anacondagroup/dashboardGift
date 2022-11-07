import React, { useCallback, useMemo } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { updateSearch, User } from '@alycecom/modules';
import { useScrollTop, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import DashboardKpi from '../Overview/DashboardKpi';
import DashboardGiftStatuses from '../Overview/DashboardGiftStatuses';
import OverviewLoader from '../../hoc/BreakdownLoaders/OverviewLoader';
import { overviewDownloadReportRequest } from '../../store/overview/overview.actions';
import DashboardSection from '../../../../components/Dashboard/Shared/DashboardSection';
import { makeGetTeamById } from '../../../../store/teams/teams.selectors';
import TeamMembersBreakdown from '../Breakdowns/TeamMembersBreakdown/TeamMembersBreakdown';
import TeamMembersBreakdownLoader from '../../hoc/BreakdownLoaders/TeamMembersBreakdownLoader';
import { teamMembersDownloadReportRequest } from '../../store/breakdowns/teamMembers/teamMembers.actions';
import TeamFilters from '../Header/TeamFilters';
import CampaignsBreakdownLoader from '../../hoc/BreakdownLoaders/CampaignsBreakdownLoader';
import CampaignsBreakdown from '../Breakdowns/CampaignsBreakdown/CampaignsBreakdown';
import { campaignsDownloadReportRequest } from '../../store/breakdowns/campaigns/campaigns.actions';
import { useTrackPage } from '../../../../hooks/useTrackPage';
import { getCampaignsReportIsLoading } from '../../store/breakdowns/campaigns/campaigns.selectors';
import { getTeamsIsLoading } from '../../store/breakdowns/teams/teams.selectors';
import { getTeamMembersReportIsLoading } from '../../store/breakdowns/teamMembers/teamMembers.selectors';
import { getOverviewReportIsLoading } from '../../store/overview/overview.selectors';
import DashboardStickyHeader from '../Header/DashboardStickyHeader';
import GiftInvitationReportButton from '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';
import GiftBreakdownSection from '../Sections/GiftBreakdownSection/GiftBreakdownSection';
import GiftBatchesSection from '../Sections/GiftBatchesSection/GiftBatchesSection';

const DashboardTeam = ({ teamId }) => {
  const dispatch = useDispatch();
  const isOverviewReportLoading = useSelector(getOverviewReportIsLoading);
  const isTeamMembersReportLoading = useSelector(getTeamMembersReportIsLoading);
  const isCampaignsReportLoading = useSelector(getCampaignsReportIsLoading);
  const isTeamsLoading = useSelector(getTeamsIsLoading);
  const isUserLoading = useSelector(User.selectors.getIsUserLoading);
  const currentTeam = useSelector(useMemo(() => makeGetTeamById(teamId), [teamId]));

  const {
    dateRangeFrom,
    dateRangeTo,
    teamMembersSearch,
    teamMembersSort,
    teamMembersPage,
    teamMembersDirection,
    campaignsSearch,
    campaignsSort,
    campaignsDirection,
    campaignsPage,
  } = useUrlQuery([
    'dateRangeFrom',
    'dateRangeTo',
    'teamMembersSearch',
    'teamMembersSort',
    'teamMembersPage',
    'teamMembersDirection',
    'campaignsSearch',
    'campaignsSort',
    'campaignsDirection',
    'campaignsPage',
  ]);
  const updateUrlFunc = useSetUrlQuery();

  const teamName = R.propOr('', 'name', currentTeam);
  const isHeaderLoading = isTeamsLoading || isUserLoading;

  const downloadOverviewReport = useCallback(() => {
    dispatch(
      overviewDownloadReportRequest({
        teamId,
        dateRangeFrom,
        dateRangeTo,
      }),
    );
  }, [dateRangeFrom, dateRangeTo, dispatch, teamId]);

  const downloadTeamMembersReport = useCallback(() => {
    dispatch(
      teamMembersDownloadReportRequest({
        teamId,
        dateRangeFrom,
        dateRangeTo,
        search: teamMembersSearch,
        sort: teamMembersSort,
        sortDirection: teamMembersDirection,
      }),
    );
  }, [dateRangeFrom, dateRangeTo, dispatch, teamId, teamMembersDirection, teamMembersSearch, teamMembersSort]);

  const downloadCampaignsReport = useCallback(() => {
    dispatch(
      campaignsDownloadReportRequest({
        teamId,
        dateRangeFrom,
        dateRangeTo,
        search: campaignsSearch,
        sort: campaignsSort,
        sortDirection: campaignsDirection,
      }),
    );
  }, [campaignsDirection, campaignsSearch, campaignsSort, dateRangeFrom, dateRangeTo, dispatch, teamId]);

  useTrackPage('Enterprise Dashboard — visit team members page', {
    team_id: teamId,
  });

  useScrollTop();

  return (
    <>
      <OverviewLoader
        teamId={teamId}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        render={({ kpi, statuses, isLoading, total }) => (
          <>
            <DashboardStickyHeader
              kpi={kpi}
              isLoading={isLoading}
              renderFilter={() => <TeamFilters isLoading={isHeaderLoading || isLoading} />}
            />
            <DashboardHeader
              header={`How's ${teamName} doing?`}
              subHeader={`Here’s an overview of how well ${teamName} has been performing.`}
              controls={<TeamFilters isLoading={isHeaderLoading || isLoading} />}
            />
            <Grid container justifyContent="flex-end">
              <GiftInvitationReportButton teamId={teamId} dateRangeFrom={dateRangeFrom} dateRangeTo={dateRangeTo} />
            </Grid>
            <DashboardKpi kpi={kpi} isLoading={isLoading} />
            <DashboardSection
              hidePaper
              isLoading={isLoading}
              title={`Status of ${total} gift invites`}
              icon="heart-rate"
              subtitle={`This shows the current statuses of all the gifts that have been sent by ${teamName}.`}
              isReportLoading={isOverviewReportLoading}
              onDownloadReport={downloadOverviewReport}
            >
              <DashboardGiftStatuses isLoading={isLoading} statuses={statuses} />
            </DashboardSection>
          </>
        )}
      />
      <TeamMembersBreakdownLoader
        teamId={teamId}
        search={teamMembersSearch}
        sort={teamMembersSort}
        sortDirection={teamMembersDirection}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        render={({ breakdown, isLoading }) => (
          <DashboardSection
            title={`${teamName} Members`}
            icon="users"
            subtitle={`Here's a breakdown of all ${teamName} members.`}
            isReportLoading={isTeamMembersReportLoading}
            showDownloadReport={breakdown && !!breakdown.length}
            onDownloadReport={downloadTeamMembersReport}
          >
            <TeamMembersBreakdown
              isLoading={isLoading}
              sort={teamMembersSort}
              teamName={teamName}
              sortDirection={teamMembersDirection}
              search={teamMembersSearch}
              onFilterChange={updateUrlFunc}
              breakdown={breakdown}
              page={teamMembersPage}
              memberLink={id => `/teams/${teamId}/members/${id}?${updateSearch('', { dateRangeTo, dateRangeFrom })}`}
            />
          </DashboardSection>
        )}
      />

      <CampaignsBreakdownLoader
        teamId={teamId}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        sort={campaignsSort}
        sortDirection={campaignsDirection}
        search={campaignsSearch}
        render={({ breakdown, isLoading }) => (
          <DashboardSection
            title={`${teamName} Campaigns`}
            icon="calendar-alt"
            subtitle={`Below is a breakdown of all the campaigns ${teamName} has access to.`}
            isReportLoading={isCampaignsReportLoading}
            showDownloadReport={breakdown && !!breakdown.length}
            onDownloadReport={downloadCampaignsReport}
          >
            <CampaignsBreakdown
              sort={campaignsSort}
              page={campaignsPage}
              sortDirection={campaignsDirection}
              dateRangeFrom={dateRangeFrom}
              dateRangeTo={dateRangeTo}
              search={campaignsSearch}
              isLoading={isLoading}
              onFilterChange={updateUrlFunc}
              breakdown={breakdown}
              teamName={teamName}
              campaignLink={id => `/campaigns/${id}?${updateSearch('', { dateRangeTo, dateRangeFrom })}`}
            />
          </DashboardSection>
        )}
      />

      <GiftBreakdownSection
        teamId={teamId}
        subtitle={`This is a list of all the gifts that have been sent by ${teamName}.`}
        placeholder={`Search ${teamName} gifts`}
      />

      <GiftBatchesSection
        teamId={teamId}
        subtitle="These are Prospecting campaign gifts. Once sent, individual gifts will be shown in the table above."
        placeholder={`Search Alyce: ${teamName} gifts`}
      />
    </>
  );
};

DashboardTeam.propTypes = {
  teamId: PropTypes.number.isRequired,
};

export default DashboardTeam;
