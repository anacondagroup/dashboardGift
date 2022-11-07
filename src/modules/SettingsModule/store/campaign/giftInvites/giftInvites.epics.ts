import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import { mapDescriptionToGiftTypes } from '../../../helpers/giftTypes.helpers';

import {
  campaignGiftInvitesSettingsLoadSuccess,
  campaignGiftInvitesSettingsLoadFail,
  campaignGiftUpdateBudgetSuccess,
  campaignGiftUpdateBudgetFail,
  campaignGiftUpdateRequiredActionsSuccess,
  campaignGiftUpdateRequiredActionsFail,
  campaignGiftUpdateExpirationSuccess,
  campaignGiftUpdateExpirationFail,
  campaignGiftUpdateRedirectSuccess,
  campaignGiftUpdateRedirectFail,
  campaignGiftUpdateVideoMessageSuccess,
  campaignGiftUpdateVideoMessageFail,
  loadCampaignVendorsSuccess,
  loadCampaignVendorsFail,
  saveCampaignVendorRestrictionsSuccess,
  saveCampaignVendorRestrictionsFail,
  loadCampaignTypesFail,
  loadCampaignTypesSuccess,
  saveCampaignTypeRestrictionsFail,
  saveCampaignTypeRestrictionsSuccess,
  campaignGiftInvitesSettingsLoadRequest,
  loadCampaignVendorsRequest,
  loadCampaignTypesRequest,
  campaignGiftUpdateBudgetRequest,
  saveCampaignVendorRestrictionsRequest,
  saveCampaignTypeRestrictionsRequest,
  campaignGiftUpdateRequiredActionsRequest,
  campaignGiftUpdateExpirationRequest,
  campaignGiftUpdateRedirectRequest,
  campaignGiftUpdateVideoMessageRequest,
  set1t1CampaignCustomMarketplaceId,
} from './giftInvites.actions';
import { IGiftInvitesResponse, ICampaignGiftVendorsResponse, ICampaignGiftTypesResponse } from './giftInvites.types';
import { getRestrictedGiftTypeIds } from './giftInvites.selectors';

export const loadCampaignGiftInvitesSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler } },
) =>
  action$.pipe(
    ofType(campaignGiftInvitesSettingsLoadRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${payload}/gift-invites`).pipe(
        map((response: IGiftInvitesResponse) => campaignGiftInvitesSettingsLoadSuccess(response.settings)),
        catchError(errorHandler({ callbacks: campaignGiftInvitesSettingsLoadFail })),
      ),
    ),
  );

export const loadCampaignVendorsEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadCampaignVendorsRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload}/vendors`).pipe(
        map((response: ICampaignGiftVendorsResponse) =>
          loadCampaignVendorsSuccess({
            vendors: response.vendors,
            availableProductsCount: response.available_products_amount,
          }),
        ),
        catchError(errorHandler({ callbacks: loadCampaignVendorsFail })),
      ),
    ),
  );

