import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';

import { getCampaignName } from '../details';
import { closeMarketplaceSettingsSidebar } from '../../ui/createPage/marketplaceSettingsSidebar';
import { getActivateModuleParams } from '../../activate.selectors';
import { ActivateModes } from '../../../routePaths';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';
import { fetchProductsCount } from '../../productsCount/productsCount.actions';
import { goToNextStep } from '../../ui/activeStep/activeStep.actions';

import {
  updateAcceptOnlyDonationSetting,
  updateAcceptOnlyDonationSettingFail,
  updateAcceptOnlyDonationSettingSuccess,
  updateAcceptOnlyFallbackGift,
  updateAcceptOnlyFallbackGiftSuccess,
  updateCustomMarketplaceSetting,
  updateCustomMarketplaceSettingFail,
  updateCustomMarketplaceSettingSuccess,
  updateDefaultGiftFail,
  updateDefaultGiftRequest,
  updateDefaultGiftSuccess,
  updateGiftExchangeOptionsFail,
  updateGiftExchangeOptionsRequest,
  updateGiftExchangeOptionsSuccess,
  updateGiftStepFail,
  updateGiftStepRequest,
  updateGiftStepSuccess,
  updateMarketplaceSettingsFail,
  updateMarketplaceSettingsRequest,
  updateMarketplaceSettingsSuccess,
} from './gift.actions';
import { IUpdateGiftExchangeOptions } from './gift.types';

const updateMarketplaceEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateMarketplaceSettingsRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const campaignName = getCampaignName(state);
      const { campaignId, mode } = getActivateModuleParams(state);

      const updateGiftExchangeOptions = () => {
        const body: IUpdateGiftExchangeOptions = {
          giftExchangeOption: GiftExchangeOptions.campaignBudget,
          exchangeMarketplaceSettings: payload,
          customMarketplace: null,
          donationSettings: null,
          fallbackGift: null,
        };
        return apiService.put(`/api/v1/campaigns/activate/campaigns/${campaignId}/gift-exchange`, { body }, true);
      };

      const updateBudgetSettings = () =>
        apiService.put(
          `/api/v1/campaigns/activate/drafts-v2/${campaignId}/exchange-marketplace-settings`,
          { body: payload },
          true,
        );
      const getRequest = mode === ActivateModes.Builder ? updateBudgetSettings : updateGiftExchangeOptions;

      return getRequest().pipe(
        mergeMap(() => [
          updateMarketplaceSettingsSuccess(payload),
          closeMarketplaceSettingsSidebar(),
          showGlobalMessage({ type: MessageType.Success, text: `Campaign ${campaignName} has been updated` }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              updateMarketplaceSettingsFail,
              showGlobalMessage({
                type: MessageType.Error,
                text: 'Ooops, error! Campaign not updated, please retry',
              }),
            ),
          ),
        ),
      );
    }),
  );

const getUpdateDefaultGiftEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/default-gift`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/default-gift`;
};

const updateDefaultGiftEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateDefaultGiftRequest),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { campaignId, mode } = getActivateModuleParams(state);
      const campaignName = getCampaignName(state);
      return apiService
        .put(getUpdateDefaultGiftEndpoint(campaignId as number, mode as ActivateModes), { body: payload }, true)
        .pipe(
          mergeMap(() => [
            updateDefaultGiftSuccess(payload),
            showGlobalMessage({ type: MessageType.Success, text: `Campaign ${campaignName} has been updated` }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(
                updateDefaultGiftFail,
                showGlobalMessage({
                  type: MessageType.Error,
                  text: 'Ooops, error! Campaign not updated, please retry',
                }),
              ),
            ),
          ),
        );
    }),
  );

const getUpdateExchangeMarketplaceOptionsEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/gift-exchange-option`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/gift-exchange`;
};

const updateGiftExchangeOptionsEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateGiftExchangeOptionsRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { giftExchangeOptions },
        },
        state,
      ]) => {
        const campaignName = getCampaignName(state);
        const { campaignId, mode } = getActivateModuleParams(state);
        return apiService
          .put(
            getUpdateExchangeMarketplaceOptionsEndpoint(campaignId as number, mode as ActivateModes),
            { body: { option: giftExchangeOptions } },
            true,
          )
          .pipe(
            mergeMap(() => [
              updateGiftExchangeOptionsSuccess({ giftExchangeOptions }),
              showGlobalMessage({ type: MessageType.Success, text: `Campaign ${campaignName} has been updated` }),
            ]),
            catchError(
              handleError(
                handlers.handleAnyError(
                  updateGiftExchangeOptionsFail,
                  showGlobalMessage({
                    type: MessageType.Error,
                    text: 'Ooops, error! Campaign not updated, please retry',
                  }),
                ),
              ),
            ),
          );
      },
    ),
  );

const fetchProductsCountOnExchangeOptionChange: Epic = action$ =>
  action$.pipe(
    ofType(updateGiftExchangeOptionsSuccess),
    filter(({ payload: { giftExchangeOptions } }) =>
      [GiftExchangeOptions.campaignBudget, GiftExchangeOptions.customMarketplace].includes(
        giftExchangeOptions as GiftExchangeOptions,
      ),
    ),
    map(() => fetchProductsCount()),
  );

const getUpdateGiftStepEndpoint = (campaignId: string | number, mode: ActivateModes) => {
  if (mode === ActivateModes.Builder) {
    return `/api/v1/campaigns/activate/drafts-v2/${campaignId}/recipient-actions`;
  }
  return `/api/v1/campaigns/activate/campaigns/${campaignId}/recipient-actions`;
};

const updateGiftStepEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateGiftStepRequest),
    withLatestFrom(state$),
    mergeMap(
      ([
        {
          payload: { recipientActions },
        },
        state,
      ]) => {
        const { campaignId, mode } = getActivateModuleParams(state);

        return apiService
          .put(getUpdateGiftStepEndpoint(campaignId as number, mode as ActivateModes), { body: recipientActions }, true)
          .pipe(
            mergeMap(() => [
              updateGiftStepSuccess({ recipientActions }),
              ...(mode === ActivateModes.Builder ? [goToNextStep()] : []),
              showGlobalMessage({ type: MessageType.Success, text: `Campaign has been updated` }),
            ]),
            catchError(
              handleError(
                handlers.handleAnyError(
                  updateGiftStepFail,
                  showGlobalMessage({
                    type: MessageType.Error,
                    text: 'Ooops, error! Campaign not updated, please retry',
                  }),
                ),
              ),
            ),
          );
      },
    ),
  );

const updateGiftCustomMarketplaceEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(updateCustomMarketplaceSetting),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { id },
        },
        state,
      ]) => {
        const { campaignId, mode } = getActivateModuleParams(state);
        const updateMarketplace = () =>
          apiService.put(
            `/api/v1/campaigns/activate/drafts-v2/${campaignId}/custom-marketplace`,
            {
              body: { customMarketplaceId: id },
            },
            true,
          );

        const updateGiftExchangeOptions = () => {
          const body: IUpdateGiftExchangeOptions = {
            giftExchangeOption: GiftExchangeOptions.customMarketplace,
            exchangeMarketplaceSettings: null,
            fallbackGift: null,
            customMarketplace: { id },
            donationSettings: null,
          };
          return apiService.put(`/api/v1/campaigns/activate/campaigns/${campaignId}/gift-exchange`, { body }, true);
        };

        const request = mode === ActivateModes.Builder ? updateMarketplace : updateGiftExchangeOptions;

        return request().pipe(
          mergeMap(() => [
            updateCustomMarketplaceSettingSuccess({ id }),
            fetchProductsCount(),
            showGlobalMessage({ type: MessageType.Success, text: `Campaign has been updated` }),
          ]),
          catchError(
            handleError(
              handlers.handleAnyError(
                updateCustomMarketplaceSettingFail,
                showGlobalMessage({
                  type: MessageType.Error,
                  text: 'Ooops, error! Campaign not updated, please retry',
                }),
              ),
            ),
          ),
        );
      },
    ),
  );

const updateAcceptOnlyFallbackGiftEpic: Epic = (
  action$,
  state$,
  { apiService, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(updateAcceptOnlyFallbackGift),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { campaignId, mode } = getActivateModuleParams(state);
      const updateDraft = () =>
        apiService.put(
          `/api/v1/campaigns/activate/drafts-v2/${campaignId}/fallback-gift`,
          {
            body: payload,
          },
          true,
        );

      const updateCampaign = () => {
        const body: IUpdateGiftExchangeOptions = {
          giftExchangeOption: GiftExchangeOptions.acceptOnly,
          exchangeMarketplaceSettings: null,
          fallbackGift: payload,
          customMarketplace: null,
          donationSettings: null,
        };
        return apiService.put(`/api/v1/campaigns/activate/campaigns/${campaignId}/fallback-gift`, { body }, true);
      };

      const request = mode === ActivateModes.Builder ? updateDraft : updateCampaign;

      return request().pipe(
        mergeMap(() => [
          updateAcceptOnlyFallbackGiftSuccess(payload),
          showGlobalMessage({ type: MessageType.Success, text: `Campaign has been updated` }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              updateCustomMarketplaceSettingFail,
              showGlobalMessage({
                type: MessageType.Error,
                text: 'Ooops, error! Campaign not updated, please retry',
              }),
            ),
          ),
        ),
      );
    }),
  );

const updateDonationSettingEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateAcceptOnlyDonationSetting),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) => {
      const { campaignId, isEditorMode } = getActivateModuleParams(state);

      const updateDraft = () =>
        apiService.put(
          `/api/v1/campaigns/activate/drafts-v2/${campaignId}/donation-settings`,
          { body: { donationAmount: payload } },
          true,
        );
      const updateCampaign = () => {
        const body: IUpdateGiftExchangeOptions = {
          giftExchangeOption: GiftExchangeOptions.noExchange,
          customMarketplace: null,
          exchangeMarketplaceSettings: null,
          fallbackGift: null,
          donationSettings: {
            amount: payload,
          },
        };
        return apiService.put(`/api/v1/campaigns/activate/campaigns/${campaignId}/gift-exchange`, { body }, true);
      };

      return (isEditorMode ? updateCampaign : updateDraft)().pipe(
        mergeMap(() => [
          updateAcceptOnlyDonationSettingSuccess(payload),
          showGlobalMessage({ type: MessageType.Success, text: 'Donation amount updated successfully!' }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              updateAcceptOnlyDonationSettingFail,
              showGlobalMessage({
                type: MessageType.Error,
                text: 'Ooops, error! Donation amount updated, please retry',
              }),
            ),
          ),
        ),
      );
    }),
  );

export const giftEpics = [
  updateMarketplaceEpic,
  updateDefaultGiftEpic,
  updateGiftStepEpic,
  updateGiftExchangeOptionsEpic,
  updateGiftCustomMarketplaceEpic,
  updateDonationSettingEpic,
  updateAcceptOnlyFallbackGiftEpic,
  fetchProductsCountOnExchangeOptionChange,
];
