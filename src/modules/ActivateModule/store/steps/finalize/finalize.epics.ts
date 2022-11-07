import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, withLatestFrom } from 'rxjs/operators';
import { handlers, MessageType } from '@alycecom/services';
import { push } from 'connected-react-router';

import { ActivateCampaignRoutes, ActivateEditorStep } from '../../../routePaths';
import { IActivate } from '../../activate.types';
import { loadCampaignsRequest } from '../../../../../store/campaigns/campaigns.actions';
import { getIsRecipientsSourceTypeDefined } from '../recipients';
import { getIsFreeClaimEnabled } from '../details';

import { createCampaignFail, createCampaignRequest, createCampaignSuccess } from './finalize.actions';

const createActivateCampaignEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createCampaignRequest),
    withLatestFrom(state$),
    mergeMap(
      ([
        {
          payload: { draftId },
        },
        state,
      ]) => {
        const body = {
          draftId,
        };
        return apiService.post(`/api/v1/campaigns/activate/campaigns`, { body }, true).pipe(
          mergeMap(({ data }: { data: IActivate }) => [
            createCampaignSuccess(),
            loadCampaignsRequest(),
            showGlobalMessage({ type: MessageType.Success, text: `Campaign link has been generated` }),
            push(
              ActivateCampaignRoutes.buildEditorUrl(
                data.id,
                getIsRecipientsSourceTypeDefined(state) || getIsFreeClaimEnabled(state)
                  ? ActivateEditorStep.GiftLinks
                  : ActivateEditorStep.Recipients,
              ),
            ),
          ]),
          catchError(
            apiService.handleError(
              handlers.handleAnyError(
                createCampaignFail,
                showGlobalMessage({
                  type: MessageType.Error,
                  text: "Ooops, error! Link hasn't been created, please retry",
                }),
              ),
            ),
          ),
        );
      },
    ),
  );

export const finalizeEpics = [createActivateCampaignEpic];
