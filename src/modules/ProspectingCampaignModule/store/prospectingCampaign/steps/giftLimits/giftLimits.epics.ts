import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, debounceTime, delay, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { GlobalMessage, handleError, handlers, MessageType } from '@alycecom/services';
import { combineLatest, of } from 'rxjs';
import { CampaignSettings } from '@alycecom/modules';

import { getDetailsData } from '../details/details.selectors';
import { goToNextStep } from '../../ui/activeStep/activeStep.actions';
import { resetProspectingCampaign } from '../../prospectingCampaign.actions';

import {
  editBulkProspectingGiftLimitsByDraftId,
  fetchProspectingGiftLimitsByDraftId,
  fetchProspectingGiftLimitsById,
  setFilteredGiftLimits,
  setGiftLimitsSearchFilter,
  setGiftLimitsSortFilter,
  updateProspectingGiftingLimitsRemainingById,
  updateProspectingGiftLimitsByDraftId,
  updateProspectingGiftLimitsById,
} from './giftLimits.actions';
import { TGiftLimitsResponse } from './giftLimits.types';
import { combineAndFilterTeamMembersWithGiftLimits, combineTeamMembersWithGiftLimits } from './giftLimits.helpers';
import { getAllGiftLimits, getGiftLimitsFilters } from './giftLimits.selectors';

const fetchProspectingGiftLimitsByDraftIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProspectingGiftLimitsByDraftId.pending),
    switchMap(({ payload: draftId }) =>
      combineLatest(
        apiService.get(`/api/v1/campaigns/prospecting/drafts/${draftId}/gift-limits`, null, true),
        action$.pipe(ofType(CampaignSettings.actions.loadTeamMembersRequest.fulfilled)),
      ).pipe(
        map(
          ([response, teamMemberAction]: [
            unknown,
            ReturnType<typeof CampaignSettings.actions.loadTeamMembersRequest.fulfilled>,
          ]) =>
            fetchProspectingGiftLimitsByDraftId.fulfilled(
              combineTeamMembersWithGiftLimits(teamMemberAction.payload, (response as TGiftLimitsResponse).data),
            ),
        ),
        catchError(handleError(handlers.handleAnyError(fetchProspectingGiftLimitsByDraftId.rejected()))),
      ),
    ),
  );

const updateProspectingGiftLimitsByDraftIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingGiftLimitsByDraftId.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { draftId, ...body } }, state]) =>
      apiService.post(`/api/v1/campaigns/prospecting/drafts/${draftId}/gift-limits`, { body }, true).pipe(
        mergeMap(() => [
          updateProspectingGiftLimitsByDraftId.fulfilled(body),
          GlobalMessage.actions.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" successfully updated`,
          }),
          goToNextStep(),
        ]),
        catchError(handleError(handlers.handleAnyError(updateProspectingGiftLimitsByDraftId.rejected()))),
      ),
    ),
  );

const editBulkProspectingGiftLimitsByDraftIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(editBulkProspectingGiftLimitsByDraftId.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { draftId, ...body } }, state]) =>
      apiService.post(`/api/v1/campaigns/prospecting/drafts/${draftId}/gift-limits`, { body }, true).pipe(
        mergeMap(() => [
          editBulkProspectingGiftLimitsByDraftId.fulfilled(body),
          GlobalMessage.actions.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" successfully updated`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(editBulkProspectingGiftLimitsByDraftId.rejected()))),
      ),
    ),
  );

const fetchProspectingGiftLimitsByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(fetchProspectingGiftLimitsById.pending),
    switchMap(({ payload: campaignId }) =>
      combineLatest(
        apiService.get(`/api/v1/campaigns/${campaignId}/gift-limits`, null, true),
        action$.pipe(ofType(CampaignSettings.actions.loadTeamMembersRequest.fulfilled)),
      ).pipe(
        map(
          ([response, teamMemberAction]: [
            unknown,
            ReturnType<typeof CampaignSettings.actions.loadTeamMembersRequest.fulfilled>,
          ]) =>
            fetchProspectingGiftLimitsById.fulfilled(
              combineTeamMembersWithGiftLimits(teamMemberAction.payload, (response as TGiftLimitsResponse).data),
            ),
        ),
        catchError(handleError(handlers.handleAnyError(fetchProspectingGiftLimitsById.rejected()))),
      ),
    ),
  );

const updateProspectingGiftLimitsByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingGiftLimitsById.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { campaignId, ...body } }, state]) =>
      apiService.post(`/api/v1/campaigns/${campaignId}/gift-limits`, { body }, true).pipe(
        mergeMap(() => [
          updateProspectingGiftLimitsById.fulfilled(body),
          GlobalMessage.actions.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" successfully updated`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateProspectingGiftLimitsById.rejected()))),
      ),
    ),
  );

const updateProspectingGiftLimitsRemainingByIdEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateProspectingGiftingLimitsRemainingById.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { campaignId, ...body } }, state]) =>
      apiService.post(`/api/v1/campaigns/${campaignId}/gift-limits/remaining`, { body }, true).pipe(
        mergeMap(() => [
          updateProspectingGiftingLimitsRemainingById.fulfilled(body),
          GlobalMessage.actions.showGlobalMessage({
            type: MessageType.Success,
            text: `"${getDetailsData(state)?.campaignName}" successfully updated`,
          }),
        ]),
        catchError(handleError(handlers.handleAnyError(updateProspectingGiftingLimitsRemainingById.rejected()))),
      ),
    ),
  );

const filterProspectingGiftLimitsEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(...[setGiftLimitsSearchFilter, setGiftLimitsSortFilter]),
    debounceTime(300),
    withLatestFrom(state$),
    switchMap(([, state]) =>
      of([]).pipe(
        delay(300),
        mergeMap(() => {
          const teamMembers = CampaignSettings.selectors.getTeamMembers(state);
          const giftLimits = getAllGiftLimits(state);
          const filters = getGiftLimitsFilters(state);

          return [setFilteredGiftLimits(combineAndFilterTeamMembersWithGiftLimits(filters, teamMembers, giftLimits))];
        }),
      ),
    ),
  );

const resetTeamMembersEpic: Epic = action$ =>
  action$.pipe(
    ofType(resetProspectingCampaign),
    map(() => CampaignSettings.actions.resetTeamMembers()),
  );

export default [
  fetchProspectingGiftLimitsByDraftIdEpic,
  updateProspectingGiftLimitsByDraftIdEpic,
  editBulkProspectingGiftLimitsByDraftIdEpic,
  fetchProspectingGiftLimitsByIdEpic,
  updateProspectingGiftLimitsByIdEpic,
  updateProspectingGiftLimitsRemainingByIdEpic,
  filterProspectingGiftLimitsEpic,
  resetTeamMembersEpic,
];
