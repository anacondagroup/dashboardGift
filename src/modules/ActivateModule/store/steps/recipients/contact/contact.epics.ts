import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';
import { handlers } from '@alycecom/services';
import { ofType } from '@alycecom/utils';

import { loadContactsRequest, resetStatusMetaData } from '../contacts';
import { IContact } from '../contacts/contacts.types';

import { saveContactFail, saveContactRequest, saveContactSuccess } from './contact.actions';

const loadContactsEpic: Epic = (action$, _, { apiService }) =>
  action$.pipe(
    ofType(saveContactRequest),
    switchMap(({ payload: { campaignId, contact } }) =>
      apiService.post(`/api/v1/campaigns/activate/campaigns/${campaignId}/contacts`, { body: contact }, true).pipe(
        mergeMap(({ data }: { data: IContact }) => [
          saveContactSuccess(data),
          resetStatusMetaData(),
          loadContactsRequest({ campaignId, reset: true }),
        ]),
        catchError(apiService.handleError(handlers.handleAnyError(saveContactFail))),
      ),
    ),
  );

export const contactEpics = [loadContactsEpic];
