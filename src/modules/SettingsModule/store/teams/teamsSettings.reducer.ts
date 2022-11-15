import { combineReducers } from 'redux';

import { reducer as customTemplatesReducer } from './customTemplates/customTemplates.reducer';
import { reducer as invitationMethodsReducer } from './invitationMethods/invitationMethods.reducer';
import { reducer as giftInvitesSettingsReducer } from './giftInvites/giftInvites.reducer';
import { TTeamsState, teams } from './teams/teams.reducer';
import { reducer as generalSettings, IGeneralSettingsState } from './generalSettings/generalSettings.reducer';
import brandingReducer, { IBrandingState } from './branding/branding.reducer';
import emailBrandingReducer, { IEmailBrandingState } from './emailBranding/emailBranding.reducer';
import managersReducer, { IManagersState } from './managers/managers.reducer';
import { TTeamOperationState, teamOperation } from './teamOperation/teamOperation.reducer';
import { TBudgetState, reducer as budgetReducer } from './budgets/budgets.reducer';
import { TTeamState, reducer as teamReducer } from './team/team.reducer';

// TODO Remove once all properties of teams settings state is defined
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ITeamsSettingsState {
  teams: TTeamsState;
  invitationMethods: any;
  giftInvites: any;
  customTemplates: any;
  generalSettings: IGeneralSettingsState;
  branding: IBrandingState;
  emailBranding: IEmailBrandingState;
  managers: IManagersState;
  teamOperation: TTeamOperationState;
  team: TTeamState;
  budgets: TBudgetState;
}

export const reducer = combineReducers<ITeamsSettingsState>({
  teams,
  invitationMethods: invitationMethodsReducer,
  giftInvites: giftInvitesSettingsReducer,
  customTemplates: customTemplatesReducer,
  generalSettings,
  branding: brandingReducer,
  emailBranding: emailBrandingReducer,
  managers: managersReducer,
  team: teamReducer,
  teamOperation,
  budgets: budgetReducer,
});
