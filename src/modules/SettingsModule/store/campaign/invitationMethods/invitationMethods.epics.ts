import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { handleError, handlers, IListResponse, showGlobalMessage, MessageType } from '@alycecom/services';
import { ofType } from '@alycecom/utils';

import {
  fetchGiftInvitationMethods,
  fetchGiftInvitationMethodsSuccess,
  fetchGiftInvitationMethodsFail,
  updateGiftInvitationMethods,
  updateGiftInvitationMethodsSuccess,
  updateGiftInvitationMethodsFail,
} from './invitationMethods.actions';
import { IGiftInvitationMethod } from './invitationMethods.types';

export const fetchGiftInvitationMethodsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchGiftInvitationMethods),
    switchMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload.campaignId}/get-allowed-gift-invitation-type`).pipe(
        map(({ data }: IListResponse<IGiftInvitationMethod>) => fetchGiftInvitationMethodsSuccess(data)),
        catchError(handleError(handlers.handleAnyError(fetchGiftInvitationMethodsFail))),
      ),
    ),
  );

export const updateGiftInvitationMethodsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateGiftInvitationMethods),
    switchMap(({ payload: { campaignId, restrictedMethodIds } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/gift-invitation-types`, {
          body: { campaign_id: campaignId, restricted_gift_invitation_type_ids: restrictedMethodIds },
        })
        .pipe(
          mergeMap(() => [
            updateGiftInvitationMethodsSuccess({ restrictedMethodIds }),
            showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateGiftInvitationMethodsFail))),
        ),
    ),
  );

export const campaignGiftInvitationMethodsSettingsEpics = [
  fetchGiftInvitationMethodsEpic,
  updateGiftInvitationMethodsEpic,
];
