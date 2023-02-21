import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { updateSearch, Auth, User, Features } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useRouting, useScrollTop, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import DashboardKpi from '../Overview/DashboardKpi';
import DashboardGiftStatuses from '../Overview/DashboardGiftStatuses';
import OverviewLoader from '../../hoc/BreakdownLoaders/OverviewLoader';
import { overviewDownloadReportRequest } from '../../store/overview/overview.actions';
import DashboardSection from '../../../../components/Dashboard/Shared/DashboardSection';
import CampaignsBreakdownLoader from '../../hoc/BreakdownLoaders/CampaignsBreakdownLoader';
import CampaignsBreakdown from '../Breakdowns/CampaignsBreakdown/CampaignsBreakdown';
import { membersLoadRequest } from '../../store/members/members.actions';
import { getMembers, getMembersIsLoading, makeGetMemberById } from '../../store/members/members.selectors';
import MemberFilter from '../Header/MemberFilter';
import { campaignsDownloadReportRequest } from '../../store/breakdowns/campaigns/campaigns.actions';
import { useTrackPage } from '../../../../hooks/useTrackPage';
import { getCampaignsReportIsLoading } from '../../store/breakdowns/campaigns/campaigns.selectors';
import { getOverviewReportIsLoading } from '../../store/overview/overview.selectors';
import DashboardStickyHeader from '../Header/DashboardStickyHeader';
import GiftInvitationReportButton from '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';
import GiftBreakdownSection from '../Sections/GiftBreakdownSection/GiftBreakdownSection';

