import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, debounce } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';
import { ContactDetails, updateSearch } from '@alycecom/modules';
import { push } from 'connected-react-router';

import { PROFILE_LOAD_REQUEST } from './profile.types';
import { profileLoadSuccess, profileLoadFail } from './profile.actions';

export const loadProfileEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(PROFILE_LOAD_REQUEST),
    debounce(() => timer(300)),
    mergeMap(({ payload: { contactId, giftId } }) =>
      (giftId
        ? apiService.get(`/enterprise/gifts/${giftId}/contact-info`, {}, true)
        : apiService.get(`/enterprise/contact/${contactId}/info`, {}, true)
      ).pipe(
        map(response => profileLoadSuccess(response.data)),
        catchError(error => of(profileLoadFail(error))),
      ),
    ),
  );

export const needMoreInfoSuccessEpic = (action$, state$) =>
  action$.pipe(
    ofType(ContactDetails.actionTypes.SEND_MORE_INFO_SUCCESS),
    mergeMap(({ payload }) => [
      push({
        pathname: state$.value.router.location.pathname,
        search: updateSearch(state$.value.router.location.search, { sidebar_tab: 'send-gift', gift_id: payload }),
      }),
    ]),
  );

export const profileEpics = [loadProfileEpic, needMoreInfoSuccessEpic];
