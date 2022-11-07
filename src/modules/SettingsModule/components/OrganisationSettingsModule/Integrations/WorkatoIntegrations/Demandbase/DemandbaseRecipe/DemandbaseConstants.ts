import { DemandbaseIntegrationField } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const demandbaseStageFieldCode = 'DemandbaseStage.stage.1';
export const demandbaseAlyceCampaignFieldCode = 'DemandbaseStage.alyceCampaign.1';
export const demandbaseMinutesFieldCode = 'DemandbaseStage.engagementMinutes.1';
export const demandbaseTitleFieldCode = 'DemandbaseStage.title.1';

export const demandbaseRecipe = {
  id: 'production_abm_demandbase_add_contacts_to_a_1_many_campaign_when_the_account_reaches_a_demandbase_stage',
  title: 'Trigger gifts based on Demandbase engagement score',
  description:
    'This recipe adds contacts with the specified job title to a 1:Many Campaign when the associated account reaches a desired Demandbase engagement level.',
} as const;

export const DemandbaseFieldsMap = {
  [DemandbaseIntegrationField.Stage]: demandbaseStageFieldCode,
  [DemandbaseIntegrationField.Minutes]: demandbaseMinutesFieldCode,
  [DemandbaseIntegrationField.JobTitles]: demandbaseTitleFieldCode,
  [DemandbaseIntegrationField.Campaign]: demandbaseAlyceCampaignFieldCode,
};
