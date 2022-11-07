import { Epic } from 'redux-observable';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { IEmailBrandingResponse } from './emailBranding.types';
import { loadEmailBrandingRequest, loadEmailBrandingSuccess, loadEmailBrandingFail } from './emailBranding.actions';

export const brandingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadEmailBrandingRequest),
    switchMap(({ payload: { teamId } }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${teamId}/email-branding`, null, true).pipe(
        map(({ data }: { data: IEmailBrandingResponse }) => loadEmailBrandingSuccess(data)),
        catchError(handleError(handlers.handleAnyError(loadEmailBrandingFail))),
      ),
    ),
  );

export const emailBrandingEpics = [brandingEpic];
