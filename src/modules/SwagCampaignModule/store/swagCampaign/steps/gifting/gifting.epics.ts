import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { forkJoin } from 'rxjs';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';

import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { getDetailsData } from '../details/details.selectors';

import { updateDraftSwagGifting } from './gifting.actions';

const updateDraftSwagGiftingEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateDraftSwagGifting.pending),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { id, ...body },
        },
        state,
      ]) => {
        const {
          option,
          defaultGiftData,
          exchangeMarketplaceSettings,
          customMarketplaceData,
          giftActionsData,
          recipientActionsData,
        } = body;

        const updateDraftSwagGiftExchange = apiService.put(
          `/api/v1/campaigns/swag/drafts/${id}/gift-exchange`,
          { body: { exchangeMarketplaceSettings, option, customMarketplace: { id: customMarketplaceData.id } } },
          true,
        );
        const updateDraftSwagDefaultGift = apiService.put(
          `/api/v1/campaigns/swag/drafts/${id}/default-gift`,
          { body: { ...defaultGiftData.defaultGift } },
          true,
        );
        const updateDraftSwagGiftActions = apiService.put(
          `/api/v1/campaigns/swag/drafts/${id}/gift-actions`,
          { body: { ...giftActionsData } },
          true,
        );
        const updateDraftSwagRecipientActions = apiService.put(
          `/api/v1/campaigns/swag/drafts/${id}/recipient-actions`,
          { body: { ...recipientActionsData.recipientActions } },
          true,
        );

        return forkJoin([
          updateDraftSwagGiftExchange,
          updateDraftSwagDefaultGift,
          updateDraftSwagGiftActions,
          updateDraftSwagRecipientActions,
        ]).pipe(
          mergeMap(() => [
            updateDraftSwagGifting.fulfilled(body),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: `"${getDetailsData(state)?.campaignName}" updated successfully`,
            }),
            goToNextStep(),
          ]),
          catchError(handleError(handlers.handleAnyError(updateDraftSwagDefaultGift.rejected))),
        );
      },
    ),
  );

export default [updateDraftSwagGiftingEpic];
