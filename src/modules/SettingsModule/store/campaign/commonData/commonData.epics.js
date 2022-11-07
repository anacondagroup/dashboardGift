import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST } from './commonData.types';
import { commonCampaignSettingsDataSuccess, commonCampaignSettingsDataFail } from './commonData.actions';

const commonCampaignDataLoadEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(COMMON_CAMPAIGN_SETTINGS_DATA_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/campaigns/${payload}`).pipe(
        map(response => commonCampaignSettingsDataSuccess(response.campaign)),
        catchError(errorHandler({ callbacks: commonCampaignSettingsDataFail, showErrorsAsGlobal: true })),
      ),
    ),
  );

export const commonCampaignDataEpics = [commonCampaignDataLoadEpic];
