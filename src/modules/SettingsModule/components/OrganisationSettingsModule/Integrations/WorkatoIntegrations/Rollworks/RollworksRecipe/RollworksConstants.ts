import { RollworksIntegrationField } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const rollworksSFAccountFieldCode = 'RollworksSalesforce.accountList.1';
export const rollworksSFAlyceCampaignFieldCode = 'RollworksSalesforce.alyceCampaign.1';
export const rollworksSFJourneyStageFieldCode = 'RollworksSalesforce.stage.1';
export const rollworksSFJobTitleFieldCode = 'RollworksSalesforce.title.1';

export const rollworksHSAccountFieldCode = 'RollworksHubSpot.accountList.1';
export const rollworksHSAlyceCampaignFieldCode = 'RollworksHubSpot.alyceCampaign.1';
export const rollworksHSJourneyStageFieldCode = 'RollworksHubSpot.stage.1';
export const rollworksHSJobTitleFieldCode = 'RollworksHubSpot.title.1';

export const rollworksViaSalesforceRecipe = {
  id: 'production_abm_rollworks_add_contacts_to_a_1_many_campaign_when_the_account_reaches_a_rollworks_journey_stage',
  title: 'Trigger gifts based on RollWorks journey stage (via Salesforce)',
  description:
    'This recipe adds contacts with the specified job title to a 1:Many Campaign when the associated account reaches a desired RollWorks stage.',
} as const;

export const rollworksViaHubSpotRecipe = {
  id:
    'production_abm_rollworks_add_contacts_to_a_1_many_campaign_when_the_account_reaches_a_rollworks_journey_stage_hubspot',
  title: 'Trigger gifts based on RollWorks journey stage (via HubSpot)',
  description:
    'This recipe adds contacts with the specified job title to a 1:Many Campaign when the associated account reaches a desired RollWorks stage.',
} as const;

export const RollworksSFFieldsMap = {
  [RollworksIntegrationField.Account]: rollworksSFAccountFieldCode,
  [RollworksIntegrationField.JourneyStage]: rollworksSFJourneyStageFieldCode,
  [RollworksIntegrationField.JobTitle]: rollworksSFJobTitleFieldCode,
  [RollworksIntegrationField.Campaign]: rollworksSFAlyceCampaignFieldCode,
};

export const RollworksHSFieldsMap = {
  [RollworksIntegrationField.Account]: rollworksHSAccountFieldCode,
  [RollworksIntegrationField.JourneyStage]: rollworksHSJourneyStageFieldCode,
  [RollworksIntegrationField.JobTitle]: rollworksHSJobTitleFieldCode,
  [RollworksIntegrationField.Campaign]: rollworksHSAlyceCampaignFieldCode,
};
