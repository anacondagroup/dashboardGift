import { Epic } from 'redux-observable';
import { switchMap, catchError, mapTo, map } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handlers, handleError, MessageType } from '@alycecom/services';
import qs from 'query-string';

import {
  getGiftBatches,
  setGiftBatchesSearch,
  setGiftBatchesSort,
  setTeamsCampaignsIds,
  setGiftBatchesPagination,
} from './giftBatches.actions';
import { TGiftBatchesPayload } from './giftBatches.types';
import {
  getGiftBatchesPagination,
  getGiftBatchesSearch,
  getGiftBatchesSort,
  getTeamCampaignsIdsFilters,
} from './giftBatches.selectors';

export const getGiftBatchesEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(getGiftBatches.pending),
    switchMap(() => {
      const filters = getTeamCampaignsIdsFilters(state$.value);
      const search = getGiftBatchesSearch(state$.value);
      const sort = getGiftBatchesSort(state$.value);
      const pagination = getGiftBatchesPagination(state$.value);
      return apiService
        .get(
          `/api/v1/campaigns/prospecting/batches?${qs.stringify({
            'teamIds[]': filters.teamIds,
            'campaignIds[]': filters.campaignIds,
            'sort[field]': sort.column,
            'sort[direction]': sort.direction,
            'pagination[limit]': pagination.perPage,
            'pagination[offset]': pagination.offset,
            search,
          })}`,
          null,
          true,
        )
        .pipe(
          map((response: TGiftBatchesPayload) => getGiftBatches.fulfilled(response)),
          catchError(
            handleError(
              handlers.handleAnyError(
                () => getGiftBatches.rejected(),
                showGlobalMessage({ text: 'Error getting the gift batches', type: MessageType.Error }),
              ),
            ),
          ),
        );
    }),
  );

export const setGiftBatchesTableActionsEpic: Epic = action$ =>
  action$.pipe(
    ofType(...[setTeamsCampaignsIds, setGiftBatchesSort, setGiftBatchesSearch, setGiftBatchesPagination]),
    mapTo(getGiftBatches()),
  );

export default [getGiftBatchesEpic, setGiftBatchesTableActionsEpic];
