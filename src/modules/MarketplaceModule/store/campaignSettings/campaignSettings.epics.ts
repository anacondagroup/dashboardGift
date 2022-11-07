import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { handleError, handlers } from '@alycecom/services';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';

import * as actions from './campaignSettings.actions';
import { TMarketplaceCampaignSettings } from './campaignSettings.types';

const fetchCampaignSettingsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(actions.fetchCampaignSettings),
    debounceTime(300),
    switchMap(({ payload: campaignId }) =>
      apiService.get(`/api/v1/campaigns/${campaignId}/settings`, null, true).pipe(
        map((response: { data: TMarketplaceCampaignSettings }) =>
          actions.fetchCampaignSettingsSuccess({ ...response.data, campaignId }),
        ),
        catchError(handleError(handlers.handleAnyError(actions.fetchCampaignSettingsFail))),
      ),
    ),
  );

export default [fetchCampaignSettingsEpic];
