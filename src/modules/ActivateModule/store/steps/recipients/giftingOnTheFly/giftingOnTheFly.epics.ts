import { Epic } from 'redux-observable';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';
import { ofType } from '@alycecom/utils';

import { getActivateModuleParams } from '../../../activate.selectors';
import { ActivateModes } from '../../../../routePaths';

import {
  updateGiftingOnTheFlyFail,
  updateGiftingOnTheFlyRequest,
  updateGiftingOnTheFlySuccess,
} from './giftingOnTheFly.actions';

const updateGiftingOnTheFlyEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(updateGiftingOnTheFlyRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { isEnabled },
        },
        state,
      ]) => {
        const { mode, campaignId } = getActivateModuleParams(state);
        const requestUrl =
          mode === ActivateModes.Builder
            ? `/api/v1/campaigns/activate/drafts-v2/${campaignId}/gifting-on-the-fly`
            : `/api/v1/campaigns/activate/campaigns/${campaignId}/gifting-on-the-fly`;
        return apiService
          .put(
            requestUrl,
            {
              body: { isGiftingOnTheFly: isEnabled },
            },
            true,
          )
          .pipe(
            mergeMap(() => [
              updateGiftingOnTheFlySuccess({ isEnabled }),
              showGlobalMessage({ type: MessageType.Success, text: `Campaign has been updated` }),
            ]),
            catchError(
              handleError(
                handlers.handleAnyError(
                  updateGiftingOnTheFlyFail,
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

export default [updateGiftingOnTheFlyEpic];
