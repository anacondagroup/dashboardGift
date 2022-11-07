import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, mapTo } from 'rxjs/operators';
import { of } from 'rxjs';
import { CreateGift } from '@alycecom/modules';

import { updateGiftLimitsSuccess } from '../../../modules/SettingsModule/store/campaign/giftLimits/giftLimits.actions';

import { INVITATIONS_AMOUNT } from './invitations.types';
import { getInvitations, getInvitationsFailed, getInvitationsSuccess } from './invitations.actions';
import { getInvitationParams } from './invitations.helpers';

export const getInvitationsEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(INVITATIONS_AMOUNT.REQUEST, CreateGift.actionTypes.GIFT_CREATE_SEND_SUCCESS),
    mergeMap(() => {
      const { context, id } = getInvitationParams();
      const invitationsContext = context && id ? `/${context}/${id}` : '';

      return apiService.get(`/enterprise/gift-create/invitations${invitationsContext}`).pipe(
        map(response => getInvitationsSuccess(response.amount)),
        catchError(() => of(getInvitationsFailed())),
      );
    }),
  );

export const refreshInvitationsOnLimitsUpdate = action$ =>
  action$.pipe(ofType(updateGiftLimitsSuccess), mapTo(getInvitations()));

export const invitationsEpics = [getInvitationsEpic];
