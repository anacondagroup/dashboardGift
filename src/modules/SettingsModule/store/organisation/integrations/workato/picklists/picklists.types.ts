export enum Picklists {
  GetConversationPicklist = 'get_conversation_picklist',
  GiftEvents = 'gift_events',
  CampaignMemberStatus = 'campaignMember_Status',
}

export enum SlackIntegrationField {
  Channel = 'channel',
  GiftStatus = 'giftStatus',
}

export enum SixthSenseIntegrationField {
  Segment = 'segment',
  Stage = 'stage',
  JobTitles = 'jobTitles',
  Campaign = 'campaign',
}

export enum DemandbaseIntegrationField {
  Stage = 'stage',
  Minutes = 'minutes',
  JobTitles = 'jobTitles',
  Campaign = 'campaign',
}

export enum SalesforceIntegrationField {
  MemberStatus = 'memberStatus',
}

export enum RollworksIntegrationField {
  Account = 'account',
  JourneyStage = 'journeyStage',
  JobTitle = 'jobTitle',
  Campaign = 'campaign',
}

export type TSlackConfigurationForm = {
  [SlackIntegrationField.Channel]: string;
  [SlackIntegrationField.GiftStatus]: string;
};

export type TSixthSenseConfigurationForm = {
  [SixthSenseIntegrationField.Segment]: string;
  [SixthSenseIntegrationField.Stage]: string;
  [SixthSenseIntegrationField.JobTitles]: string;
  [SixthSenseIntegrationField.Campaign]: string;
};

export type TDemandbaseConfigurationForm = {
  [DemandbaseIntegrationField.Stage]: string;
  [DemandbaseIntegrationField.Minutes]: number;
  [DemandbaseIntegrationField.JobTitles]: string;
  [DemandbaseIntegrationField.Campaign]: string;
};

export type TSalesforceConfigurationForm = {
  [SalesforceIntegrationField.MemberStatus]: string;
};

export type TRollworksConfigurationForm = {
  [RollworksIntegrationField.Account]: string;
  [RollworksIntegrationField.JourneyStage]: string;
  [RollworksIntegrationField.JobTitle]: string;
  [RollworksIntegrationField.Campaign]: string;
};
