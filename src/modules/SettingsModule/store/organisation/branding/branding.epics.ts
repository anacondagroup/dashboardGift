import { Epic } from 'redux-observable';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';

import { IBrandingResponse } from './branding.types';
import { loadBrandingRequest, loadBrandingSuccess, loadBrandingFail } from './branding.actions';

export const brandingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadBrandingRequest),
    switchMap(({ payload: { showBranding = false } = {} }) =>
      apiService.get(`/enterprise/dashboard/settings/organisations/branding-link`, null, true).pipe(
        map(({ data }: { data: IBrandingResponse }) => loadBrandingSuccess(data)),
        tap(({ payload }: { payload: IBrandingResponse }) => {
          if (showBranding) {
            window.open(payload.brandingLink, '_blank');
          }
        }),
        catchError(handleError(handlers.handleAnyError(loadBrandingFail))),
      ),
    ),
  );

export const brandingEpics = [brandingEpic];
