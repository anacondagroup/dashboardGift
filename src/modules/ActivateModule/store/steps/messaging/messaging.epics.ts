import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, switchMap, withLatestFrom, mergeMap, tap } from 'rxjs/operators';
import { handlers, MessageType, handleError } from '@alycecom/services';

import { ActivateModes } from '../../../routePaths';
import { getActivateModuleParams } from '../../activate.selectors';
import { goToNextStep } from '../../ui/activeStep/activeStep.actions';

import { messagingStepFail, messagingStepRequest, messagingStepSuccess } from './messaging.actions';

const messagingStepEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(messagingStepRequest),
    withLatestFrom(state$),
    switchMap(
      ([
        {
          payload: { data: body, options },
        },
        state,
      ]) => {
        const { mode, campaignId } = getActivateModuleParams(state) || {};
        const requestUrl =
          mode && mode === ActivateModes.Builder
            ? `/api/v1/campaigns/activate/drafts-v2/${campaignId}/messaging`
            : `/api/v1/campaigns/activate/campaigns/${campaignId}/messaging`;

        return apiService.put(requestUrl, { body }, true).pipe(
          mergeMap(() => [
            messagingStepSuccess(body),
            ...(mode === ActivateModes.Builder && !options?.openLinkOnSuccess ? [goToNextStep()] : []),
            showGlobalMessage({ type: 'success', text: 'Campaign messaging have been set' }),
          ]),
          tap(() => {
            if (options?.openLinkOnSuccess) {
              window.open(options?.openLinkOnSuccess, '__blank');
            }
          }),
          catchError(
            handleError(
              handlers.handleAnyError(
                messagingStepFail,
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

export default [messagingStepEpic];
