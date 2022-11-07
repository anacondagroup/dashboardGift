import { ofType } from 'redux-observable';
import { catchError, mergeMap, switchMap, takeUntil, withLatestFrom } from 'rxjs/operators';
import { from, timer } from 'rxjs';
import { CreateGift } from '@alycecom/modules';
import { pick } from 'ramda';

import {
  createCampaignSidebarClose,
  createCampaignSidebarSwagSelect,
} from '../createCampaignSidebar/createCampaignSidebar.actions';
import {
  SS_OWNERSHIP_STEP,
  SS_BUDGET_STEP,
  SS_MARKETPLACE_STEP,
  SS_LANDING_PAGE_STEP,
  SS_REQUIRED_ACTIONS_STEP,
  SS_GENERATE_CODES_STEP,
  SS_CARD_CONFIGURATOR_STEP,
  SS_CARD_ORDER_OPTIONS_STEP,
  SS_CARD_ORDER_REVIEW_STEP,
  SS_ORDER_STATUS_FINAL_STEP,
  defaultRecipientRequiredActions,
} from '../../../../../constants/swagSelect.constants';

import {
  SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR,
  SWAG_SELECT_CREATE_CAMPAIGN_REQUEST,
  SWAG_SELECT_GENERATE_CODES_REQUEST,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH,
  SWAG_SELECT_GENERATION_CODES_PROGRESS_REQUEST,
  SWAG_SELECT_LOAD_CAMPAIGN_REQUEST,
  SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST,
  SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST,
  SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST,
  SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST,
  SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST,
  SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST,
} from './swagSelect.types';
import {
  getSwagSelectCampaignBudgetData,
  getSwagSelectCampaignCreationData,
  getSwagSelectCampaignLandingData,
  getSwagSelectCampaignMarketplaceData,
  getSwagSelectCampaignName,
  getSwagSelectCampaignOwnershipData,
  getSwagSelectCampaignType,
  getSwagSelectCardsOrderData,
  getSwagSelectGenerateCodesData,
  getSwagSelectPhysicalCardData,
  getSwagSelectRecipientActionData,
} from './swagSelect.selectors';
import {
  swagSelectChangeStep,
  swagSelectCreateCampaignFail,
  swagSelectGenerateCodesSuccess,
  swagSelectGenerationCodesProgressFinish,
  swagSelectGenerationCodesProgressSuccess,
  swagSelectSavePhysicalCardFail,
  swagSelectSavePhysicalCardSuccess,
  swagSelectSendOrderDataToProcessingFail,
  swagSelectSendOrderDataToProcessingSuccess,
  swagSelectUpdateCampaignBudgetFail,
  swagSelectUpdateCampaignBudgetSuccess,
  swagSelectUpdateCampaignLandingFail,
  swagSelectUpdateCampaignLandingSuccess,
  swagSelectUpdateCampaignNameFail,
  swagSelectUpdateCampaignNameSuccess,
  swagSelectUpdateCampaignOwnershipFail,
  swagSelectUpdateCampaignOwnershipSuccess,
  swagSelectUpdateCardOrderDataFail,
  swagSelectUpdateCardOrderDataSuccess,
  swagSelectUpdateRecipientActionsFail,
  swagSelectUpdateRecipientActionsSuccess,
  swagSelectUpdateRestrictedProductsFail,
  swagSelectUpdateRestrictedProductsSuccess,
  swagSelectWizardInit,
} from './swagSelect.actions';

const swagSelectLoadCampaignEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(SWAG_SELECT_LOAD_CAMPAIGN_REQUEST),
    mergeMap(({ payload, meta }) =>
      apiService.get(`/enterprise/swag/campaign/${payload}`).pipe(
        mergeMap(response =>
          meta
            ? [swagSelectWizardInit(response.campaign), createCampaignSidebarSwagSelect()]
            : [swagSelectWizardInit(response.campaign)],
        ),
        catchError(errorHandler({ callbacks: createCampaignSidebarClose })),
      ),
    ),
  );

const swagSelectCreateCampaignEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_CREATE_CAMPAIGN_REQUEST),
    withLatestFrom(state$),
    mergeMap(([, state]) =>
      apiService.post(`/enterprise/swag/campaign`, { body: getSwagSelectCampaignCreationData(state) }).pipe(
        mergeMap(response => [
          swagSelectWizardInit(response.campaign),
          showGlobalMessage({ type: 'success', text: `Campaign ${response.campaign.campaignName} has been created` }),
          swagSelectChangeStep({
            current: undefined,
            next: SS_BUDGET_STEP,
          }),
          CreateGift.actions.loadCampaignsRequest(),
        ]),
        catchError(
          errorHandler({
            callbacks: swagSelectCreateCampaignFail,
            message: 'Ooops, error! Campaign not created, please retry',
          }),
        ),
      ),
    ),
  );

