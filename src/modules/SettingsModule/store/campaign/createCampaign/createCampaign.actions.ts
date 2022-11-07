import { createAction } from 'redux-act';
import { TLegacyErrors } from '@alycecom/services';

import { TNumberOfRecipientsOption, TPurposeOption } from '../purposes/purposes.types';

const PREFIX = 'SETTINGS/CAMPAIGN';

export const createCampaignRequest = createAction<{
  team: number;
  teamOwner: number;
  campaignName: string;
  teamMemberIds: number[];
  countryIds: number[];
  purpose: TPurposeOption;
  numberOfRecipients: TNumberOfRecipientsOption;
}>(`${PREFIX}/CREATE_CAMPAIGN_REQUEST`);
export const createCampaignSuccess = createAction(`${PREFIX}/CREATE_CAMPAIGN_SUCCESS`);
export const createCampaignFail = createAction<TLegacyErrors>(`${PREFIX}/CREATE_CAMPAIGN_FAIL`);

export const resetErrors = createAction(`${PREFIX}/CREATE_CAMPAIGN_RESET_ERRORS`);
