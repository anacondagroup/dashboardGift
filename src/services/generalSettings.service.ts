import { IApiService } from '@alycecom/services';
import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import { GiftResearchFlowType } from '@alycecom/modules';

export interface IGeneralSettingsService {
  setCampaignProposalSetting: (campaignId: number, setting: GiftResearchFlowType) => Observable<AjaxResponse>;
  setCampaignAvailabilitySetting: (campaignId: number, isDisabled: boolean) => Observable<AjaxResponse>;
}

export const createGeneralSettingsService = (apiService: IApiService): IGeneralSettingsService => ({
  setCampaignProposalSetting: (campaignId, setting) =>
    apiService.post(
      `/enterprise/dashboard/campaigns/${campaignId}/research_flow`,
      {
        body: {
          research_flow: setting,
        },
      },
      false,
    ),
  setCampaignAvailabilitySetting: (campaignId, isDisabled) =>
    apiService.post(
      `/enterprise/dashboard/settings/campaigns/update/availability`,
      {
        body: {
          campaign_id: campaignId,
          availability: !isDisabled,
        },
      },
      false,
    ),
});
