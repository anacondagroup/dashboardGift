import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import {
  LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS,
  UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS,
  LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES,
  UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES,
} from './swagInvites.types';
import {
  campaignSwagInvitesSettingsLoadSuccess,
  campaignSwagInvitesSettingsLoadRequest,
  campaignSwagInvitesSettingsLoadFail,
  campaignSwagUpdateBudgetSuccess,
  campaignSwagUpdateBudgetFail,
  campaignGiftUpdateRequiredActionsSuccess,
  campaignGiftUpdateRequiredActionsFail,
  loadCampaignSwagProductTypesSuccess,
  loadCampaignSwagProductTypesFail,
  loadCampaignSwagProductTypesRequest,
  updateCampaignSwagProductTypesSuccess,
  updateCampaignSwagProductTypesFail,
} from './swagInvites.actions';

export const loadCampaignSwagInvitesSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler } },
) =>
  action$.pipe(
    ofType(LOAD_CAMPAIGN_SWAG_INVITES_SETTINGS.REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${payload}/gift-invites`).pipe(
        map(response => campaignSwagInvitesSettingsLoadSuccess({ settings: response.settings })),
        catchError(errorHandler({ callbacks: campaignSwagInvitesSettingsLoadFail })),
      ),
    ),
  );

export const saveCampaignBudgetSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(UPDATE_SWAG_CAMPAIGN_BUDGET_SETTINGS.REQUEST),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/campaigns/update/budget`, { body: payload }).pipe(
        mergeMap(() => [
          campaignSwagUpdateBudgetSuccess({ budget: payload }),
          campaignSwagInvitesSettingsLoadRequest(payload.campaign_id),
          loadCampaignSwagProductTypesRequest(payload.campaign_id),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignSwagUpdateBudgetFail })),
      ),
    ),
  );

export const saveCampaignRequiredActionSettingsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(UPDATE_SWAG_CAMPAIGN_REQUIRED_ACTIONS_SETTINGS.REQUEST),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/campaigns/update/required-actions`, { body: payload }).pipe(
        mergeMap(() => [
          campaignGiftUpdateRequiredActionsSuccess({ actions: payload }),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignGiftUpdateRequiredActionsFail })),
      ),
    ),
  );

export const fetchSwagProductTypes = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(LOAD_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/swag/campaign/${payload}/marketplace`).pipe(
        mergeMap(response => [loadCampaignSwagProductTypesSuccess(response)]),
        catchError(errorHandler({ callbacks: loadCampaignSwagProductTypesFail })),
      ),
    ),
  );

export const saveCampaignProductTypesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(UPDATE_SWAG_CAMPAIGN_PRODUCT_TYPES.REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/swag/campaign/${payload.campaignId}/update-marketplace-settings`, { body: payload })
        .pipe(
          mergeMap(() => [
            updateCampaignSwagProductTypesSuccess(payload.restrictedProductIds),
            showGlobalMessage({ text: 'Changes saved', type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: updateCampaignSwagProductTypesFail, showErrorsAsGlobal: true })),
        ),
    ),
  );

export const campaignSwagInvitesSettingsEpics = [
  loadCampaignSwagInvitesSettingsEpic,
  saveCampaignBudgetSettingsEpic,
  saveCampaignRequiredActionSettingsEpic,
  fetchSwagProductTypes,
  saveCampaignProductTypesEpic,
];
