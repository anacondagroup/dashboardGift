import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

import {
  LOAD_TEAM_INVITATION_METHODS_SETTINGS,
  UPDATE_TEAM_INVITATION_METHODS_SETTINGS,
} from './invitationMethods.types';
import {
  giftInvitationMethodsLoadSuccess,
  giftInvitationMethodsLoadFail,
  giftInvitationMethodsUpdateSuccess,
  giftInvitationMethodsUpdateFail,
  giftInvitationMethodsLoadRequest,
} from './invitationMethods.actions';

export const loadGiftInvitationMethodsSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler } },
) =>
  action$.pipe(
    ofType(LOAD_TEAM_INVITATION_METHODS_SETTINGS.REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${payload}/gift-inventory`).pipe(
        map(response => giftInvitationMethodsLoadSuccess(response.inventory)),
        catchError(error => of(giftInvitationMethodsLoadFail(error))),
        catchError(errorHandler({ callbacks: giftInvitationMethodsLoadFail })),
      ),
    ),
  );

export const saveGiftInvitationMethodsSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(UPDATE_TEAM_INVITATION_METHODS_SETTINGS.REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/teams/${payload.teamId}/gift-inventory`, {
          body: { restricted_invitation_type_ids: payload.restricted },
        })
        .pipe(
          mergeMap(() => [
            giftInvitationMethodsUpdateSuccess(payload.restricted),
            giftInvitationMethodsLoadRequest(payload.teamId),
            showGlobalMessage({ text: 'Changes saved', type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: giftInvitationMethodsUpdateFail, showErrorsAsGlobal: true })),
        ),
    ),
  );

export const teamGiftInvitationMethodsSettingsEpics = [
  loadGiftInvitationMethodsSettingsEpic,
  saveGiftInvitationMethodsSettingsEpic,
];