export const loadCampaignTypesEpic: Epic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(loadCampaignTypesRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload}/types`).pipe(
        map((response: ICampaignGiftTypesResponse) =>
          loadCampaignTypesSuccess(mapDescriptionToGiftTypes(response.types)),
        ),
        catchError(errorHandler({ callbacks: loadCampaignTypesFail })),
      ),
    ),
  );

export const saveCampaignBudgetSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(campaignGiftUpdateBudgetRequest),
    switchMap(({ payload }) => {
      const saveBudgetBody = {
        campaign_id: payload.campaignId,
        enterprise_min_price: payload.giftMinPrice,
        enterprise_max_price: payload.giftMaxPrice,
        enterprise_gift_card_price: payload.giftCardPrice,
        enterprise_donation_price: payload.giftDonationPrice,
      };
      return apiService.post(`/enterprise/dashboard/settings/campaigns/update/budget`, { body: saveBudgetBody }).pipe(
        mergeMap(() => [
          campaignGiftUpdateBudgetSuccess(payload),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignGiftUpdateBudgetFail })),
      );
    }),
  );

export const saveCampaignTypeRestrictionsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(saveCampaignTypeRestrictionsRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { campaignId } = payload;
      const restrictedProductTypeIds = getRestrictedGiftTypeIds(state);
      const body = {
        restricted_product_type_ids: restrictedProductTypeIds,
      };
      return apiService.post(`/enterprise/dashboard/campaigns/${campaignId}/types`, { body }).pipe(
        mergeMap((response: ICampaignGiftTypesResponse) => [
          saveCampaignTypeRestrictionsSuccess(mapDescriptionToGiftTypes(response.types)),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: saveCampaignTypeRestrictionsFail })),
      );
    }),
  );

export const saveCampaignVendorRestrictionsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(saveCampaignVendorRestrictionsRequest),
    switchMap(({ payload }) => {
      const { campaignId, restrictedBrandIds, restrictedMerchantIds } = payload;
      const body = {
        restricted_brand_ids: restrictedBrandIds,
        restricted_merchant_ids: restrictedMerchantIds,
      };
      return apiService.post(`/enterprise/dashboard/campaigns/${campaignId}/vendors`, { body }).pipe(
        mergeMap((response: ICampaignGiftVendorsResponse) => [
          saveCampaignVendorRestrictionsSuccess({
            vendors: response.vendors,
            availableProductsCount: response.available_products_amount,
          }),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: saveCampaignVendorRestrictionsFail })),
      );
    }),
  );

export const saveCampaignRequiredActionSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(campaignGiftUpdateRequiredActionsRequest),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/campaigns/update/required-actions`, { body: payload }).pipe(
        mergeMap(() => [
          campaignGiftUpdateRequiredActionsSuccess(payload),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignGiftUpdateRequiredActionsFail })),
      ),
    ),
  );

export const saveCampaignGiftExpirationSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(campaignGiftUpdateExpirationRequest),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/gift-expire-in-days`, {
          body: {
            campaign_id: payload.campaignId,
            gift_expire_in_days: payload.period,
          },
        })
        .pipe(
          mergeMap(() => [
            campaignGiftUpdateExpirationSuccess(payload),
            showGlobalMessage({ text: 'Changes saved', type: 'success' }),
          ]),
          catchError(errorHandler({ callbacks: campaignGiftUpdateExpirationFail })),
        ),
    ),
  );

export const saveCampaignGiftRedirectSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(campaignGiftUpdateRedirectRequest),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/campaigns/update/redirect-options`, { body: payload }).pipe(
        mergeMap(() => [
          campaignGiftUpdateRedirectSuccess(payload),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignGiftUpdateRedirectFail })),
      ),
    ),
  );
export const saveCampaignGiftVideoMessageSettingsEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(campaignGiftUpdateVideoMessageRequest),
    mergeMap(({ payload }) =>
      apiService.post(`/enterprise/dashboard/settings/campaigns/update/video-link`, { body: payload }).pipe(
        mergeMap(() => [
          campaignGiftUpdateVideoMessageSuccess(payload),
          showGlobalMessage({ text: 'Changes saved', type: 'success' }),
        ]),
        catchError(errorHandler({ callbacks: campaignGiftUpdateVideoMessageFail })),
      ),
    ),
  );

export const set1t1CampaignCustomMarketplaceIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(set1t1CampaignCustomMarketplaceId.pending),
    mergeMap(({ payload: { campaignId, customMarketplaceId } }) =>
      apiService
        .put(
          `/enterprise/dashboard/settings/campaigns/${campaignId}/custom-marketplace`,
          {
            body: {
              id: customMarketplaceId,
            },
          },
          true,
        )
        .pipe(
          mergeMap(() => [set1t1CampaignCustomMarketplaceId.fulfilled({ customMarketplaceId })]),
          catchError(handleError(handlers.handleAnyError(set1t1CampaignCustomMarketplaceId.rejected()))),
        ),
    ),
  );

export const campaignGiftInvitesSettingsEpics = [
  loadCampaignGiftInvitesSettingsEpic,
  loadCampaignVendorsEpic,
  saveCampaignVendorRestrictionsEpic,
  loadCampaignTypesEpic,
  saveCampaignTypeRestrictionsEpic,
  saveCampaignBudgetSettingsEpic,
  saveCampaignRequiredActionSettingsEpic,
  saveCampaignGiftExpirationSettingsEpic,
  saveCampaignGiftRedirectSettingsEpic,
  saveCampaignGiftVideoMessageSettingsEpic,
  set1t1CampaignCustomMarketplaceIdEpic,
];
