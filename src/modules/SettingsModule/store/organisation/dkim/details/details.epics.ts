import { Epic } from 'redux-observable';
import { catchError, map, mergeMap, debounceTime, takeUntil } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';

import {
  loadDomainDetailsRequest,
  loadDomainDetailsSuccess,
  loadDomainDetailsFail,
  verifyRequest,
  verifySuccess,
  verifyFail,
  resetDomainDetails,
  sendEmailRequest,
  sendEmailSuccess,
  sendEmailFail,
  setSendEmailModalOpen,
} from './details.actions';
import { IDomainRecord } from './details.types';

export const loadDetailsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadDomainDetailsRequest),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService
        .get(
          `/enterprise/dashboard/settings/organisations/mail-sender-authentication/details?dkim_details_id=${payload}`,
        )
        .pipe(
          map(({ details }: { details: IDomainRecord[] }) => loadDomainDetailsSuccess(details)),
          catchError(errorHandler({ callbacks: loadDomainDetailsFail })),
          takeUntil(action$.pipe(ofType(loadDomainDetailsRequest))),
        ),
    ),
  );

export const verifyDetailsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(verifyRequest),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService
        .post('/enterprise/dashboard/settings/organisations/mail-sender-authentication/verify', {
          body: { dkim_details_id: payload.id },
        })
        .pipe(
          map(({ details }: { details: IDomainRecord[] }) => verifySuccess(details)),
          catchError(errorHandler({ callbacks: verifyFail })),
          takeUntil(action$.ofType(verifyRequest, resetDomainDetails)),
        ),
    ),
  );

export const sendEmailEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(sendEmailRequest),
    debounceTime(300),
    mergeMap(({ payload }) =>
      apiService
        .post('/enterprise/dashboard/settings/organisations/mail-sender-authentication/support-email', {
          body: { dkim_details_id: payload.id, email: payload.email },
        })
        .pipe(
          mergeMap(() => [
            sendEmailSuccess(),
            setSendEmailModalOpen(false),
            showGlobalMessage({ text: `Email has been successfully sent to ${payload.email}`, type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: sendEmailFail })),
          takeUntil(action$.pipe(ofType(sendEmailRequest))),
        ),
    ),
  );

export const detailsEpics = [loadDetailsEpic, verifyDetailsEpic, sendEmailEpic];
