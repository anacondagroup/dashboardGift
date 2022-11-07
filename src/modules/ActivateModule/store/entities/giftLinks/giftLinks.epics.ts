import { Epic } from 'redux-observable';
import { ofType, queryParamsBuilder } from '@alycecom/utils';
import { catchError, map, mergeMap, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType } from '@alycecom/services';
import { applySpec } from 'ramda';

import { getCampaignName } from '../../steps/details';

import {
  downloadGiftLinks,
  downloadGiftLinksFail,
  downloadGiftLinksSuccess,
  fetchGiftLinks,
  fetchGiftLinksFail,
  fetchGiftLinksSuccess,
  setSearchFilter,
  setSortFilter,
} from './giftLinks.actions';
import { TGiftLinksResponse } from './giftLinks.types';
import { getGiftLinksCampaignId, getGiftLinksFilter } from './giftLinks.selectors';

export const fetchGiftLinksEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchGiftLinks),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            filter: getGiftLinksFilter,
          }),
        ),
      ),
    ),
    mergeMap(([{ payload: { campaignId } }, { filter }]) =>
      apiService
        .get(`/api/v1/campaigns/activate/campaigns/${campaignId}/gift-links?${queryParamsBuilder(filter)}`, null, true)
        .pipe(
          map((response: TGiftLinksResponse) => fetchGiftLinksSuccess(response)),
          catchError(handleError(handlers.handleAnyError(fetchGiftLinksFail))),
          takeUntil(action$.ofType(setSearchFilter, setSortFilter)),
        ),
    ),
  );

export const applyFiltersEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(...[setSearchFilter, setSortFilter]),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            campaignId: getGiftLinksCampaignId,
          }),
        ),
      ),
    ),
    map(([, { campaignId }]) => fetchGiftLinks({ campaignId })),
  );

export const downloadGiftLinksEpic: Epic = (
  action$,
  state$,
  { apiService, downloadFile, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(downloadGiftLinks),
    withLatestFrom(
      state$.pipe(
        map(
          applySpec({
            campaignName: getCampaignName,
          }),
        ),
      ),
    ),
    switchMap(([{ payload }, { campaignName }]) =>
      apiService.getFile(`/api/v1/campaigns/activate/campaigns/${payload.campaignId}/gift-links/export`).pipe(
        tap(blob => {
          downloadFile(blob, `${campaignName} gift links.xlsx`);
        }),
        map(() => downloadGiftLinksSuccess()),
        catchError(
          handleError(
            handlers.handleAnyError(
              downloadGiftLinksFail,
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
            ),
          ),
        ),
      ),
    ),
  );

export default [fetchGiftLinksEpic, applyFiltersEpic, downloadGiftLinksEpic];
