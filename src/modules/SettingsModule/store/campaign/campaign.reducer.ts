import { combineReducers } from 'redux';

import { ITeamMembersState, teamMembers } from './teamMembers/teamMembers.reducer';
import { IBatchOwnersState, reducer as batchOwners } from './batchOwners/batchOwners.reducer';
import { IGeneralCampaignSettingsState, general } from './general/general.reducer';
import {
  ISettingsGiftInvitesState,
  reducer as campaignGiftInvitesSettingsReducer,
} from './giftInvites/giftInvites.reducer';
import { invitationMethods } from './invitationMethods/invitationMethods.reducer';
import { ITemplateState, reducer as templateReducer } from './template/template.reducer';
import { reducer as swagSelectReducer } from './swagSelect/swagSelect.reducer';
import { reducer as createCampaignSidebarReducer } from './createCampaignSidebar/createCampaignSidebar.reducer';
import { reducer as swagInvitesReducer } from './swagInvites/swagInvites.reducer';
import { reducer as swagCodesReducer } from './swagBatches/swagBatches.reducer';
import { reducer as swagDigitalCodesReducer } from './swagDigitalCodes/swagDigitalCodes.reducer';
import { reducer as swagPhysicalCodesReducer } from './swagPhysicalCodes/swagPhysicalCodes.reducer';
import { reducer as landingPageReducer } from './landingPage/landingPage.reducer';
import { reducer as commonDataReducer } from './commonData/commonData.reducer';
import brandingReducer, { IBrandingState } from './branding/branding.reducer';
import createCampaign, { ICreateCampaignState } from './createCampaign/createCampaign.reducer';
import giftLimits, { IGiftLimitsState } from './giftLimits/giftLimits.reducer';
import swagTeamAdmins, { ISwagTeamAdminsState } from './swagTeamAdmins/swagTeamAdmins.reducer';
import swagTeams, { ISwagTeamsState } from './swagTeams/swagTeams.reducer';
import { purposes, IPurposesState } from './purposes/purposes.reducer';

// TODO Remove once all properties of campaign state is defined
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISettingsCampaignState {
  teamMembers: ITeamMembersState;
  batchOwners: IBatchOwnersState;
  commonData: any;
  general: IGeneralCampaignSettingsState;
  giftInvites: ISettingsGiftInvitesState;
  invitationMethods: any;
  template: ITemplateState;
  swagSelect: any;
  createCampaignSidebar: any;
  swagInvites: any;
  swagBatches: any;
  landingPage: any;
  swagDigitalCodes: any;
  swagPhysicalCodes: any;
  branding: IBrandingState;
  createCampaign: ICreateCampaignState;
  giftLimits: IGiftLimitsState;
  swagTeamAdmins: ISwagTeamAdminsState;
  swagTeams: ISwagTeamsState;
  purposes: IPurposesState;
}

export default combineReducers<ISettingsCampaignState>({
  teamMembers,
  batchOwners,
  commonData: commonDataReducer,
  general,
  giftInvites: campaignGiftInvitesSettingsReducer,
  invitationMethods,
  template: templateReducer,
  swagSelect: swagSelectReducer,
  createCampaignSidebar: createCampaignSidebarReducer,
  swagInvites: swagInvitesReducer,
  swagBatches: swagCodesReducer,
  landingPage: landingPageReducer,
  swagDigitalCodes: swagDigitalCodesReducer,
  swagPhysicalCodes: swagPhysicalCodesReducer,
  branding: brandingReducer,
  createCampaign,
  giftLimits,
  swagTeamAdmins,
  swagTeams,
  purposes,
});
