import { Epic } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { ofType } from '@alycecom/utils';
import { handleError, handlers, MessageType, showGlobalMessage } from '@alycecom/services';

import { IGeneralCampaignSettings } from './general.types';
import {
  campaignGeneralSettingsLoadSuccess,
  campaignGeneralSettingsLoadFail,
  campaignGeneralSetSendAsLoadFail,
  campaignGeneralSetSendAsLoadSuccess,
  campaignNotificationSaveSuccess,
  campaignNotificationSaveFail,
  campaignNameSaveSuccess,
  campaignNameSaveFail,
  campaignGiftResearchOptionsSaveSuccess,
  campaignGiftResearchOptionsSaveFail,
  setDisableCampaignSuccess,
  setDisableCampaignFail,
  campaignSettingsOwnerSaveSuccess,
  campaignSettingsOwnerSaveFail,
  campaignLinkExpirationDateSaveSuccess,
  campaignLinkExpirationDateSaveFail,
  campaignGeneralSettingsLoadRequest,
  campaignNotificationSaveRequest,
  campaignGeneralSetSendAsLoadRequest,
  campaignNameSaveRequest,
  campaignSettingsOwnerSaveRequest,
  campaignGiftResearchOptionsSaveRequest,
  setDisableCampaign,
  campaignLinkExpirationDateSaveRequest,
  updateCampaignPurposeRequest,
  updateCampaignPurposeSuccess,
  updateCampaignPurposeFail,
  updateCampaignSpecificTeamMembers,
} from './general.actions';

export const loadCampaignGeneralSettingsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignGeneralSettingsLoadRequest),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/campaigns/${payload}/general`).pipe(
        map((response: { settings: IGeneralCampaignSettings }) =>
          campaignGeneralSettingsLoadSuccess({ campaign: response.settings }),
        ),
        catchError(handleError(handlers.handleAnyError(campaignGeneralSettingsLoadFail))),
      ),
    ),
  );

export const campaignNotificationsSettingsSaveEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignNotificationSaveRequest),
    mergeMap(({ payload: { campaignId, notifications } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/notifications`, {
          body: {
            campaign_id: campaignId,
            ...notifications,
          },
        })
        .pipe(
          mergeMap(() => [
            campaignNotificationSaveSuccess(),
            showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(campaignNotificationSaveFail))),
        ),
    ),
  );

export const campaignGeneralSettingsSetSendAsEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignGeneralSetSendAsLoadRequest),
    mergeMap(({ payload: { campaignId, userId, canOverrideFrom } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/${campaignId}/set-send-as`, {
          body: userId
            ? {
                user_id: userId,
                can_override_from: !!canOverrideFrom,
              }
            : { user_id: userId },
        })
        .pipe(
          mergeMap((response: { settings: IGeneralCampaignSettings }) => [
            campaignGeneralSetSendAsLoadSuccess({ campaign: response.settings }),
            showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(campaignGeneralSetSendAsLoadFail))),
        ),
    ),
  );

export const campaignNameSaveEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignNameSaveRequest),
    mergeMap(({ payload: { campaignId, campaignName } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/update/name`, {
          body: {
            campaign_id: campaignId,
            campaign_name: campaignName,
          },
        })
        .pipe(
          mergeMap(() => [
            campaignNameSaveSuccess({ campaignName }),
            showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(campaignNameSaveFail))),
        ),
    ),
  );

export const campaignTeamMembersSaveEpic: Epic = (action$, _, { apiService }) =>
  action$.pipe(
    ofType(updateCampaignSpecificTeamMembers.pending),
    mergeMap(({ payload: { campaignId, teamMemberIds } }) =>
      apiService
        .put(`/enterprise/dashboard/campaigns/${campaignId}/team-members`, {
          body: {
            team_members: teamMemberIds,
          },
        })
        .pipe(
          mergeMap(() => [
            updateCampaignSpecificTeamMembers.fulfilled(),
            showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateCampaignSpecificTeamMembers.rejected()))),
        ),
    ),
  );

export const campaignOwnerSaveEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignSettingsOwnerSaveRequest),
    mergeMap(({ payload: { campaignId, ownerId } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/${campaignId}/update-owner`, {
          body: {
            ownerId,
          },
        })
        .pipe(
          mergeMap(() => [
            campaignSettingsOwnerSaveSuccess(),
            showGlobalMessage({ text: 'Campaign owner has been saved.', type: MessageType.Success }),
            campaignGeneralSettingsLoadRequest(campaignId),
          ]),
          catchError(handleError(handlers.handleAnyError(campaignSettingsOwnerSaveFail))),
        ),
    ),
  );

export const campaignGiftResearchOptionSave: Epic = (action$, state$, { generalSettingsService }) =>
  action$.pipe(
    ofType(campaignGiftResearchOptionsSaveRequest),
    mergeMap(({ payload: { campaignId, option } }) =>
      generalSettingsService.setCampaignProposalSetting(campaignId, option).pipe(
        mergeMap(() => [
          campaignGiftResearchOptionsSaveSuccess({ option }),
          showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(campaignGiftResearchOptionsSaveFail))),
      ),
    ),
  );

export const campaignSetAvailabilitySettingEpic: Epic = (action$, state$, { generalSettingsService }) =>
  action$.pipe(
    ofType(setDisableCampaign),
    mergeMap(({ payload: { campaignId, isDisabled } }) =>
      generalSettingsService.setCampaignAvailabilitySetting(campaignId, isDisabled).pipe(
        mergeMap(() => [
          setDisableCampaignSuccess(),
          showGlobalMessage({ text: 'Changes saved', type: MessageType.Success }),
        ]),
        catchError(handleError(handlers.handleAnyError(setDisableCampaignFail))),
      ),
    ),
  );

export const campaignLinkExpirationDateSaveEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(campaignLinkExpirationDateSaveRequest),
    mergeMap(({ payload: { campaignId, expirationDate } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/${campaignId}/update-expiration-date`, {
          body: { expirationDate },
        })
        .pipe(
          mergeMap(() => [
            campaignLinkExpirationDateSaveSuccess({ expirationDate }),
            showGlobalMessage({ text: 'Campaign link expiration date has been saved.', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(campaignLinkExpirationDateSaveFail))),
        ),
    ),
  );

export const updateCampaignPurposeEpic: Epic = (action$, state$, { apiService }) =>
  action$.pipe(
    ofType(updateCampaignPurposeRequest),
    mergeMap(({ payload: { campaignId, purpose, numberOfRecipients } }) =>
      apiService
        .post(`/enterprise/dashboard/settings/campaigns/${campaignId}/update-campaign-purpose`, {
          body: { campaignPurpose: purpose, numberOfRecipients },
        })
        .pipe(
          mergeMap(() => [
            updateCampaignPurposeSuccess({ purpose, numberOfRecipients }),
            showGlobalMessage({ text: 'Campaign purpose has been saved.', type: MessageType.Success }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateCampaignPurposeFail))),
        ),
    ),
  );

export const campaignGeneralSettingsEpics = [
  loadCampaignGeneralSettingsEpic,
  campaignGeneralSettingsSetSendAsEpic,
  campaignNotificationsSettingsSaveEpic,
  campaignNameSaveEpic,
  campaignGiftResearchOptionSave,
  campaignSetAvailabilitySettingEpic,
  campaignOwnerSaveEpic,
  campaignLinkExpirationDateSaveEpic,
  updateCampaignPurposeEpic,
  campaignTeamMembersSaveEpic,
];
