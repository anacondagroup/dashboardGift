import { SixthSenseIntegrationField } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const sixthSenseCustomSegmentFieldCode = '6SenseCustom.segment.1';
export const sixthSenseCustomAlyceCampaignFieldCode = '6SenseCustom.alyceCampaign.1';
export const sixthSenseCustomStageFieldCode = '6SenseCustom.stage.1';
export const sixthSenseCustomTitleFieldCode = '6SenseCustom.title.1';

export const sixthSenseStandardSegmentFieldCode = '6SenseStandard.segment.1';
export const sixthSenseStandardAlyceCampaignFieldCode = '6SenseStandard.alyceCampaign.1';
export const sixthSenseStandardStageFieldCode = '6SenseStandard.stage.1';
export const sixthSenseStandardTitleFieldCode = '6SenseStandard.title.1';

export const standardObjectRecipe = {
  id:
    'production_abm_6sense_add_contacts_to_a_1_many_campaign_when_the_account_reaches_a_6sense_stage_standard_data_object',
  title: 'Trigger gifts based on 6Sense stage (standard object)',
  description:
    'This recipe adds contacts with the specified job title to a 1:Many Campaign when the associated account reaches a desired 6Sense stage.',
} as const;

export const customObjectRecipe = {
  id:
    'production_abm_6sense_add_contacts_to_a_1_many_campaign_when_the_account_reaches_a_6sense_stage_custom_data_object',
  title: 'Trigger gifts based on 6Sense stage (custom object)',
  description:
    'This recipe adds contacts with the specified job title to a 1:Many Campaign when the associated account reaches a desired 6Sense stage.',
} as const;

export const SixthSenseStandardObjectFieldsMap = {
  [SixthSenseIntegrationField.Segment]: sixthSenseStandardSegmentFieldCode,
  [SixthSenseIntegrationField.Stage]: sixthSenseStandardStageFieldCode,
  [SixthSenseIntegrationField.JobTitles]: sixthSenseStandardTitleFieldCode,
  [SixthSenseIntegrationField.Campaign]: sixthSenseStandardAlyceCampaignFieldCode,
};

export const SixthSenseCustomObjectFieldsMap = {
  [SixthSenseIntegrationField.Segment]: sixthSenseCustomSegmentFieldCode,
  [SixthSenseIntegrationField.Stage]: sixthSenseCustomStageFieldCode,
  [SixthSenseIntegrationField.JobTitles]: sixthSenseCustomTitleFieldCode,
  [SixthSenseIntegrationField.Campaign]: sixthSenseCustomAlyceCampaignFieldCode,
};
