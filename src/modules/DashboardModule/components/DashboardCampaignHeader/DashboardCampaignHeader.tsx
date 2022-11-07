import React, { memo, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features, User } from '@alycecom/modules';
import { makeStyles } from '@mui/styles';
import { ActionsMenu, AlyceTheme, DateRangeSelect, Icon, IMenuItem } from '@alycecom/ui';
import { Box, Typography } from '@mui/material';
import { Link, useHistory } from 'react-router-dom';

import { deleteAllGiftsFromTransferSelection } from '../../store/breakdowns/giftTransfer/giftTransfer.actions';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import { ICampaign } from '../../../../store/campaigns/campaigns.types';
import { ActivateCampaignRoutes, ActivateEditorStep } from '../../../ActivateModule/routePaths';
import { ProspectingCampaignRoutes } from '../../../ProspectingCampaignModule/routePaths';
import {
  expireActivateOrSwagCampaigns,
  setStandardCampaignExpired,
  unExpireActivateOrSwagCampaigns,
} from '../../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.actions';
import {
  StandardCampaignEditorSubTabs,
  StandardCampaignEditorTabs,
  StandardCampaignRoutes,
} from '../../../SettingsModule/components/StandardCampaignModule/routePaths';
import { getActionAvailabilityOptions, getArchiveAvailabilityOptions } from '../../helpers/campaignsManagement.helpers';
import CampaignStatusLabel from '../DashboardCampaigns/CampaignsManagement/CampaignStatusLabel';
import {
  expireProspectingCampaignById,
  unexpireProspectingCampaignById,
} from '../../../ProspectingCampaignModule/store/prospectingCampaign/prospectingCampaign.actions';
import { useDuplicateCampaign } from '../../hooks/useDuplicateCampaign';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    minHeight: '90px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.common.white,
    borderBottom: `solid 1px ${palette.divider}`,
    margin: spacing(-3, -3, 0, -3),
  },
  dateRange: {
    minWidth: 265,
  },
  actionButton: {
    color: palette.link.main,
    height: spacing(6),
    width: 130,
    border: `1px solid ${palette.grey.regular}`,
    '&:hover': {
      border: `solid 1px ${palette.primary.main}`,
    },
  },
}));

interface IDashboardCampaignHeaderProps {
  campaign: ICampaign;
  dateRangeFrom: string;
  dateRangeTo: string;
  isLoading: boolean;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenReportModal: (data: ICampaign) => void;
  onOpenArchiveCampaignModal: (data: ICampaign) => void;
}

