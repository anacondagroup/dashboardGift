import React, { memo, useCallback, useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Features, updateSearch, User } from '@alycecom/modules';
import { useUrlQuery } from '@alycecom/hooks';
import { TrackEvent } from '@alycecom/services';
import { useHistory } from 'react-router-dom';
import { AlyceTheme, ModalConfirmationMessage, RowLimit } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import DashboardCampaignsFilterSection from '../../Sections/DashboardCampaignsFilterSection/DashboardCampaignsFilterSection';
import CustomTable from '../../../../../components/Shared/CustomTable/CustomTable';
import { AlignColumnsValues, ICustomTableColumn } from '../../../../../components/Shared/CustomTable/CustomTable.types';
import {
  getCampaignsList,
  getCampaignsListTotalAmount,
  getIsCampaignsListLoading,
  getPageSelectedCampaignsCount,
  getSelectedCampaigns,
} from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.selectors';
import NoCampaigns from '../../../../SettingsModule/components/CampaignSettings/CampaignTables/NoCampaigns';
import { ICampaignBreakdownListItem } from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';
import { TABLE_SORT } from '../../../../../components/Shared/CustomTable/customTable.constants';
import { TCampaignTableSetValues } from '../../../store/breakdowns/campaignsManagement/filters/filters.types';
import { resetFilters, setFilters } from '../../../store/breakdowns/campaignsManagement/filters/filters.actions';
import { getCampaignsFiltersStateWithoutStatus } from '../../../store/breakdowns/campaignsManagement/filters/filters.selectors';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import { createCampaignSidebarLoadingData } from '../../../../SettingsModule/store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { swagSelectLoadCampaignRequest } from '../../../../SettingsModule/store/campaign/swagSelect/swagSelect.actions';
import {
  archiveCampaigns,
  discardActivateDraftById,
  discardProspectingDraftById,
  expireActivateOrSwagCampaigns,
  resetSelection,
  setStandardCampaignExpired,
  toggleSelection,
  unArchiveCampaigns,
  unExpireActivateOrSwagCampaigns,
} from '../../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';
import { getCampaignSettingsUrl } from '../../../helpers/campaignsManagement.helpers';
import { fetchCampaignsWithStoredFilters } from '../../../store/breakdowns/campaignsManagement/campaignsManagement.actions';
import {
  expireProspectingCampaignById,
  unexpireProspectingCampaignById,
} from '../../../../ProspectingCampaignModule/store/prospectingCampaign/prospectingCampaign.actions';
import { useDuplicateCampaign } from '../../../hooks/useDuplicateCampaign';

import CampaignTableRow from './CampaignTableRow';
import CampaignTableToolbar from './CampaignTableToolbar';
import CampaignTableHead from './CampaignTableHead';
import CampaignTableFooter from './CampaignTableFooter';
import CampaignTableEmptyRow from './CampaignTableEmptyRow';

const columns: ICustomTableColumn<ICampaignBreakdownListItem>[] = [
  {
    name: 'Campaign Name',
    field: 'name',
    align: AlignColumnsValues.left,
    width: '100%',
  },
  {
    name: '',
    field: '',
    isSortDisabled: true,
    width: '130px',
  },
  {
    name: 'Type',
    field: 'type',
    align: AlignColumnsValues.left,
  },
  {
    name: 'Team',
    field: 'team.name',
    align: AlignColumnsValues.left,
    width: '110px',
  },
  {
    name: 'Sent',
    field: 'giftsSent',
    align: AlignColumnsValues.right,
    width: '95px',
  },
  {
    name: 'Viewed',
    field: 'giftsViewed',
    align: AlignColumnsValues.right,
    width: '95px',
  },
  {
    name: 'Accepted',
    field: 'giftsAccepted',
    align: AlignColumnsValues.right,
    width: '95px',
  },
  {
    name: 'Meetings',
    field: 'meetingsBooked',
    align: AlignColumnsValues.right,
    width: '95px',
  },
  {
    name: 'Spent',
    field: 'amountSpent',
    align: AlignColumnsValues.right,
    width: '95px',
  },
];

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  submitButtonModal: {
    backgroundColor: palette.secondary.main,
  },
  rootModal: {
    width: 500,
    borderTop: `4px solid ${palette.secondary.main}`,
  },
  modalAvatar: {
    backgroundColor: palette.secondary.main,
  },
}));

const getDefaultLimit = (innerHeight: number) => {
  if (innerHeight < 1200) {
    return RowLimit.Limit10;
  }
  if (innerHeight >= 1200 && innerHeight < 2100) {
    return RowLimit.Limit25;
  }
  return RowLimit.Limit50;
};