const DashboardTeamMember = ({ memberId, teamId }) => {
  const dispatch = useDispatch();
  const go = useRouting();
  const members = useSelector(getMembers);
  const isOverviewReportLoading = useSelector(getOverviewReportIsLoading);
  const isCampaignsReportLoading = useSelector(getCampaignsReportIsLoading);
  const isUserLoading = useSelector(User.selectors.getIsUserLoading);
  const isMembersLoading = useSelector(getMembersIsLoading);
  const { fullName: memberName = '' } = useSelector(useMemo(() => makeGetMemberById(memberId), [memberId])) || {};
  const isDashboardStatisticsEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.DASHBOARD_STATISTICS_V3),
  );

  const {
    dateRangeFrom,
    dateRangeTo,
    campaignsSearch,
    campaignsSort,
    campaignsDirection,
    campaignsPage,
  } = useUrlQuery([
    'contactId',
    'dateRangeFrom',
    'dateRangeTo',
    'campaignsSearch',
    'campaignsSort',
    'campaignsDirection',
    'campaignsPage',
  ]);
  const updateUrlFunc = useSetUrlQuery();

  const isHeaderLoading = isMembersLoading || isUserLoading;

  const downloadOverviewReport = useCallback(() => {
    dispatch(overviewDownloadReportRequest({ teamId, memberId, dateRangeFrom, dateRangeTo }));
  }, [dateRangeFrom, dateRangeTo, dispatch, memberId, teamId]);

  const downloadCampaignsReport = useCallback(() => {
    dispatch(
      campaignsDownloadReportRequest({
        teamId,
        memberId,
        dateRangeFrom,
        dateRangeTo,
        search: campaignsSearch,
        sort: campaignsSort,
        sortDirection: campaignsDirection,
      }),
    );
  }, [campaignsDirection, campaignsSearch, campaignsSort, dateRangeFrom, dateRangeTo, dispatch, memberId, teamId]);

  const { trackEvent } = TrackEvent.useTrackEvent();
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const handleChangeDateRange = useCallback(
    ({ from, to, preset }) => {
      updateUrlFunc({ dateRangeFrom: from, dateRangeTo: to, campaignsPage: '0', giftPage: '0' });
      trackEvent(
        'Date range - Changed',
        { page: 'team member view', preset, userId, adminId },
        { traits: { adminId } },
      );
    },
    [adminId, trackEvent, updateUrlFunc, userId],
  );

  const handleMemberChange = useCallback(
    nextMemberId => {
      go(`/teams/${teamId}/members/${nextMemberId}`);
    },
    [go, teamId],
  );

  useEffect(() => {
    dispatch(membersLoadRequest(teamId));
  }, [dispatch, teamId]);

  useTrackPage('Enterprise Dashboard — visit team members member page', {
    team_id: teamId,
    member_id: memberId,
  });

  useScrollTop();

  return (
    <>
      <OverviewLoader
        teamId={teamId}
        memberId={memberId}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        render={({ kpi, statuses, isLoading, total }) => (
          <>
            <DashboardStickyHeader
              kpi={kpi}
              isLoading={isLoading}
              renderFilter={() => (
                <MemberFilter
                  members={members}
                  memberId={memberId}
                  onFilterChange={handleChangeDateRange}
                  onMemberChange={handleMemberChange}
                  isLoading={isHeaderLoading || isLoading}
                  dateRangeFrom={dateRangeFrom}
                  dateRangeTo={dateRangeTo}
                />
              )}
            />
            <DashboardHeader
              header={`Let's see how ${memberName} is doing.`}
              subHeader={`Here’s an overview of how well ${memberName} has been performing.`}
              controls={
                <MemberFilter
                  members={members}
                  memberId={memberId}
                  onFilterChange={handleChangeDateRange}
                  onMemberChange={handleMemberChange}
                  isLoading={isHeaderLoading || isLoading}
                  dateRangeFrom={dateRangeFrom}
                  dateRangeTo={dateRangeTo}
                />
              }
            />
            <Grid container justifyContent="flex-end">
              <GiftInvitationReportButton
                memberId={memberId}
                teamId={teamId}
                dateRangeFrom={dateRangeFrom}
                dateRangeTo={dateRangeTo}
              />
            </Grid>
            <DashboardKpi kpi={kpi} isLoading={isLoading} />
            {!isDashboardStatisticsEnabled && (
              <DashboardSection
                hidePaper
                isLoading={isLoading}
                title={`Status of ${total} gift invites`}
                icon="heart-rate"
                subtitle={`This shows the current statuses of all the gifts that have been sent by ${memberName}.`}
                isReportLoading={isOverviewReportLoading}
                onDownloadReport={downloadOverviewReport}
              >
                <DashboardGiftStatuses isLoading={isLoading} statuses={statuses} />
              </DashboardSection>
            )}
          </>
        )}
      />

      <DashboardSection
        title={`${memberName} Campaigns`}
        icon="calendar-alt"
        subtitle={`Below is a breakdown of all the campaigns ${memberName} has access to.`}
        isReportLoading={isCampaignsReportLoading}
        onDownloadReport={downloadCampaignsReport}
      >
        <CampaignsBreakdownLoader
          teamId={teamId}
          memberId={memberId}
          dateRangeFrom={dateRangeFrom}
          dateRangeTo={dateRangeTo}
          sort={campaignsSort}
          sortDirection={campaignsDirection}
          search={campaignsSearch}
          render={({ breakdown, isLoading }) => (
            <CampaignsBreakdown
              sort={campaignsSort}
              sortDirection={campaignsDirection}
              dateRangeFrom={dateRangeFrom}
              dateRangeTo={dateRangeTo}
              page={campaignsPage}
              search={campaignsSearch}
              isLoading={isLoading}
              onFilterChange={updateUrlFunc}
              breakdown={breakdown}
              campaignLink={id =>
                `/campaigns/${id}/members/${memberId}?${updateSearch('', { dateRangeTo, dateRangeFrom })}`
              }
            />
          )}
        />
      </DashboardSection>

      <GiftBreakdownSection
        teamId={teamId}
        memberId={memberId}
        subtitle={`This is a list of all the gifts that have been sent by ${memberName}.`}
        placeholder={`Search ${memberName} gifts`}
      />
    </>
  );
};

DashboardTeamMember.propTypes = {
  teamId: PropTypes.number.isRequired,
  memberId: PropTypes.number.isRequired,
};

export default DashboardTeamMember;
