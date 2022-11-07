import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, debounce, takeUntil, filter, withLatestFrom } from 'rxjs/operators/index';
import { of, timer } from 'rxjs';
import qs from 'query-string';

import { getContactsIsLoading } from '../contacts/contacts.selectors';

import { CONTACTS_AVATARS_LOAD_REQUEST } from './contactsAvatars.types';
import { contactsAvatarsLoadSuccess, contactsAvatarsLoadFail } from './contactsAvatars.actions';

export const loadContactsAvatarsEpic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(CONTACTS_AVATARS_LOAD_REQUEST),
    debounce(() => timer(300)),
    withLatestFrom(state$),
    filter(([action, state]) => !!action.payload.length && !getContactsIsLoading(state)),
    mergeMap(([action]) =>
      apiService
        .get(`/enterprise/contact/images?${qs.stringify({ user_ids: action.payload }, { arrayFormat: 'bracket' })}`)
        .pipe(
          map(response => contactsAvatarsLoadSuccess(response.images)),
          catchError(response => of(contactsAvatarsLoadFail(response))),
          takeUntil(action$.ofType(CONTACTS_AVATARS_LOAD_REQUEST)),
        ),
    ),
  );

export const contactsAvatarsEpic = [loadContactsAvatarsEpic];