const DashboardCampaignHeader = ({
  campaign,
  dateRangeFrom = '',
  dateRangeTo = '',
  isLoading = false,
  onFilterChange,
  onOpenReportModal,
  onOpenArchiveCampaignModal,
}: IDashboardCampaignHeaderProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(User.selectors.getUser);

  const canEditCampaign = useMemo(() => user.canManageTeams.includes(campaign.team_id), [user, campaign]);
  const canCreateCampaign = user.canManageTeams.length > 0;

  const hasAlyceForMarketingFeature = useSelector(
    Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING),
  );

  const hasEditor = Boolean(campaign.updatedBy || campaign.createdBy);
  const campaignLastEditorLabel = campaign.updatedBy
    ? `Updated by ${campaign.updatedBy.firstName} ${campaign.updatedBy.lastName}`
    : `Created by ${campaign.createdBy?.firstName} ${campaign.createdBy?.lastName}`;
  const campaignEditorLabel = hasEditor ? campaignLastEditorLabel : '';

  const activateUrl =
    hasAlyceForMarketingFeature && campaign && campaign.type === CAMPAIGN_TYPES.ACTIVATE
      ? ActivateCampaignRoutes.buildEditorUrl(campaign.id)
      : '';
  const prospectingUrl =
    campaign && campaign.type === CAMPAIGN_TYPES.PROSPECTING
      ? ProspectingCampaignRoutes.buildEditorUrl(campaign.id)
      : '';

  const getCampaignSettingsUrl = useCallback(
    (campaignId: number) =>
      activateUrl ||
      prospectingUrl ||
      StandardCampaignRoutes.buildEditorUrl(
        campaignId,
        StandardCampaignEditorTabs.SettingsAndPermissions,
        StandardCampaignEditorSubTabs.General,
      ),
    [activateUrl, prospectingUrl],
  );

  const onOpenCampaignSettings = useCallback(
    (currentCampaign: ICampaign) => {
      history.push(getCampaignSettingsUrl(currentCampaign.id));
    },
    [history, getCampaignSettingsUrl],
  );

  const onOpenRecipientExperience = useCallback((currentCampaign: ICampaign) => {
    window.open(`${window.APP_CONFIG.apiHost}/api/v1/campaigns/${currentCampaign.id}/preview`, '_blank');
  }, []);

  const handleDuplicateCampaign = useDuplicateCampaign();

  const onSetCampaignExpired = useCallback(
    (currentCampaign: ICampaign) => {
      if (currentCampaign.type === CAMPAIGN_TYPES.STANDARD) {
        dispatch(
          setStandardCampaignExpired({
            campaignId: currentCampaign.id,
            isExpired: currentCampaign.status === CAMPAIGN_STATUS.ACTIVE,
          }),
        );
      }
      if (
        [
          CAMPAIGN_TYPES.ACTIVATE,
          CAMPAIGN_TYPES.SWAG,
          CAMPAIGN_TYPES.SWAG_DIGITAL,
          CAMPAIGN_TYPES.SWAG_PHYSICAL,
        ].includes(currentCampaign.type)
      ) {
        dispatch(
          currentCampaign.status === CAMPAIGN_STATUS.ACTIVE
            ? expireActivateOrSwagCampaigns({ campaignIds: [currentCampaign.id] })
            : unExpireActivateOrSwagCampaigns({ campaignIds: [currentCampaign.id] }),
        );
      }
      if (currentCampaign.type === CAMPAIGN_TYPES.PROSPECTING) {
        dispatch(
          currentCampaign.status === CAMPAIGN_STATUS.ACTIVE
            ? expireProspectingCampaignById(currentCampaign.id)
            : unexpireProspectingCampaignById(currentCampaign.id),
        );
      }
    },
    [dispatch],
  );

  const onOpenGiftLinks = useCallback(
    currentCampaign => {
      history.push(ActivateCampaignRoutes.buildEditorUrl(currentCampaign.id, ActivateEditorStep.GiftLinks));
    },
    [history],
  );

  const menuItems = useMemo<IMenuItem<ICampaign>[]>(
    () => [
      {
        id: 'settings',
        text: 'Edit settings',
        action: onOpenCampaignSettings,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [
            CAMPAIGN_STATUS.ACTIVE,
            CAMPAIGN_STATUS.DISABLED,
            CAMPAIGN_STATUS.EXPIRED,
            CAMPAIGN_STATUS.DRAFT,
          ],
        }),
        dataTestid: `Campaign.Actions.Settings`,
      },
      {
        id: 'recipientExperience',
        text: 'Recipient Experience',
        action: onOpenRecipientExperience,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: true,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
        }),
        dataTestid: `Campaign.Actions.RecipientExperience`,
      },
      {
        id: 'duplicate',
        text: 'Duplicate',
        action: handleDuplicateCampaign,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: canCreateCampaign,
          implementedForTypes: [CAMPAIGN_TYPES.STANDARD, CAMPAIGN_TYPES.PROSPECTING, CAMPAIGN_TYPES.ACTIVATE],
          possibleForStatuses: [
            CAMPAIGN_STATUS.ACTIVE,
            CAMPAIGN_STATUS.DISABLED,
            CAMPAIGN_STATUS.EXPIRED,
            CAMPAIGN_STATUS.DRAFT,
          ],
        }),
        dataTestid: `Campaign.Actions.Duplicate`,
      },
      {
        id: 'archive',
        text: 'Archive',
        action: onOpenArchiveCampaignModal,
        ...getArchiveAvailabilityOptions({
          campaigns: [campaign],
          hasPermission: canEditCampaign,
        }),
        dataTestid: `Campaign.Actions.Archive`,
      },
      {
        id: 'expire',
        text: 'Expire',
        action: onSetCampaignExpired,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE],
        }),
        dataTestid: `Campaign.Actions.Expire`,
      },
      {
        id: 'unexpire',
        text: 'Unexpire',
        action: onSetCampaignExpired,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: canEditCampaign,
          implementedForTypes: Object.values(CAMPAIGN_TYPES),
          possibleForStatuses: [CAMPAIGN_STATUS.DISABLED, CAMPAIGN_STATUS.EXPIRED],
        }),
        dataTestid: `Campaign.Actions.Unexpire`,
      },
      {
        id: 'report',
        text: 'Export Gift Invitation Report',
        action: onOpenReportModal,
        dataTestid: `Campaign.Actions.Report`,
      },
      {
        id: 'giftLinks',
        text: 'Gift links',
        action: onOpenGiftLinks,
        ...getActionAvailabilityOptions({
          campaign,
          hasPermission: canEditCampaign,
          implementedForTypes: [CAMPAIGN_TYPES.ACTIVATE],
          possibleForTypes: [CAMPAIGN_TYPES.ACTIVATE],
          possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.EXPIRED],
        }),
        dataTestid: `Campaign.Actions.GiftLinks`,
      },
    ],
    [
      canCreateCampaign,
      canEditCampaign,
      onOpenCampaignSettings,
      onOpenRecipientExperience,
      handleDuplicateCampaign,
      onOpenReportModal,
      campaign,
      onOpenArchiveCampaignModal,
      onSetCampaignExpired,
      onOpenGiftLinks,
    ],
  );

  const handleDatesChange = useCallback(
    event => {
      dispatch(deleteAllGiftsFromTransferSelection());
      onFilterChange(event);
    },
    [dispatch, onFilterChange],
  );

  return (
    <Box className={classes.root}>
      <Box display="flex" alignItems="baseline" pl={7}>
        <Link to="/campaigns" data-testid="Campaign.BackToCampaignsList">
          <Icon color="grey.chambray50" icon="arrow-left" />
        </Link>
        <Box pl={2}>
          <Typography fontSize="24px" fontWeight="bold" color="primary.main">
            {campaign.name}
          </Typography>
          <Box display="flex" width={1}>
            <CampaignStatusLabel campaignStatus={campaign.status} />
            {hasEditor && (
              <Box fontSize={12} color="primary.main">
                &nbsp;-&nbsp;{campaignEditorLabel}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Box display="flex" pt={1}>
        <Box pr={2}>
          <DateRangeSelect
            disabled={isLoading}
            from={dateRangeFrom}
            to={dateRangeTo}
            onChange={handleDatesChange}
            dataTestId="Campaign.ChangeRangeSelect"
            label="Date range"
            className={classes.dateRange}
          />
        </Box>
        <Box pr={4}>
          <ActionsMenu<ICampaign>
            ActionButtonProps={{
              classes: { root: classes.actionButton },
              endIcon: <Icon icon="chevron-down" />,
              'data-testid': `Campaign.Actions`,
            }}
            menuItems={menuItems}
            menuData={campaign}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default memo(DashboardCampaignHeader);
