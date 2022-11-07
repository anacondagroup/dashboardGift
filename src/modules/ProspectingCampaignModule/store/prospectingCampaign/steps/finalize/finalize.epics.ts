import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';
import { push } from 'connected-react-router';
import { User } from '@alycecom/modules';

import { ProspectingCampaignRoutes } from '../../../../routePaths';
import { trackProspectingCampaignEvent } from '../../../../events';

import { createProspectingCampaignByDraftId } from './finalize.actions';
import { TCreateProspectingResponse } from './finalize.types';

const createProspectingCampaignByDraftIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(createProspectingCampaignByDraftId.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: draftId }, state]) =>
      apiService.post('/api/v1/campaigns/prospecting', { body: { draftId } }, true).pipe(
        mergeMap((response: TCreateProspectingResponse) => {
          const [payload, options] = User.selectors.getBaseEventPayload(state);
          return [
            createProspectingCampaignByDraftId.fulfilled(response),
            GlobalMessage.actions.showGlobalMessage({
              type: MessageType.Success,
              text: `${response.data.name} successfully created`,
            }),
            push(ProspectingCampaignRoutes.buildEditorUrl(response.data.id)),
            trackProspectingCampaignEvent(
              'Prospecting Campaign - Campaign was created',
              { id: draftId, ...payload },
              options,
            ),
          ];
        }),
        catchError(handleError(handlers.handleAnyError(createProspectingCampaignByDraftId.rejected()))),
      ),
    ),
  );

export default [createProspectingCampaignByDraftIdEpic];
