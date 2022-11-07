import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import {
  loadDomainsRequest,
  loadDomainsSuccess,
  loadDomainsFail,
  addDomainRequest,
  addDomainSuccess,
  addDomainFail,
  removeDomainRequest,
  removeDomainSuccess,
  removeDomainFail,
} from './domains.actions';
import { IDomain } from './domains.types';

export const loadDomainsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadDomainsRequest),
    debounceTime(300),
    mergeMap(() =>
      apiService.get('/enterprise/dashboard/settings/organisations/mail-sender-authentication/domains').pipe(
        map(({ domains }: { domains: IDomain[] }) => loadDomainsSuccess(domains)),
        catchError(errorHandler({ callbacks: loadDomainsFail })),
        takeUntil(action$.pipe(ofType(loadDomainsRequest))),
      ),
    ),
  );

export const addDomainEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(addDomainRequest),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService
        .post('/enterprise/dashboard/settings/organisations/mail-sender-authentication/add-domain', {
          body: { domain: payload },
        })
        .pipe(
          mergeMap(({ domain }) => [
            addDomainSuccess(domain),
            showGlobalMessage({ text: `DKIM created for ${domain.domain}`, type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: addDomainFail })),
          takeUntil(action$.pipe(ofType(addDomainRequest))),
        ),
    ),
  );

export const removeDomainEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(removeDomainRequest),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService
        .post('/enterprise/dashboard/settings/organisations/mail-sender-authentication/remove-domain', {
          body: { dkim_details_id: payload.id },
        })
        .pipe(
          mergeMap(() => [
            removeDomainSuccess(payload.id),
            showGlobalMessage({ text: `DKIM was removed for ${payload.domain}`, type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: removeDomainFail })),
          takeUntil(action$.pipe(ofType(removeDomainRequest))),
        ),
    ),
  );

export const domainsEpics = [loadDomainsEpic, addDomainEpic, removeDomainEpic];
