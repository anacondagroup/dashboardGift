import React, { useCallback, useMemo, useReducer, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { updateSearch, Auth, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import { useRouting, useScrollTop, useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';
import { ModalConfirmationMessage } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import DashboardHeader from '../../../../components/Dashboard/Header/DashboardHeader';
import DashboardKpi from '../Overview/DashboardKpi';
import DashboardGiftStatuses from '../Overview/DashboardGiftStatuses';
import OverviewLoader from '../../hoc/BreakdownLoaders/OverviewLoader';
import { overviewDownloadReportRequest } from '../../store/overview/overview.actions';
import DashboardSection from '../../../../components/Dashboard/Shared/DashboardSection';
import {
  getCampaigns,
  getIsCampaignsLoading,
  makeGetCampaignById,
  makeIsCanEditCampaignByTeamId,
} from '../../../../store/campaigns/campaigns.selectors';
import TeamMembersBreakdown from '../Breakdowns/TeamMembersBreakdown/TeamMembersBreakdown';
import TeamMembersBreakdownLoader from '../../hoc/BreakdownLoaders/TeamMembersBreakdownLoader';
import { teamMembersDownloadReportRequest } from '../../store/breakdowns/teamMembers/teamMembers.actions';
import CampaignFilters from '../Header/CampaignFilters';
import { useTrackPage } from '../../../../hooks/useTrackPage';
import { getOverviewReportIsLoading } from '../../store/overview/overview.selectors';
import { getTeamMembersReportIsLoading } from '../../store/breakdowns/teamMembers/teamMembers.selectors';
import DashboardStickyHeader from '../Header/DashboardStickyHeader';
import GiftInvitationReportButton from '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';
import DashboardSwagBatchBreakdown from '../Overview/DashboardSwagBatchBreakdown';
import { swagBatchesDownloadReportLink } from '../../store/breakdowns/swagBatches/swagBatches.actions';
import ActivateDashboardGiftStatuses from '../Overview/ActivateDashboardGiftStatuses';
import CampaignGiftBreakdownSection from '../Sections/CampaignGiftBreakdownSection/CampaignGiftBreakdownSection';
import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import DashboardCampaignHeader from '../DashboardCampaignHeader/DashboardCampaignHeader';
import { sendGiftReport } from '../../store/breakdowns/giftReport/giftReport.actions';
import GiftBatchesSection from '../Sections/GiftBatchesSection/GiftBatchesSection';
import { archiveCampaigns } from '../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';

import { dashboardSingleCampaign, dashboardSingleCampaignInitialState } from './store/dashboardSingleCampaign.reducer';
import { setEmail, setReportModalDisplay, setCurrentActionCampaign } from './store/dashboardSingleCampaign.actions';

const { getUserEmail } = Auth.selectors;

const useStyles = makeStyles(theme => ({
  rootModal: {
    width: 520,
  },
  emailField: {
    width: 460,
  },
  submitButtonModal: {
    backgroundColor: theme.palette.secondary.main,
  },
  rootArchiveModal: {
    width: 500,
    borderTop: `4px solid ${theme.palette.secondary.main}`,
  },
  modalAvatar: {
    backgroundColor: theme.palette.secondary.main,
  },
}));

const DashboardSingleCampaign = ({ campaignId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const go = useRouting();

  const campaigns = useSelector(getCampaigns);
  const campaign = useSelector(useMemo(() => makeGetCampaignById(String(campaignId)), [campaignId])) || {};
  const { name: campaignName = null, type: campaignType, team_id: teamId = null } = campaign;

  const canEditCampaign = useSelector(useMemo(() => makeIsCanEditCampaignByTeamId(String(teamId)), [teamId]));

  const isOverviewReportLoading = useSelector(getOverviewReportIsLoading);
  const isTeamMembersReportLoading = useSelector(getTeamMembersReportIsLoading);
  const isUserLoading = useSelector(User.selectors.getIsUserLoading);
  const isCampaignsLoading = useSelector(getIsCampaignsLoading);
  const isHeaderLoading = isUserLoading || isCampaignsLoading;

  const {
    dateRangeFrom,
    dateRangeTo,
    teamMembersSearch,
    teamMembersSort,
    teamMembersPage,
    teamMembersDirection,
  } = useUrlQuery([
    'dateRangeFrom',
    'dateRangeTo',
    'teamMembersSearch',
    'teamMembersSort',
    'teamMembersPage',
    'teamMembersDirection',
  ]);
  const updateUrlFunc = useSetUrlQuery();

  const defaultEmail = useSelector(getUserEmail);

  const [state, campaignDispatch] = useReducer(dashboardSingleCampaign, dashboardSingleCampaignInitialState);

  const { email, isReportModalDisplay, currentActionCampaign } = state;

  useEffect(() => {
    campaignDispatch(setEmail(defaultEmail));
  }, [campaignDispatch, defaultEmail]);

  const onEmailType = useCallback(
    ({ currentTarget }) => {
      campaignDispatch(setEmail(currentTarget.value));
    },
    [campaignDispatch],
  );

  const handleSubmitExportReport = useCallback(() => {
    dispatch(
      sendGiftReport({
        email,
        from: dateRangeFrom,
        to: dateRangeTo,
        campaignId: campaignId && Number(campaignId),
      }),
    );
    campaignDispatch(setReportModalDisplay(false));
  }, [dispatch, campaignDispatch, email, campaignId, dateRangeFrom, dateRangeTo]);

  const handleCancelExportReport = useCallback(() => campaignDispatch(setReportModalDisplay(false)), [
    campaignDispatch,
  ]);

  const { trackEvent } = TrackEvent.useTrackEvent();
  const userId = useSelector(User.selectors.getUserId);
  const adminId = useSelector(Auth.selectors.getLoginAsAdminId);
  const handleChangeDateRange = useCallback(
    ({ from, to, preset }) => {
      updateUrlFunc({ dateRangeFrom: from, dateRangeTo: to, giftPage: '0', teamMembersPage: '0' });
      trackEvent('Date range - Changed', { page: 'campaign view', preset, userId, adminId }, { traits: { adminId } });
    },
    [adminId, trackEvent, updateUrlFunc, userId],
  );

  const handleCampaignChange = useCallback(
    (nextCampaignId, dateRange) => go(`/campaigns/${nextCampaignId}?${updateSearch('', dateRange)}`),
    [go],
  );

  const downloadOverviewReport = useCallback(
    () => dispatch(overviewDownloadReportRequest({ teamId, campaignId, dateRangeFrom, dateRangeTo })),
    [campaignId, dateRangeFrom, dateRangeTo, dispatch, teamId],
  );
  const downloadTeamMembersReport = useCallback(
    () =>
      dispatch(
        teamMembersDownloadReportRequest({
          campaignId,
          teamId,
          dateRangeFrom,
          dateRangeTo,
          search: teamMembersSearch,
          sort: teamMembersSort,
          sortDirection: teamMembersDirection,
        }),
      ),
    [
      campaignId,
      dateRangeFrom,
      dateRangeTo,
      dispatch,
      teamId,
      teamMembersDirection,
      teamMembersSearch,
      teamMembersSort,
    ],
  );

  const handleOpenReportModal = useCallback(() => campaignDispatch(setReportModalDisplay(true)), [campaignDispatch]);

  const [isArchiveModalOpened, setArchiveModalOpened] = useState(false);

  const handleOpenArchiveCampaignModal = useCallback(
    activeCampaign => {
      campaignDispatch(setCurrentActionCampaign(activeCampaign));
      setArchiveModalOpened(true);
    },
    [campaignDispatch],
  );
  const handleCloseArchiveCampaignModal = useCallback(() => {
    setArchiveModalOpened(false);
  }, []);

  const handleSubmitArchiveCampaign = useCallback(() => {
    setArchiveModalOpened(false);
    if (currentActionCampaign) {
      dispatch(archiveCampaigns({ campaigns: [currentActionCampaign] }));
    }
  }, [dispatch, currentActionCampaign]);

  useTrackPage('Enterprise Dashboard — visit single campaign page', {
    team_id: teamId,
    campaign_id: campaignId,
  });

  useScrollTop();

  return (
    <>
      <OverviewLoader
        teamId={teamId}
        campaignId={campaignId}
        dateRangeFrom={dateRangeFrom}
        dateRangeTo={dateRangeTo}
        render={({ kpi, statuses, isLoading, total, forceUpdate }) => (
          <>
            {teamId ? (
              <DashboardCampaignHeader
                campaign={campaign}
                isLoading={isHeaderLoading || isLoading}
                dateRangeFrom={dateRangeFrom}
                dateRangeTo={dateRangeTo}
                onFilterChange={handleChangeDateRange}
                onOpenReportModal={handleOpenReportModal}
                onOpenArchiveCampaignModal={handleOpenArchiveCampaignModal}
              />
            ) : (
              <>
                <DashboardStickyHeader
                  kpi={kpi}
                  isLoading={isLoading}
                  renderFilter={() => (
                    <CampaignFilters
                      campaigns={campaigns}
                      campaignId={campaignId}
                      onFilterChange={handleChangeDateRange}
                      onCampaignChange={nextCampaignId =>
                        handleCampaignChange(nextCampaignId, { dateRangeTo, dateRangeFrom })
                      }
                      isLoading={isHeaderLoading || isLoading}
                      dateRangeFrom={dateRangeFrom}
                      dateRangeTo={dateRangeTo}
                      canEditCampaign={canEditCampaign}
                    />
                  )}
                />
                <DashboardHeader
                  header={`How's ${campaignName} doing?`}
                  subHeader={`Here’s an overview of the ${campaignName} performance.`}
                  controls={
                    <CampaignFilters
                      campaigns={campaigns}
                      campaignId={campaignId}
                      onFilterChange={handleChangeDateRange}
                      onCampaignChange={nextCampaignId =>
                        handleCampaignChange(nextCampaignId, { dateRangeTo, dateRangeFrom })
                      }
                      isLoading={isHeaderLoading || isLoading}
                      dateRangeFrom={dateRangeFrom}
                      dateRangeTo={dateRangeTo}
                      canEditCampaign={canEditCampaign}
                    />
                  }
                />
                <Grid container justifyContent="flex-end">
                  <GiftInvitationReportButton
                    campaignId={campaignId}
                    dateRangeFrom={dateRangeFrom}
                    dateRangeTo={dateRangeTo}
                  />
                </Grid>
              </>
            )}
            <DashboardKpi kpi={kpi} isLoading={isLoading} campaignType={campaignType} />

            {campaignType === CAMPAIGN_TYPES.STANDARD && (
              <DashboardSection
                hidePaper
                isLoading={isLoading}
                icon="heart-rate"
                title={`Status of ${total || 0} gift invites`}
                subtitle={`This shows you the current status of all the gifts that have been sent in the ${campaignName} campaign.`}
                isReportLoading={isOverviewReportLoading}
                onDownloadReport={downloadOverviewReport}
              >
                <DashboardGiftStatuses isLoading={isLoading} statuses={statuses} />
              </DashboardSection>
            )}

            {campaignType === CAMPAIGN_TYPES.ACTIVATE && (
              <DashboardSection
                hidePaper
                isLoading={isLoading}
                icon="heart-rate"
                title={`Status of ${total || 0} gift invites`}
                subtitle={`Here's an overview of the ${campaignName} performance.`}
                isReportLoading={isOverviewReportLoading}
                onDownloadReport={downloadOverviewReport}
              >
                <ActivateDashboardGiftStatuses isLoading={isLoading} statuses={statuses} />
              </DashboardSection>
            )}

            {campaignType && campaignType.includes('swag') && (
              <DashboardSection
                isLoading={isLoading}
                title={`${campaignName} batches`}
                icon="users"
                subtitle={`Here's a breakdown of all ${campaignName} batches`}
                isReportLoading={isOverviewReportLoading}
                onDownloadReport={() => dispatch(swagBatchesDownloadReportLink(`${campaignName}_batches_report.xlsx`))}
              >
                <DashboardSwagBatchBreakdown
                  dateRangeFrom={dateRangeFrom}
                  dateRangeTo={dateRangeTo}
                  campaignId={campaignId}
                  teamId={teamId}
                  forceUpdate={forceUpdate}
                  canEditCampaign={canEditCampaign}
                  campaignType={campaignType}
                />
              </DashboardSection>
            )}
          </>
        )}
      />

      {teamId && campaignType === CAMPAIGN_TYPES.STANDARD && (
        <TeamMembersBreakdownLoader
          teamId={teamId}
          campaignId={campaignId}
          search={teamMembersSearch}
          sort={teamMembersSort}
          sortDirection={teamMembersDirection}
          dateRangeFrom={dateRangeFrom}
          dateRangeTo={dateRangeTo}
          render={({ breakdown, isLoading }) => (
            <DashboardSection
              title={`${campaignName} Members`}
              icon="users"
              subtitle={`Here's a breakdown of all the ${campaignName} campaign members.`}
              isReportLoading={isTeamMembersReportLoading}
              showDownloadReport={breakdown && !!breakdown.length}
              onDownloadReport={downloadTeamMembersReport}
            >
              <TeamMembersBreakdown
                isLoading={isLoading}
                sort={teamMembersSort}
                teamName={campaignName}
                sortDirection={teamMembersDirection}
                search={teamMembersSearch}
                onFilterChange={updateUrlFunc}
                breakdown={breakdown}
                page={teamMembersPage}
                memberLink={id =>
                  `/campaigns/${campaignId}/members/${id}?${updateSearch('', { dateRangeTo, dateRangeFrom })}`
                }
              />
            </DashboardSection>
          )}
        />
      )}
      {campaignType && (
        <CampaignGiftBreakdownSection
          campaignId={campaignId}
          campaignName={campaignName}
          campaignType={campaignType}
          teamId={teamId}
        />
      )}
      {campaignType === CAMPAIGN_TYPES.PROSPECTING && (
        <GiftBatchesSection
          teamId={teamId}
          campaignId={campaignId}
          subtitle="These are Prospecting campaign gifts. Once sent, individual gifts will be shown in the table above."
          placeholder={`Search Alyce: ${campaignName} gifts`}
        />
      )}
      <ModalConfirmationMessage
        title="Export Gift Invitation report"
        variant="success"
        icon=""
        submitButtonText="Export"
        cancelButtonText="Cancel"
        isOpen={isReportModalDisplay}
        width="100%"
        onSubmit={handleSubmitExportReport}
        onDiscard={handleCancelExportReport}
        customClasses={{ root: classes.rootModal }}
      >
        <Box>
          <Typography>
            Export a spreadsheet of your gift invitation data of this campaign with your current filter applied.
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography color="var(--Chambray-100)">Email address to receive this file</Typography>
          <TextField className={classes.emailField} value={email} onChange={onEmailType} variant="outlined" />
        </Box>
      </ModalConfirmationMessage>
      <ModalConfirmationMessage
        title="Archive campaigns"
        icon="question-circle"
        variant="info"
        submitButtonText="Archive"
        cancelButtonText="Cancel"
        width="100%"
        isOpen={isArchiveModalOpened}
        onSubmit={handleSubmitArchiveCampaign}
        onDiscard={handleCloseArchiveCampaignModal}
        customClasses={{
          submitButton: classes.submitButtonModal,
          root: classes.rootArchiveModal,
          avatar: classes.modalAvatar,
        }}
      >
        <Box>
          This action will expire active campaigns, prevent recipients to access gift links and exclude campaign data
          from reporting.
        </Box>
      </ModalConfirmationMessage>
    </>
  );
};

DashboardSingleCampaign.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default DashboardSingleCampaign;
