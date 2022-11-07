import { Epic } from 'redux-observable';
import { ofType, queryParamsBuilder } from '@alycecom/utils';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';
import { CampaignType } from '@alycecom/modules';

import { CAMPAIGN_STATUS } from '../../../../../../../constants/campaignSettings.constants';
import { ICampaignListItem } from '../../../../campaigns/campaigns.types';

import { loadWorkatoActiveOneToManyCampaigns } from './activeOneToManyCampaigns.actions';

export const loadAutocompleteCampaignListEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadWorkatoActiveOneToManyCampaigns),
    mergeMap(({ payload: { quantity, search, autocompleteIdentifier } }) => {
      const requestParams = {
        search,
        status: CAMPAIGN_STATUS.ACTIVE,
        types: [CampaignType.activate],
        pagination: {
          limit: quantity,
          offset: 0,
        },
      };
      return apiService.get(`/api/v1/campaigns?${queryParamsBuilder(requestParams)}`, {}, true).pipe(
        map(({ data }: IResponse<ICampaignListItem[]>) =>
          loadWorkatoActiveOneToManyCampaigns.fulfilled({ campaigns: data, autocompleteIdentifier }),
        ),
        catchError(
          handleError(
            handlers.handleAnyError(() => loadWorkatoActiveOneToManyCampaigns.rejected({ autocompleteIdentifier })),
          ),
        ),
      );
    }),
  );
export const activeOneToManyCampaignsEpics = [loadAutocompleteCampaignListEpic];
