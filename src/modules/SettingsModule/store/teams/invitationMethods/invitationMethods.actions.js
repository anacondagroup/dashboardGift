import { action } from '@alycecom/utils';

import {
  LOAD_TEAM_INVITATION_METHODS_SETTINGS,
  UPDATE_TEAM_INVITATION_METHODS_SETTINGS,
} from './invitationMethods.types';

export const giftInvitationMethodsLoadRequest = teamId => action(LOAD_TEAM_INVITATION_METHODS_SETTINGS.REQUEST, teamId);

export const giftInvitationMethodsLoadSuccess = methods =>
  action(LOAD_TEAM_INVITATION_METHODS_SETTINGS.SUCCESS, methods);

export const giftInvitationMethodsLoadFail = error => action(LOAD_TEAM_INVITATION_METHODS_SETTINGS.FAIL, error);

export const giftInvitationMethodsUpdateRequest = (teamId, restricted) =>
  action(UPDATE_TEAM_INVITATION_METHODS_SETTINGS.REQUEST, { teamId, restricted });

export const giftInvitationMethodsUpdateSuccess = () => action(UPDATE_TEAM_INVITATION_METHODS_SETTINGS.SUCCESS);

export const giftInvitationMethodsUpdateFail = error => action(UPDATE_TEAM_INVITATION_METHODS_SETTINGS.FAIL, error);
