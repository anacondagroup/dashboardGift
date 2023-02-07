import { Epic } from 'redux-observable';
import { catchError, debounceTime, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { ofType, queryParamsBuilder } from '@alycecom/utils';
import { handleError, handlers, IResponse, MessageType, showGlobalMessage, TrackEvent } from '@alycecom/services';
import { Auth, User } from '@alycecom/modules';
import { push } from 'connected-react-router';
import { SimpleActionCreator } from 'redux-act';

import { loadCampaignsRequest } from '../../../../../../store/campaigns/campaigns.actions';
import { ProspectingBuilderStep, ProspectingCampaignRoutes } from '../../../../../ProspectingCampaignModule/routePaths';
import { CAMPAIGN_STATUS, CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';
import { ActivateBuilderStep, ActivateCampaignRoutes } from '../../../../../ActivateModule/routePaths';

import { ICampaignBreakdownResponse } from './campaignsBreakdown.types';
import {
  archiveCampaigns,
  discardActivateDraftById,
  discardProspectingDraftById,
  duplicate1ToManyCampaign,
  duplicateCampaign,
  duplicateProspectingCampaign,
  expireActivateOrSwagCampaigns,
  fetchCampaignsFail,
  fetchCampaignsRequest,
  fetchCampaignsSuccess,
  resetSelection,
  setStandardCampaignExpired,
  unArchiveCampaigns,
  unExpireActivateOrSwagCampaigns,
} from './campaignsBreakdown.actions';

export const loadCampaignManagementListEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchCampaignsRequest),
    debounceTime(500),
    switchMap(({ payload }) =>
      apiService.get(`/api/v1/campaigns/statistic?${queryParamsBuilder({ ...payload })}`, {}, true).pipe(
        map(({ data: campaigns, pagination, meta }: ICampaignBreakdownResponse) =>
          fetchCampaignsSuccess({ campaigns, pagination, meta }),
        ),
        catchError(handleError(handlers.handleAnyError(fetchCampaignsFail))),
      ),
    ),
  );

export const duplicateCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(duplicateCampaign.pending),
    switchMap(({ payload: { id, teamId } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/${id}/duplicate`, {
          body: {
            teamId,
          },
        })
        .pipe(
          mergeMap(() => [
            duplicateCampaign.fulfilled(),
            showGlobalMessage({
              type: MessageType.Success,
              text: `Campaign copied`,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(duplicateCampaign.rejected))),
        ),
    ),
  );

export const expireStandardCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(setStandardCampaignExpired.pending),
    switchMap(({ payload: { campaignId, isExpired } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/availability`, {
          body: {
            campaign_id: campaignId,
            availability: !isExpired,
          },
        })
        .pipe(
          mergeMap(() => [
            setStandardCampaignExpired.fulfilled(),
            loadCampaignsRequest(),
            showGlobalMessage({
              text: `Campaign successfully ${isExpired ? 'expired' : 'unexpired'}`,
              type: MessageType.Success,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(setStandardCampaignExpired.rejected))),
        ),
    ),
  );

export const expireActivateCampaignsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(expireActivateOrSwagCampaigns.pending),
    switchMap(({ payload: { campaignIds } }) =>
      apiService
        .post(
          `/api/v1/campaigns/expire`,
          {
            body: { campaignIds },
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            expireActivateOrSwagCampaigns.fulfilled(),
            loadCampaignsRequest(),
            showGlobalMessage({
              text: `Campaign successfully expired`,
              type: MessageType.Success,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(expireActivateOrSwagCampaigns.rejected))),
        ),
    ),
  );

export const unExpireActivateCampaignsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(unExpireActivateOrSwagCampaigns.pending),
    switchMap(({ payload: { campaignIds } }) =>
      apiService
        .post(
          `/api/v1/campaigns/unexpire`,
          {
            body: { campaignIds },
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            unExpireActivateOrSwagCampaigns.fulfilled({ campaignIds }),
            loadCampaignsRequest(),
            showGlobalMessage({
              text: `Campaign successfully unexpired`,
              type: MessageType.Success,
            }),
          ]),
          catchError(handleError(handlers.handleAnyError(unExpireActivateOrSwagCampaigns.rejected))),
        ),
    ),
  );

export const discardActivateDraftEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(discardActivateDraftById.pending),
    switchMap(({ payload: id }) =>
      apiService.delete(`/api/v1/campaigns/activate/drafts-v2/${id}`, null, true).pipe(
        mergeMap(() => {
          const adminId = Auth.selectors.getLoginAsAdminId(state$.value);
          return [
            discardActivateDraftById.fulfilled(),
            TrackEvent.actions.trackEvent({
              name: 'Draft campaign — discarded',
              payload: { campaignType: CAMPAIGN_TYPES.ACTIVATE, adminId },
            }),
            showGlobalMessage({
              type: MessageType.Success,
              text: `Campaign draft discarded`,
            }),
          ];
        }),
        catchError(handleError(handlers.handleAnyError(discardActivateDraftById.rejected()))),
      ),
    ),
  );

export const archiveCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(archiveCampaigns.pending),
    switchMap(({ payload }) => {
      const campaignIds = payload.campaigns.map(({ id }) => id);
      return apiService.post(`/api/v1/campaigns/archive`, { body: { campaignIds } }, true).pipe(
        mergeMap(() => [
          archiveCampaigns.fulfilled(payload),
          push('/campaigns'),
          showGlobalMessage({
            type: MessageType.Success,
            text: campaignIds.length > 1 ? 'Campaigns have been archived' : 'Campaign has been archived',
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              () => archiveCampaigns.rejected(),
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong!' }),
            ),
          ),
        ),
      );
    }),
  );

