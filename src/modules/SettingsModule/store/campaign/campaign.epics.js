import { campaignGeneralSettingsEpics } from './general/general.epics';
import { campaignGiftInvitesSettingsEpics } from './giftInvites/giftInvites.epics';
import { epics as templateEpics } from './template';
import { campaignGiftInvitationMethodsSettingsEpics } from './invitationMethods/invitationMethods.epics';
import { createCampaignSidebarEpics } from './createCampaignSidebar/createCampaignSidebar.epics';
import { swagSelectEpics } from './swagSelect/swagSelect.epics';
import { campaignSwagInvitesSettingsEpics } from './swagInvites/swagInvites.epics';
import { campaignLandingPageEpics } from './landingPage/landingPage.epics';
import { swagCodesSettingsEpics } from './swagBatches/swagBatches.epics';
import { swagDigitalCodesEpics } from './swagDigitalCodes/swagDigitalCodes.epics';
import { commonCampaignDataEpics } from './commonData/commonData.epics';
import { swagPhysicalGenerateCodesEpics } from './swagPhysicalCodes/swagPhysicalCodes.epics';
import teamMembersEpics from './teamMembers/teamMembers.epics';
import { campaignSettingsBatchOwnersEpics } from './batchOwners/batchOwners.epics';
import { brandingEpics } from './branding/branding.epics';
import createCampaignEpics from './createCampaign/createCampaign.epics';
import giftLimitsEpics from './giftLimits/giftLimits.epics';
import swagTeamAdmins from './swagTeamAdmins/swagTeamAdmins.epics';
import swagTeams from './swagTeams/swagTeams.epics';
import { purposesEpics } from './purposes/purposes.epics';

export const campaignSettingsEpics = [
  ...teamMembersEpics,
  ...campaignGeneralSettingsEpics,
  ...campaignGiftInvitesSettingsEpics,
  ...campaignGiftInvitationMethodsSettingsEpics,
  ...templateEpics,
  ...createCampaignSidebarEpics,
  ...swagSelectEpics,
  ...campaignSwagInvitesSettingsEpics,
  ...campaignLandingPageEpics,
  ...swagCodesSettingsEpics,
  ...swagDigitalCodesEpics,
  ...commonCampaignDataEpics,
  ...swagPhysicalGenerateCodesEpics,
  ...campaignSettingsBatchOwnersEpics,
  ...brandingEpics,
  ...createCampaignEpics,
  ...giftLimitsEpics,
  ...swagTeamAdmins,
  ...swagTeams,
  ...purposesEpics,
];
