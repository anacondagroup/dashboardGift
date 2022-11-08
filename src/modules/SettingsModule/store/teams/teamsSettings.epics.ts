import { giftInvitesEpics } from './giftInvites/giftInvites.epics';
import { teamGiftInvitationMethodsSettingsEpics } from './invitationMethods/invitationMethods.epics';
import generalSettingsEpics from './generalSettings/generalSettings.epics';
import { teamsEpics } from './teams/teams.epics';
import { brandingEpics } from './branding/branding.epics';
import { emailBrandingEpics } from './emailBranding/emailBranding.epics';
import { managersEpics } from './managers/managers.epics';
import { teamOperationEpics } from './teamOperation/teamOperation.epics';
import { budgetEpics } from './budgets/budgets.epics';
import { budgetCreateEpics } from './budgetCreate/budgetCreate.epics';
import { teamEpics } from './team/team.epics';

export const teamSettingsEpics = [
  ...teamGiftInvitationMethodsSettingsEpics,
  ...giftInvitesEpics,
  ...generalSettingsEpics,
  ...teamsEpics,
  ...brandingEpics,
  ...emailBrandingEpics,
  ...managersEpics,
  ...teamOperationEpics,
  ...budgetEpics,
  ...budgetCreateEpics,
  ...teamEpics,
];