export const duplicateProspectingCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(duplicateProspectingCampaign.pending),
    switchMap(({ payload: { id } }) =>
      apiService.post('/api/v1/campaigns/prospecting/duplicate', { body: { campaignId: id } }, true).pipe(
        mergeMap(({ data: { draftId } }: IResponse<{ draftId: number }>) => [
          duplicateProspectingCampaign.fulfilled(),
          push(ProspectingCampaignRoutes.buildBuilderUrl(draftId, ProspectingBuilderStep.Details)),
          showGlobalMessage({
            type: MessageType.Success,
            text: `Campaign copied as a new draft`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(duplicateProspectingCampaign.rejected()))),
      ),
    ),
  );

export const discardProspectingDraftEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(discardProspectingDraftById.pending),
    switchMap(({ payload: id }) =>
      apiService.delete(`/api/v1/campaigns/prospecting/drafts/${id}`, null, true).pipe(
        mergeMap(() => {
          const adminId = Auth.selectors.getLoginAsAdminId(state$.value);
          return [
            discardProspectingDraftById.fulfilled(),
            TrackEvent.actions.trackEvent({
              name: 'Draft campaign — discarded',
              payload: { campaignType: CAMPAIGN_TYPES.PROSPECTING, adminId },
            }),
            showGlobalMessage({
              type: MessageType.Success,
              text: `Campaign draft discarded`,
            }),
          ];
        }),
        catchError(handleError(handlers.handleAnyError(discardProspectingDraftById.rejected()))),
      ),
    ),
  );

export const unArchiveCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(unArchiveCampaigns.pending),
    switchMap(({ payload }) => {
      const campaignIds = payload.campaigns.map(({ id }) => id);
      return apiService.post(`/api/v1/campaigns/unarchive`, { body: { campaignIds } }, true).pipe(
        mergeMap(() => [
          unArchiveCampaigns.fulfilled(payload),
          loadCampaignsRequest(),
          push('/campaigns'),
          showGlobalMessage({
            type: MessageType.Success,
            text: campaignIds.length > 1 ? 'Campaigns have been unarchived' : 'Campaign has been unarchived',
          }),
        ]),
        catchError(
          handleError(
            handlers.handleAnyError(
              () => unArchiveCampaigns.rejected(),
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong!' }),
            ),
          ),
        ),
      );
    }),
  );

export const duplicate1ToManyCampaignEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(duplicate1ToManyCampaign.pending),
    switchMap(({ payload: { id } }) =>
      apiService.post('/api/v1/campaigns/activate/campaigns/duplicate', { body: { campaignId: id } }, true).pipe(
        mergeMap(({ data: { draftId } }: IResponse<{ draftId: number }>) => [
          duplicate1ToManyCampaign.fulfilled(),
          push(ActivateCampaignRoutes.buildBuilderUrl(draftId, ActivateBuilderStep.Details)),
          showGlobalMessage({
            type: MessageType.Success,
            text: `Campaign copied as a new draft`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(duplicate1ToManyCampaign.rejected()))),
      ),
    ),
  );

export const sendSegmentEventOnArchiveCampaignEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(...[archiveCampaigns.fulfilled, unArchiveCampaigns.fulfilled]),
    withLatestFrom(state$),
    map(([{ payload }, state]) => {
      const campaignIds = payload.campaigns.map(({ id }) => id);
      const isArchived = payload.campaigns.some(({ status }) => status === CAMPAIGN_STATUS.ARCHIVED);
      const userId = User.selectors.getUserId(state);
      const adminId = Auth.selectors.getLoginAsAdminId(state);
      const isArchivedActionName = isArchived ? 'unarchived' : 'archived';
      return TrackEvent.actions.trackEvent({
        name:
          payload.campaigns.length > 1 ? `Campaigns — ${isArchivedActionName}` : `Campaign — ${isArchivedActionName}`,
        payload: { campaignIds, userId, adminId },
      });
    }),
  );

export const resetSelectionEpic: Epic = action$ =>
  action$.pipe(
    ofType(
      duplicateCampaign.fulfilled,
      setStandardCampaignExpired.fulfilled,
      expireActivateOrSwagCampaigns.fulfilled,
      discardActivateDraftById.fulfilled,
      discardProspectingDraftById.fulfilled,
      (archiveCampaigns.fulfilled as unknown) as SimpleActionCreator<void, {}>,
      (unArchiveCampaigns.fulfilled as unknown) as SimpleActionCreator<void, {}>,
    ),
    mapTo(resetSelection()),
  );

export const campaignsBreakdownEpics = [
  loadCampaignManagementListEpic,
  duplicateCampaignEpic,
  expireStandardCampaignEpic,
  expireActivateCampaignsEpic,
  discardActivateDraftEpic,
  archiveCampaignEpic,
  unArchiveCampaignEpic,
  sendSegmentEventOnArchiveCampaignEpic,
  resetSelectionEpic,
  duplicateProspectingCampaignEpic,
  discardProspectingDraftEpic,
  duplicate1ToManyCampaignEpic,
  unExpireActivateCampaignsEpic,
];
