import { SalesforceIntegrationField } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const memberStatusFieldCode = 'SalesforceAdd.campaignMemberStatus.1';

export const salesforceDynamicRecipeConfig = {
  id: 'production_crm_salesforce_add_campaign_members_to_1_many_campaigns_based_on_campaign_member_status',
  title: 'Trigger gifts based on Salesforce campaign member status',
  description:
    'This recipe adds Salesforce campaign members to a 1:Many Campaign when they reach a desired Salesforce campaign member status.',
} as const;

export const SalesforceFieldsMap = {
  [SalesforceIntegrationField.MemberStatus]: memberStatusFieldCode,
};