// FOR STEP 2

export const swagSelectUpdateCampaignNameEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_CAMPAIGN_NAME_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-name`, {
          body: getSwagSelectCampaignName(state),
        })
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ type: 'success', text: 'Campaign has been updated successfully' }),
            swagSelectUpdateCampaignNameSuccess(),
            swagSelectChangeStep({
              current: undefined,
              next: SS_OWNERSHIP_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateCampaignNameFail,
              message: 'Ooops, error! Campaign not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 3

export const swagSelectUpdateCampaignOwnershipEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_CAMPAIGN_OWNERSHIP_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-ownership`, {
          body: getSwagSelectCampaignOwnershipData(state),
        })
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ type: 'success', text: 'Campaign has been updated successfully' }),
            swagSelectUpdateCampaignOwnershipSuccess(),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateCampaignOwnershipFail,
              message: 'Ooops, error! Campaign not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 4

const swagSelectUpdateCampaignBudgetEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_CAMPAIGN_BUDGET_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-budget`, {
          body: getSwagSelectCampaignBudgetData(state),
        })
        .pipe(
          mergeMap(response => [
            showGlobalMessage({ type: 'success', text: 'Campaign budget has been updated successfully' }),
            swagSelectUpdateCampaignBudgetSuccess(response),
            swagSelectChangeStep({
              current: undefined,
              next: SS_MARKETPLACE_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateCampaignBudgetFail,
              message: 'Ooops, error! Budget not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 5

const swagSelectUpdateCampaignMarketplaceEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_RESTRICTED_PRODUCTS_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-marketplace-settings`, {
          body: pick(['defaultProductId', 'defaultProductDenomination'], getSwagSelectCampaignMarketplaceData(state)),
        })
        .pipe(
          mergeMap(response => [
            showGlobalMessage({ type: 'success', text: 'Marketplace has been updated successfully' }),
            swagSelectUpdateRestrictedProductsSuccess(response),
            swagSelectChangeStep({
              next: SS_LANDING_PAGE_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              showErrorsAsGlobal: true,
              callbacks: swagSelectUpdateRestrictedProductsFail,
              message: 'Ooops, error! Marketplace not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 6

const swagSelectUpdateCampaignLandingEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_CAMPAIGN_LANDING_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-rlp`, {
          body: getSwagSelectCampaignLandingData(state),
        })
        .pipe(
          mergeMap(() => [
            showGlobalMessage({ type: 'success', text: 'Landing content has been updated successfully' }),
            swagSelectUpdateCampaignLandingSuccess(),
            swagSelectChangeStep({
              current: undefined,
              next: SS_REQUIRED_ACTIONS_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateCampaignLandingFail,
              message: 'Ooops, error! Landing content not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 7

const swagSelectUpdateRecipientActionsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_RECIPIENT_ACTIONS_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-recipient-actions`, {
          body: getSwagSelectRecipientActionData(state),
        })
        .pipe(
          mergeMap(({ campaign }) => [
            showGlobalMessage({ type: 'success', text: 'Recipient Actions has been updated successfully' }),
            swagSelectUpdateRecipientActionsSuccess(
              campaign.requiredActions ? campaign.requiredActions : defaultRecipientRequiredActions,
            ),
            swagSelectChangeStep({
              current: undefined,
              next:
                getSwagSelectCampaignType(state) === 'swag digital'
                  ? SS_GENERATE_CODES_STEP
                  : SS_CARD_CONFIGURATOR_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateRecipientActionsFail,
              message: 'Ooops, error! Actions not updated, please retry',
            }),
          ),
        ),
    ),
  );

// FOR STEP 8

const swagSelectGenerateCodesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage, ERRORS } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_GENERATE_CODES_REQUEST),
    withLatestFrom(state$),
    mergeMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/generate-codes`, {
          body: getSwagSelectGenerateCodesData(state),
        })
        .pipe(
          mergeMap(({ codesCreationRequestId }) => [
            showGlobalMessage({ type: 'success', text: 'Generate codes job has been queued' }),
            swagSelectGenerateCodesSuccess(codesCreationRequestId),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateRecipientActionsFail,
              message: ERRORS.SOMETHING_WRONG,
            }),
          ),
        ),
    ),
  );

const swagSelectCodesGenerationProgress = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) => {
  const stopPolling$ = action$.pipe(
    ofType(SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH, SWAG_SELECT_CLEAR_DATA_ON_CLOSE_SIDEBAR),
  );
  return action$.pipe(
    ofType(SWAG_SELECT_GENERATION_CODES_PROGRESS_REQUEST),
    switchMap(({ payload }) =>
      timer(0, 2000).pipe(
        takeUntil(stopPolling$),
        switchMap(() =>
          from(
            apiService
              .get(
                `/enterprise/swag/campaign/${payload.campaignId}/check-codes-creation-status?codesCreationRequestId=${payload.requestId}`,
              )
              .pipe(
                mergeMap(({ codesAmount, createdCodesAmount, isFinished, codesCsvFileUrl, codesBatchId }) => {
                  if (isFinished) {
                    return [
                      swagSelectGenerationCodesProgressSuccess({
                        codesAmount,
                        isFinished,
                        codesCsvFileUrl,
                        createdCodesAmount,
                      }),
                      swagSelectGenerationCodesProgressFinish(),
                      showGlobalMessage({ type: 'success', text: `${codesAmount} codes have been generated` }),
                    ];
                  }
                  return [swagSelectGenerationCodesProgressSuccess({ createdCodesAmount, codesBatchId })];
                }),
              ),
          ),
        ),
      ),
    ),
  );
};

const swagSelectSavePhysicalCardEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_SAVE_PHYSICAL_CARD_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) => {
      const formData = new FormData();
      const cardData = getSwagSelectPhysicalCardData(state);
      const { c, m, y, k } = cardData.cardCmykColor;
      formData.append('cardLogo', action.payload.file, action.payload.filename);
      formData.append('cardType', cardData.cardType);
      formData.append('cardHexColor', cardData.cardHexColor);
      formData.append('cardCmykColor', `${c},${m},${y},${k}`);
      formData.append('cardCopyFirstLine', cardData.cardCopyFirstLine);
      formData.append('cardCopySecondLine', cardData.cardCopySecondLine);
      formData.append('cardCopyThirdLine', cardData.cardCopyThirdLine);
      return apiService
        .postFile(`/enterprise/swag/campaign/${action.payload.campaignId}/update-physical-card`, {
          body: formData,
        })
        .pipe(
          mergeMap(({ campaign }) => [
            showGlobalMessage({ type: 'success', text: 'Physical card saved successfully' }),
            swagSelectSavePhysicalCardSuccess(campaign.physicalCard),
            swagSelectChangeStep({
              current: undefined,
              next: SS_CARD_ORDER_OPTIONS_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectSavePhysicalCardFail,
              showErrorsAsGlobal: true,
            }),
          ),
        );
    }),
  );

const swagSelectUpdateCardsOrderEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_UPDATE_CARDS_ORDER_DATA_REQUEST),
    withLatestFrom(state$),
    switchMap(([action, state]) =>
      apiService
        .post(`/enterprise/swag/campaign/${action.payload}/update-order-data`, {
          body: getSwagSelectCardsOrderData(state),
        })
        .pipe(
          mergeMap(({ campaign }) => [
            showGlobalMessage({ type: 'success', text: 'Order data has been saved successfully' }),
            swagSelectUpdateCardOrderDataSuccess({
              physicalCardOrder: campaign.physicalCardOrder,
              reviewData: campaign.reviewData,
            }),
            swagSelectChangeStep({
              current: undefined,
              next: SS_CARD_ORDER_REVIEW_STEP,
            }),
          ]),
          catchError(
            errorHandler({
              callbacks: swagSelectUpdateCardOrderDataFail,
              message: 'Order data not updated, please retry',
            }),
          ),
        ),
    ),
  );

const swagSelectSendOrderToProcessingEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(SWAG_SELECT_SEND_ORDER_TO_PROCESSING_REQUEST),
    switchMap(({ payload }) =>
      apiService.post(`/enterprise/swag/campaign/${payload.campaignId}/order/${payload.orderId}/process`).pipe(
        mergeMap(() => [
          showGlobalMessage({ type: 'success', text: 'Your order has been sent to processing' }),
          swagSelectSendOrderDataToProcessingSuccess(true),
          swagSelectChangeStep({
            current: undefined,
            next: SS_ORDER_STATUS_FINAL_STEP,
          }),
        ]),
        catchError(errorHandler({ callbacks: swagSelectSendOrderDataToProcessingFail })),
      ),
    ),
  );

export const swagSelectEpics = [
  swagSelectLoadCampaignEpic,
  swagSelectUpdateCampaignNameEpic,
  swagSelectUpdateCampaignOwnershipEpic,
  swagSelectCreateCampaignEpic,
  swagSelectUpdateCampaignBudgetEpic,
  swagSelectUpdateCampaignMarketplaceEpic,
  swagSelectUpdateCampaignLandingEpic,
  swagSelectUpdateRecipientActionsEpic,
  swagSelectGenerateCodesEpic,
  swagSelectCodesGenerationProgress,
  swagSelectSavePhysicalCardEpic,
  swagSelectUpdateCardsOrderEpic,
  swagSelectSendOrderToProcessingEpic,
];
