import { match, matchPath } from 'react-router-dom';

import { ICampaignBreakdownListItem } from '../store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../constants/campaignSettings.constants';
import { ActivateCampaignRoutes } from '../../ActivateModule/routePaths';
import { ProspectingCampaignRoutes } from '../../ProspectingCampaignModule/routePaths';
import { SwagCampaignRoutes } from '../../SwagCampaignModule/routePaths';
import {
  StandardCampaignEditorSubTabs,
  StandardCampaignEditorTabs,
  StandardCampaignRoutes,
} from '../../SettingsModule/components/StandardCampaignModule/routePaths';

export const getCampaignSettingsUrl = (
  campaign: ICampaignBreakdownListItem,
  { is1ToManyEnabled, isNewSwagEnabled }: { is1ToManyEnabled: boolean; isNewSwagEnabled: boolean },
): string => {
  const is1ToMany = is1ToManyEnabled && campaign.type === CAMPAIGN_TYPES.ACTIVATE;
  if (is1ToMany) {
    return campaign.status === CAMPAIGN_STATUS.DRAFT
      ? ActivateCampaignRoutes.buildBuilderUrl(campaign.id)
      : ActivateCampaignRoutes.buildEditorUrl(campaign.id);
  }

  if (campaign.type === CAMPAIGN_TYPES.PROSPECTING) {
    return campaign.status === CAMPAIGN_STATUS.DRAFT
      ? ProspectingCampaignRoutes.buildBuilderUrl(campaign.id)
      : ProspectingCampaignRoutes.buildEditorUrl(campaign.id);
  }

  if (isNewSwagEnabled && campaign.type === CAMPAIGN_TYPES.SWAG) {
    return campaign.status === CAMPAIGN_STATUS.DRAFT
      ? SwagCampaignRoutes.buildBuilderUrl(campaign.id)
      : StandardCampaignRoutes.buildEditorUrl(
          campaign.id,
          StandardCampaignEditorTabs.SettingsAndPermissions,
          StandardCampaignEditorSubTabs.General,
        );
  }

  return StandardCampaignRoutes.buildEditorUrl(
    campaign.id,
    StandardCampaignEditorTabs.SettingsAndPermissions,
    StandardCampaignEditorSubTabs.General,
  );
};

export const CAMPAIGN_ROUTES = {
  CAMPAIGNS_PATH: '/campaigns',
  matchAnyCampaignsPath(path: string): match<{}> | null {
    return matchPath(path, { path: this.CAMPAIGNS_PATH, exact: false });
  },
};

export const getActionAvailabilityOptions = ({
  campaign,
  hasPermission,
  prohibitedTooltip = 'You don’t have the right permissions',
  implementedForTypes,
  implementedForStatuses = Object.values(CAMPAIGN_STATUS),
  possibleForTypes = Object.values(CAMPAIGN_TYPES),
  possibleForStatuses = Object.values(CAMPAIGN_STATUS),
}: {
  campaign: { type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS };
  hasPermission: boolean;
  prohibitedTooltip?: string;
  implementedForTypes: CAMPAIGN_TYPES[];
  implementedForStatuses?: CAMPAIGN_STATUS[];
  possibleForTypes?: CAMPAIGN_TYPES[];
  possibleForStatuses?: CAMPAIGN_STATUS[];
}): { hidden: boolean; disabled: boolean; tooltip?: string } => {
  const implemented = implementedForTypes.includes(campaign.type) && implementedForStatuses.includes(campaign.status);
  const possible = possibleForTypes.includes(campaign.type) && possibleForStatuses.includes(campaign.status);

  let hidden = false;
  let disabled = false;
  let tooltip;
  if (!possible) {
    hidden = true;
    disabled = true;
  } else if (!implemented && hasPermission) {
    disabled = true;
    tooltip = 'Coming soon!';
  } else if (!hasPermission) {
    disabled = true;
    tooltip = prohibitedTooltip;
  }

  return {
    hidden,
    disabled,
    tooltip,
  };
};

export const getArchiveAvailabilityOptions = ({
  campaigns,
  hasPermission,
  tooltip,
}: {
  campaigns: { type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[];
  hasPermission: boolean;
  tooltip?: string;
}): { hidden: boolean; disabled: boolean; tooltip?: string } =>
  campaigns
    .map(campaign =>
      getActionAvailabilityOptions({
        campaign,
        hasPermission,
        implementedForTypes: [
          CAMPAIGN_TYPES.STANDARD,
          CAMPAIGN_TYPES.ACTIVATE,
          CAMPAIGN_TYPES.PROSPECTING,
          CAMPAIGN_TYPES.SWAG_PHYSICAL,
          CAMPAIGN_TYPES.SWAG_DIGITAL,
          CAMPAIGN_TYPES.SWAG,
        ],
        possibleForStatuses: [CAMPAIGN_STATUS.ACTIVE, CAMPAIGN_STATUS.DISABLED, CAMPAIGN_STATUS.EXPIRED],
      }),
    )
    .reduce(
      (acc, options) => ({
        hidden: acc.hidden || options.hidden,
        disabled: acc.disabled || options.disabled,
        tooltip: tooltip || options.tooltip,
      }),
      { hidden: false, disabled: false },
    );

export const getUnArchiveAvailabilityOptions = ({
  campaigns,
  hasPermission,
  tooltip,
}: {
  campaigns: { type: CAMPAIGN_TYPES; status: CAMPAIGN_STATUS }[];
  hasPermission: boolean;
  tooltip?: string;
}): { hidden: boolean; disabled: boolean; tooltip?: string } =>
  campaigns
    .map(campaign =>
      getActionAvailabilityOptions({
        campaign,
        hasPermission,
        implementedForTypes: [
          CAMPAIGN_TYPES.STANDARD,
          CAMPAIGN_TYPES.ACTIVATE,
          CAMPAIGN_TYPES.PROSPECTING,
          CAMPAIGN_TYPES.SWAG_PHYSICAL,
          CAMPAIGN_TYPES.SWAG_DIGITAL,
          CAMPAIGN_TYPES.SWAG,
        ],
        possibleForStatuses: [CAMPAIGN_STATUS.ARCHIVED],
      }),
    )
    .reduce(
      (acc, options) => ({
        hidden: acc.hidden || options.hidden,
        disabled: acc.disabled || options.disabled,
        tooltip: tooltip || options.tooltip,
      }),
      { hidden: false, disabled: false },
    );
