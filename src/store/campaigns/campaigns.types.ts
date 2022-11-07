import { GiftExchangeOptions } from '../../modules/ActivateModule/constants/exchange.constants';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../constants/campaignSettings.constants';
import { TCampaignEditor } from '../../modules/DashboardModule/store/breakdowns/campaignsManagement/campaignsBreakdown/campaignsBreakdown.types';

export interface ICampaign {
  // eslint-disable-next-line camelcase
  can_edit: boolean;
  // eslint-disable-next-line camelcase
  team_id: number;
  id: number;
  name: string;
  type: CAMPAIGN_TYPES;
  status: CAMPAIGN_STATUS;
  giftExchangeOption: GiftExchangeOptions;
  createdBy: TCampaignEditor | null;
  updatedBy: TCampaignEditor | null;
}
