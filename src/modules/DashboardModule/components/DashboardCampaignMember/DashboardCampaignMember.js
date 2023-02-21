import React, { useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { Auth, Features, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useRouting, useScrollTop, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import DashboardKpi from '../Overview/DashboardKpi';
import DashboardGiftStatuses from '../Overview/DashboardGiftStatuses';
import OverviewLoader from '../../hoc/BreakdownLoaders/OverviewLoader';
import { overviewDownloadReportRequest } from '../../store/overview/overview.actions';
import DashboardSection from '../../../../components/Dashboard/Shared/DashboardSection';
import { membersLoadRequest } from '../../store/members/members.actions';
import { getMembers, getMembersIsLoading, makeGetMemberById } from '../../store/members/members.selectors';
import MemberFilter from '../Header/MemberFilter';
import { useTrackPage } from '../../../../hooks/useTrackPage';
import { getOverviewReportIsLoading } from '../../store/overview/overview.selectors';
import DashboardStickyHeader from '../Header/DashboardStickyHeader';
import { makeGetTeamIdByCampaignId } from '../../../../store/campaigns/campaigns.selectors';
import GiftInvitationReportButton from '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';
import GiftBreakdownSection from '../Sections/GiftBreakdownSection/GiftBreakdownSection';

const DashboardCampaignMember = ({ memberId, campaignId }) => {
  const dispatch = useDispatch();
  const go = useRouting();
  const members = useSelector(getMembers);
  const isOverviewReportLoading = useSelector(getOverviewReportIsLoading);
  const isMembersLoading = useSelector(getMembersIsLoading);
  const isUserLoading = useSelector(User.selectors.getIsUserLoading);
  const teamId = useSelector(useMemo(() => makeGetTeamIdByCampaignId(campaignId), [campaignId]));
  const { fullName: memberName = '' } = useSelector(useMemo(() => makeGetMemberById(memberId), [memberId])) || {};

  const isDashboardStatisticsEnabled = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.DASHBOARD_STATISTICS_V3),
  );

  const { dateRangeFrom, dateRangeTo } = useUrlQuery(['dateRangeFrom', 'dateRangeTo']);
  const updateUrlFunc = useSetUrlQuery();
  const isHeaderLoading = isMembersLoading || isUserLoading;

  const downloadOverviewReport = useCallback(
    () => dispatch(overviewDownloadReportRequest({ memberId, teamId, campaignId, dateRangeFrom, dateRangeTo })),
    [campaignId, dateRangeFrom, dateRangeTo, dispatch, memberId, teamId],
  );

  const { trackEvent } = TrackEvent.useTrackEvent();
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const handleChangeDateRange = useCallback(
    ({ from, to, preset }) => {
      updateUrlFunc({ dateRangeFrom: from, dateRangeTo: to });
      trackEvent(
        'Date range - Changed',
        { page: 'campaign member view', preset, userId, adminId },
        { traits: { adminId } },
      );
    },
    [adminId, trackEvent, updateUrlFunc, userId],
  );

  const handleMemberChange = useCallback(
    nextMemberId => {
      go(`/campaigns/${campaignId}/members/${nextMemberId}`);
    },
    [campaignId, go],
  );

  useScrollTop();

  useEffect(() => {
    if (teamId) {
      dispatch(membersLoadRequest(teamId));
    }
  }, [dispatch, teamId]);

  useTrackPage('Enterprise Dashboard — visit single campaign member page', {
    team_id: teamId,
    member_id: memberId,
    campaign_id: campaignId,
  });

  return (
    <>
      <OverviewLoader
        memberId={memberId}
        teamId={teamId}
        campaignId={campaignId}
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
              header={`Let’s see how ${memberName} is doing?`}
              subHeader={`Here’s an overview of the ${memberName} performance.`}
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
                campaignId={campaignId}
                memberId={memberId}
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
                subtitle={`This shows you the current status of all the gifts that have been sent in the ${memberName} campaign.`}
                isReportLoading={isOverviewReportLoading}
                onDownloadReport={downloadOverviewReport}
              >
                <DashboardGiftStatuses isLoading={isLoading} statuses={statuses} />
              </DashboardSection>
            )}
          </>
        )}
      />

      <GiftBreakdownSection
        teamId={teamId}
        memberId={memberId}
        campaignId={campaignId}
        subtitle={`This is a list of all the gifts that have been sent in the ${memberName} campaign.`}
      />
    </>
  );
};

DashboardCampaignMember.propTypes = {
  campaignId: PropTypes.number.isRequired,
  memberId: PropTypes.number.isRequired,
};

export default DashboardCampaignMember;