const CampaignsManagement = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { innerHeight } = window;

  const [currentActionCampaigns, setCurrentActionCampaigns] = useState<ICampaignBreakdownListItem[]>([]);
  const [isArchiveModalOpened, setArchiveModalOpened] = useState(false);

  const userId = useSelector(User.selectors.getUserId);
  const isLoading = useSelector(getIsCampaignsListLoading);
  const totalAmount = useSelector(getCampaignsListTotalAmount);
  const campaigns = useSelector(getCampaignsList);
  const filtersState = useSelector(getCampaignsFiltersStateWithoutStatus);

  const selectedCampaigns = useSelector(getSelectedCampaigns);
  const pageSelectedCampaignsCount = useSelector(getPageSelectedCampaignsCount);

  const hasAlyceForMarketingFeature = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING),
  );
  const hasSwagAddonFeature = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.SWAG_ADD_ON));
  const hasNewSwagCampaigns = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.GIFT_REDEMPTION_CODES_2_0));

  const { trackEvent } = TrackEvent.useTrackEvent();
  useEffect(() => {
    trackEvent('Enterprise Dashboard — visit campaigns management page', { userId });
  }, [userId, trackEvent]);

  const { dateRangeFrom, dateRangeTo } = useUrlQuery(['dateRangeFrom', 'dateRangeTo']);

  const { search, teamId, countryIds, sortField, sortDirection, currentPage, limit } = filtersState;

  const getCampaignDetailsUrl = useCallback(
    id => `/campaigns/${id}?${updateSearch('', { dateRangeFrom, dateRangeTo })}`,
    [dateRangeFrom, dateRangeTo],
  );

  const setValues = useCallback<TCampaignTableSetValues>(
    payload => {
      dispatch(setFilters(payload));
    },
    [dispatch],
  );

  useEffect(
    () => () => {
      dispatch(resetFilters());
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchCampaignsWithStoredFilters());
  }, [dispatch]);

  const handleToggleSelectAll = useCallback(
    (checked: boolean) => {
      dispatch(toggleSelection({ campaigns, checked }));
    },
    [dispatch, campaigns],
  );
  const handleToggleSelect = useCallback(
    (campaign: ICampaignBreakdownListItem, checked: boolean) => {
      dispatch(toggleSelection({ campaigns: [campaign], checked }));
    },
    [dispatch],
  );
  const handleResetSelection = useCallback(() => dispatch(resetSelection()), [dispatch]);

  const checkIsSelected = useCallback(
    (campaign: ICampaignBreakdownListItem) => selectedCampaigns.some(({ id }) => id === campaign.id),
    [selectedCampaigns],
  );

  const handleOpenCampaignSettings = useCallback(
    (campaign: ICampaignBreakdownListItem) => {
      const isLegacySwag =
        hasSwagAddonFeature &&
        (campaign.type === CAMPAIGN_TYPES.SWAG_DIGITAL || campaign.type === CAMPAIGN_TYPES.SWAG_PHYSICAL) &&
        campaign.status === CAMPAIGN_STATUS.DRAFT;
      if (isLegacySwag) {
        dispatch(createCampaignSidebarLoadingData());
        dispatch(swagSelectLoadCampaignRequest(campaign.id));
        return;
      }

      const campaignSettingsUrl = getCampaignSettingsUrl(campaign, {
        is1ToManyEnabled: hasAlyceForMarketingFeature,
        isNewSwagEnabled: hasNewSwagCampaigns,
      });
      history.push(campaignSettingsUrl);
    },
    [dispatch, history, hasAlyceForMarketingFeature, hasSwagAddonFeature, hasNewSwagCampaigns],
  );

  const handleOpenCampaignDetails = useCallback(
    (campaign: ICampaignBreakdownListItem) => {
      history.push(getCampaignDetailsUrl(campaign.id));
    },
    [history, getCampaignDetailsUrl],
  );

  const handleDuplicateCampaign = useDuplicateCampaign();

  const handleSetCampaignExpired = useCallback(
    (campaign: ICampaignBreakdownListItem) => {
      if (campaign.type === CAMPAIGN_TYPES.STANDARD) {
        dispatch(
          setStandardCampaignExpired({
            campaignId: campaign.id,
            isExpired: campaign.status === CAMPAIGN_STATUS.ACTIVE,
          }),
        );
      }
      if (
        [
          CAMPAIGN_TYPES.ACTIVATE,
          CAMPAIGN_TYPES.SWAG,
          CAMPAIGN_TYPES.SWAG_DIGITAL,
          CAMPAIGN_TYPES.SWAG_PHYSICAL,
        ].includes(campaign.type)
      ) {
        dispatch(
          campaign.status === CAMPAIGN_STATUS.ACTIVE
            ? expireActivateOrSwagCampaigns({ campaignIds: [campaign.id] })
            : unExpireActivateOrSwagCampaigns({ campaignIds: [campaign.id] }),
        );
      }
      if (campaign.type === CAMPAIGN_TYPES.PROSPECTING) {
        dispatch(
          campaign.status === CAMPAIGN_STATUS.ACTIVE
            ? expireProspectingCampaignById(campaign.id)
            : unexpireProspectingCampaignById(campaign.id),
        );
      }
    },
    [dispatch],
  );

  const handleDiscardDraft = useCallback(
    (campaign: ICampaignBreakdownListItem) => {
      if (campaign.type === CAMPAIGN_TYPES.PROSPECTING) {
        dispatch(discardProspectingDraftById.pending(campaign.id));
      }
      if (campaign.type === CAMPAIGN_TYPES.ACTIVATE) {
        dispatch(discardActivateDraftById.pending(campaign.id));
      }
    },
    [dispatch],
  );

  const handleOpenArchiveCampaignsModal = useCallback((actionCampaigns: ICampaignBreakdownListItem[]) => {
    setCurrentActionCampaigns(actionCampaigns);
    setArchiveModalOpened(true);
  }, []);

  const handleCloseArchiveCampaignsModal = useCallback(() => {
    setArchiveModalOpened(false);
  }, []);

  const handleSubmitArchiveCampaigns = useCallback(() => {
    setArchiveModalOpened(false);
    if (currentActionCampaigns.length > 0) {
      dispatch(archiveCampaigns({ campaigns: currentActionCampaigns }));
    }
  }, [dispatch, currentActionCampaigns]);

  const handleUnArchiveCampaigns = useCallback(
    (actionCampaigns: ICampaignBreakdownListItem[]) => {
      if (actionCampaigns.length > 0) {
        dispatch(unArchiveCampaigns({ campaigns: actionCampaigns }));
      }
    },
    [dispatch],
  );

  return (
    <Box>
      <DashboardCampaignsFilterSection setValues={setValues}>
        <CustomTable
          sx={{ tableLayout: 'fixed', minWidth: '970px' }}
          isLoading={isLoading}
          placeholder="Search campaigns"
          columns={columns}
          rowData={campaigns}
          search={search ?? ''}
          sortField={sortField}
          sortDirection={(sortDirection as TABLE_SORT) ?? TABLE_SORT.ASC}
          setValues={setValues}
          currentPage={currentPage ? Number(currentPage) : 1}
          limit={limit ? Number(limit) : getDefaultLimit(innerHeight)}
          total={totalAmount}
          renderRow={({ rowDataItem }) => (
            <CampaignTableRow
              key={rowDataItem.id}
              rowItem={rowDataItem}
              isLoading={isLoading}
              campaignLink={getCampaignDetailsUrl}
              onOpenCampaignSettings={handleOpenCampaignSettings}
              onDuplicateCampaign={handleDuplicateCampaign}
              onOpenCampaignDetails={handleOpenCampaignDetails}
              onSetCampaignExpired={handleSetCampaignExpired}
              onDiscardDraft={handleDiscardDraft}
              onOpenArchiveCampaignModal={campaign => handleOpenArchiveCampaignsModal([campaign])}
              isSelected={checkIsSelected(rowDataItem)}
              onToggleSelect={handleToggleSelect}
              onUnArchiveCampaign={campaign => handleUnArchiveCampaigns([campaign])}
            />
          )}
          ToolbarComponent={CampaignTableToolbar}
          ToolbarComponentProps={{
            search,
            teamId,
            countryIds,
            setValues,
            sortField,
            sortDirection,
            onOpenBulkArchiveCampaignsModal: handleOpenArchiveCampaignsModal,
            onUnArchiveCampaign: handleUnArchiveCampaigns,
          }}
          EmptyRowComponent={CampaignTableEmptyRow}
          TableHeadComponent={CampaignTableHead}
          TableHeadComponentProps={{
            pageCount: campaigns.length,
            pageSelectedCount: pageSelectedCampaignsCount,
            selectedTotal: selectedCampaigns.length,
            onToggleSelectAll: handleToggleSelectAll,
            onResetSelection: handleResetSelection,
            isLoading,
          }}
          NoDataComponent={NoCampaigns}
          NoDataComponentProps={{
            dataSetName: 'campaign',
            teamName: '',
          }}
          TableFooterComponent={CampaignTableFooter}
          TableFooterComponentProps={{
            limit: limit ? Number(limit) : getDefaultLimit(innerHeight),
            total: totalAmount,
            currentPage,
            onPaginationChange: setValues,
          }}
        />
      </DashboardCampaignsFilterSection>
      <ModalConfirmationMessage
        title={`Archive ${
          currentActionCampaigns.length > 1 ? `${currentActionCampaigns.length} campaigns` : `campaign`
        }`}
        variant="info"
        submitButtonText="Archive"
        cancelButtonText="Cancel"
        width="100%"
        isOpen={isArchiveModalOpened}
        onSubmit={handleSubmitArchiveCampaigns}
        onDiscard={handleCloseArchiveCampaignsModal}
        customClasses={{
          submitButton: classes.submitButtonModal,
          root: classes.rootModal,
          avatar: classes.modalAvatar,
        }}
      >
        <Box>
          This action will expire active campaigns, prevent recipients to access gift links and exclude campaign data
          from reporting.
        </Box>
      </ModalConfirmationMessage>
    </Box>
  );
};

export default memo(CampaignsManagement);
