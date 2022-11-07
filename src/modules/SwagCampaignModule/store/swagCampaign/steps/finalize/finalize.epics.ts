import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';
import { push } from 'connected-react-router';
import { User } from '@alycecom/modules';

import { trackSwagCampaignEvent } from '../../../../events';
import {
  StandardCampaignRoutes,
  StandardCampaignEditorTabs,
  StandardCampaignEditorSubTabs,
} from '../../../../../SettingsModule/components/StandardCampaignModule/routePaths';
import { generateCodesList } from '../codes/codes.actions';
import { getCardsOrder } from '../codes/codes.selectors';
import { CodesType } from '../codes/codes.constants';

import { createSwagCampaignByDraftId } from './finalize.actions';
import { TCreateSwagResponse } from './finalize.types';

const createSwagCampaignByDraftIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createSwagCampaignByDraftId.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: draftId }, state]) =>
      apiService.post('/api/v1/campaigns/swag', { body: { draftId } }, true).pipe(
        mergeMap((response: TCreateSwagResponse) => {
          const [payload, options] = User.selectors.getBaseEventPayload(state);
          const cardOrder = getCardsOrder(state);
          const actions: Action[] = [];

          if (cardOrder?.codeFormat === CodesType.Digital) {
            actions.push(generateCodesList.pending({ campaignId: response.data.id }));
          }

          actions.push(
            createSwagCampaignByDraftId.fulfilled(response),
            GlobalMessage.actions.showGlobalMessage({
              type: MessageType.Success,
              text: `${response.data.name} successfully created`,
            }),
            push(
              StandardCampaignRoutes.buildEditorUrl(
                response.data.id,
                StandardCampaignEditorTabs.SettingsAndPermissions,
                StandardCampaignEditorSubTabs.SwagInvites,
              ),
            ),
            trackSwagCampaignEvent('Gift Codes Campaign - Campaign was created', { id: draftId, ...payload }, options),
          );

          return actions;
        }),
        catchError(handleError(handlers.handleAnyError(createSwagCampaignByDraftId.rejected()))),
      ),
    ),
  );

export default [createSwagCampaignByDraftIdEpic];
