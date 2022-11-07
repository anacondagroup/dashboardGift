import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';
import { User } from '@alycecom/modules';
import { ofType } from '@alycecom/utils';

import { saveSwagDraftCardOrder, saveSwagDraftCardDesign, generateCodesList } from './codes.actions';
import { getCardsOrder } from './codes.selectors';

const saveSwagDraftCardOrderEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(saveSwagDraftCardOrder.pending),
    switchMap(({ payload: { draftId, ...body } }) =>
      apiService
        .put(
          `/api/v1/campaigns/swag/drafts/${draftId}/card/order`,
          {
            body,
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            saveSwagDraftCardOrder.fulfilled({ ...body }),
            GlobalMessage.messagesService.showGlobalMessage({
              type: MessageType.Success,
              text: 'Updated successfully',
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(saveSwagDraftCardOrder.rejected))),
        ),
    ),
  );

const saveSwagDraftCardDesignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(saveSwagDraftCardDesign.pending),
    switchMap(({ payload: { draftId, ...body } }) => {
      const formData = new FormData();
      if (body.fileName && body.cardLogo) {
        formData.append('cardLogo', body.cardLogo, body.fileName);
      }
      formData.append('cardType', body.cardType);
      formData.append('cardHexColor', body.cardHexColor);
      formData.append('cardCmykColorC', `${body.cardCmykColor.c}`);
      formData.append('cardCmykColorM', `${body.cardCmykColor.m}`);
      formData.append('cardCmykColorY', `${body.cardCmykColor.y}`);
      formData.append('cardCmykColorK', `${body.cardCmykColor.k}`);
      formData.append('cardCopyFirstLine', body.cardCopyFirstLine);
      formData.append('cardCopySecondLine', body.cardCopySecondLine);
      formData.append('cardCopyThirdLine', body.cardCopyThirdLine);
      return apiService.postFile(`/api/v1/campaigns/swag/drafts/${draftId}/card/design`, { body: formData }, true).pipe(
        mergeMap(() => [
          saveSwagDraftCardDesign.fulfilled({ ...body }),
          GlobalMessage.messagesService.showGlobalMessage({
            type: MessageType.Success,
            text: 'Updated successfully',
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(saveSwagDraftCardDesign.rejected))),
      );
    }),
  );

const generateCodesListEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(generateCodesList.pending),
    withLatestFrom(state$),
    mergeMap(
      ([
        {
          payload: { campaignId },
        },
        state,
      ]) => {
        const cardOrderData = getCardsOrder(state);
        const userId = User.selectors.getUserId(state);
        return apiService
          .post(`/enterprise/swag/campaign/${campaignId}/generate-codes`, {
            body: {
              ownerId: userId,
              codesBatchName: cardOrderData?.codesBatchName,
              codesAmount: cardOrderData?.codesAmount,
              codesExpirationDate: cardOrderData?.codesExpirationDate,
            },
          })
          .pipe(
            mergeMap(() => [generateCodesList.fulfilled()]),
            catchError(handleError(handlers.handleAnyError(generateCodesList.rejected))),
          );
      },
    ),
  );

export default [saveSwagDraftCardOrderEpic, saveSwagDraftCardDesignEpic, generateCodesListEpic];
