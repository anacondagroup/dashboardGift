import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';
import { IRowDataItem } from '../../../../components/Shared/CustomTable/CustomTable.types';

export interface ICampaignListItem extends IRowDataItem {
  id: number;
  name: string;
  status: CAMPAIGN_STATUS;
  type: CAMPAIGN_TYPES;
  invitationTypes: string[] | null;
  canEdit: boolean;
  team: {
    id: number;
    name: string;
  };
  recipientActions: Record<string, boolean> | null;
  countryIds: number[];
}
