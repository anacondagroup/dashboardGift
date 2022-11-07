export interface IGeneralSettingsChange {
  blockReminders: boolean;
  complianceIsRequired: boolean;
  complianceLink: null;
  compliancePromptText: null;
  complianceRevertText: null;
  countryId: number;
  giftExpireInDays: number;
  nameUsageInEmails: string;
  outerUnsubscribeUrl: string | null;
  requireEmailIntegration: string;
  teamName: string;
  teamOwnerName: string;
}
