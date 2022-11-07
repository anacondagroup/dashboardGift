import { catchError, map, mapTo, mergeMap } from 'rxjs/operators';
import { Epic, ofType } from 'redux-observable';
import { handleError, handlers } from '@alycecom/services';

import { createCampaignSuccess } from '../../modules/SettingsModule/store/campaign/createCampaign/createCampaign.actions';
import { SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH } from '../../modules/SettingsModule/store/campaign/swagSelect/swagSelect.types';
import {
  campaignNameSaveSuccess,
  campaignSettingsOwnerSaveSuccess,
} from '../../modules/SettingsModule/store/campaign/general/general.actions';
import {
  expireProspectingCampaignById,
  unexpireProspectingCampaignById,
} from '../../modules/ProspectingCampaignModule/store/prospectingCampaign/prospectingCampaign.actions';

import { loadCampaignsSuccess, loadCampaignsFail, loadCampaignsRequest } from './campaigns.actions';
import { ICampaign } from './campaigns.types';

const loadCampaignsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(loadCampaignsRequest),
    mergeMap(() =>
      apiService.get(`/enterprise/dashboard/campaigns`).pipe(
        map((response: { campaigns: ICampaign[] }) => loadCampaignsSuccess(response.campaigns)),
        catchError(handleError(handlers.handleAnyError(loadCampaignsFail))),
      ),
    ),
  );

const refreshListOnCreateCampaignEpic: Epic = action$ =>
  action$.pipe(ofType(createCampaignSuccess), mapTo(loadCampaignsRequest()));

const refreshListOnChangeNameEpic: Epic = action$ =>
  action$.pipe(ofType(campaignNameSaveSuccess), mapTo(loadCampaignsRequest()));

const refreshListOnChangeOwnerEpic: Epic = action$ =>
  action$.pipe(ofType(campaignSettingsOwnerSaveSuccess), mapTo(loadCampaignsRequest()));

const refreshListOnSwagCodesCreationFinishEpic: Epic = action$ =>
  action$.pipe(ofType(SWAG_SELECT_GENERATION_CODES_PROGRESS_FINISH), mapTo(loadCampaignsRequest()));

const refreshListOnProspectingCampaignActionsEpic: Epic = action$ =>
  action$.pipe(
    ofType(expireProspectingCampaignById.fulfilled, unexpireProspectingCampaignById.fulfilled),
    mapTo(loadCampaignsRequest()),
  );

export default [
  loadCampaignsEpic,
  refreshListOnCreateCampaignEpic,
  refreshListOnChangeNameEpic,
  refreshListOnChangeOwnerEpic,
  refreshListOnSwagCodesCreationFinishEpic,
  refreshListOnProspectingCampaignActionsEpic,
];
