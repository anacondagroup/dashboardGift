import { Epic, ofType as classicOfType } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { filter, map, mapTo, withLatestFrom } from 'rxjs/operators';
import { parse } from 'query-string';

import { UPDATE_STATE_UPDATED_TIME } from '../../../../../store/common/stateUpdatedTime/stateUpdatedTime.types';
import {
  expireProspectingCampaignById,
  unexpireProspectingCampaignById,
} from '../../../../ProspectingCampaignModule/store/prospectingCampaign/prospectingCampaign.actions';

import { campaignsBreakdownEpics } from './campaignsBreakdown/campaignsBreakdown.epics';
import { campaignFiltersEpics } from './filters/filters.epics';
import { setFilters } from './filters/filters.actions';
import {
  archiveCampaigns,
  discardActivateDraftById,
  discardProspectingDraftById,
  duplicateCampaign,
  expireActivateOrSwagCampaigns,
  unExpireActivateOrSwagCampaigns,
  fetchCampaignsRequest,
  resetSelection,
  setStandardCampaignExpired,
  unArchiveCampaigns,
} from './campaignsBreakdown/campaignsBreakdown.actions';
import { getFiltersAsPayload } from './filters/filters.selectors';
import { fetchCampaignsWithStoredFilters } from './campaignsManagement.actions';
import { ICampaignBreakdownListRequestPayload } from './campaignsBreakdown/campaignsBreakdown.types';

const fetchCampaignsWithStoredFiltersEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(fetchCampaignsWithStoredFilters),
    withLatestFrom(state$),
    map(([, state]) => fetchCampaignsRequest(getFiltersAsPayload(state) as ICampaignBreakdownListRequestPayload)),
  );

const reloadCampaignsWhenFiltersChangedEpic: Epic = (action$, state$) =>
  action$.pipe(ofType(setFilters), withLatestFrom(state$), mapTo(fetchCampaignsWithStoredFilters()));

const reloadCampaignsWhenActionCompletedEpic: Epic = action$ =>
  action$.pipe(
    ofType(
      ...[
        duplicateCampaign.fulfilled,
        setStandardCampaignExpired.fulfilled,
        expireActivateOrSwagCampaigns.fulfilled,
        unExpireActivateOrSwagCampaigns.fulfilled,
        discardActivateDraftById.fulfilled,
        discardProspectingDraftById.fulfilled,
        archiveCampaigns.fulfilled,
        unArchiveCampaigns.fulfilled,
        expireProspectingCampaignById.fulfilled,
        unexpireProspectingCampaignById.fulfilled,
      ],
    ),
    mapTo(fetchCampaignsWithStoredFilters()),
  );

const resetSelectionWhenStatusFilterChangedEpic: Epic = action$ =>
  action$.pipe(
    ofType(setFilters),
    filter(({ payload }) => {
      const currentParams = parse(window.location.search);
      return 'status' in payload && payload.status !== currentParams.status;
    }),
    mapTo(resetSelection()),
  );

export const dispatchFiltersToRequestByGiftFlowEpic: Epic = action$ =>
  action$.pipe(classicOfType(UPDATE_STATE_UPDATED_TIME), mapTo(fetchCampaignsWithStoredFilters()));

export const campaignsManagementEpics = [
  ...campaignsBreakdownEpics,
  ...campaignFiltersEpics,
  fetchCampaignsWithStoredFiltersEpic,
  reloadCampaignsWhenFiltersChangedEpic,
  reloadCampaignsWhenActionCompletedEpic,
  resetSelectionWhenStatusFilterChangedEpic,
  dispatchFiltersToRequestByGiftFlowEpic,
];
