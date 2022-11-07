import { Epic } from 'redux-observable';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';
import { stringify } from 'query-string';

import { IBrandingSettings } from '../emailBranding.types';

import { loadEmailPreviewRequest, loadEmailPreviewSuccess, loadEmailPreviewFail } from './emailPreview.actions';

const getEncodedPreviewParams = (params: Partial<IBrandingSettings>): string =>
  stringify({ emailTypeId: 'initial_email_sender_to_recipient', ...params });

export const loadEmailPreviewEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadEmailPreviewRequest),
    debounceTime(300),
    switchMap(({ payload: { teamId, params } }) =>
      apiService
        .get(`/api/v1/email-branding/teams/${teamId}/preview?${getEncodedPreviewParams(params)}`, null, true)
        .pipe(
          map((payload: { data: { emailContent: string } }) => loadEmailPreviewSuccess(payload.data.emailContent)),
          catchError(handleError(handlers.handleAnyError(loadEmailPreviewFail))),
        ),
    ),
  );

export const emailPreviewEpics = [loadEmailPreviewEpic];
