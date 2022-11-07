import { Epic } from 'redux-observable';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers, IResponse } from '@alycecom/services';

import { IBranding } from './branding.types';
import { loadBrandingRequest, loadBrandingSuccess, loadBrandingFail } from './branding.actions';

export const brandingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadBrandingRequest),
    switchMap(({ payload: { campaignId, showBranding = false } }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${campaignId}/branding-link`, null, true).pipe(
        map(({ data }: IResponse<IBranding>) => loadBrandingSuccess(data)),
        tap(({ payload }: { payload: IBranding }) => {
          if (showBranding) {
            window.open(payload.brandingLink, '_blank');
          }
        }),
        catchError(handleError(handlers.handleAnyError(loadBrandingFail))),
      ),
    ),
  );

export default [brandingEpic];
