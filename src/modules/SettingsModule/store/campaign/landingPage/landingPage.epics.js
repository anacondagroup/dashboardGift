import { ofType } from 'redux-observable';
import { catchError, mergeMap } from 'rxjs/operators';

import {
  campaignSwagLandingPageMessageLoadSuccess,
  campaignSwagLandingPageMessageLoadFail,
  updateCampaignLandingPageMessageFail,
  updateCampaignLandingPageMessageSuccess,
} from './landingPage.actions';
import { UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE, LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE } from './landingPage.types';

export const fetchCampaignLandingPageSettings = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(LOAD_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${payload}/landing-page`).pipe(
        mergeMap(response => [campaignSwagLandingPageMessageLoadSuccess(response.settings)]),
        catchError(errorHandler({ callbacks: campaignSwagLandingPageMessageLoadFail })),
      ),
    ),
  );

export const updateCampaignLandingPageSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(UPDATE_CAMPAIGN_LANDING_PAGE_MESSAGE.REQUEST),
    mergeMap(({ payload: { campaignId, message, header } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/landing-page`, {
          body: { message, header, campaign_id: campaignId },
        })
        .pipe(
          mergeMap(() => [
            updateCampaignLandingPageMessageSuccess(),
            showGlobalMessage({ text: 'Changes saved', type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: updateCampaignLandingPageMessageFail })),
        ),
    ),
  );

export const campaignLandingPageEpics = [fetchCampaignLandingPageSettings, updateCampaignLandingPageSettingsEpic];
