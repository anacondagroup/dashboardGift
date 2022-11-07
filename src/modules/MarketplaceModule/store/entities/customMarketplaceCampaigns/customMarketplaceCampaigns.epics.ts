import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { switchMap, map, catchError } from 'rxjs/operators';
import { handleError, handlers } from '@alycecom/services';

import {
  fetchCustomMarketplaceCampaignsByIds,
  fetchCustomMarketplaceCampaignsFail,
  fetchCustomMarketplaceCampaignsSuccess,
} from './customMarketplaceCampaigns.actions';
import { TShortCustomMarketplaceCampaign } from './customMarketplaceCampaigns.types';

const fetchCustomMarketplacesEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchCustomMarketplaceCampaignsByIds),
    switchMap(action =>
      apiService.get(`/api/v1/campaigns?${action.payload.map(id => `ids[]=${id}`).join('&')}`, null, true).pipe(
        map((response: { data: TShortCustomMarketplaceCampaign[] }) =>
          fetchCustomMarketplaceCampaignsSuccess(response.data),
        ),
        catchError(handleError(handlers.handleAnyError(fetchCustomMarketplaceCampaignsFail))),
      ),
    ),
  );

export default [fetchCustomMarketplacesEpic];
