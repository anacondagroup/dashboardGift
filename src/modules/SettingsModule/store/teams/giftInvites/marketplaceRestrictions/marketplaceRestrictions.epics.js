import { ofType } from 'redux-observable';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { mapDescriptionToGiftTypes } from '../../../../helpers/giftTypes.helpers';

import {
  TEAM_GIFT_INVITES_SETTINGS_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST,
  TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST,
} from './marketplaceRestrictions.types';
import {
  teamGiftInvitesSettingsFail,
  teamGiftInvitesSettingSuccess,
  teamSettingsGiftInvitesTypesFail,
  teamSettingsGiftInvitesTypesSuccess,
  teamSettingsGiftInvitesUpdateTypesFail,
  teamSettingsGiftInvitesUpdateTypesSuccess,
  teamSettingsGiftInvitesUpdateVendorsFail,
  teamSettingsGiftInvitesUpdateVendorsSuccess,
  teamSettingsGiftInvitesVendorsFail,
  teamSettingsGiftInvitesVendorsSuccess,
} from './marketplaceRestrictions.actions';

export const loadTeamGiftInvitesSettingsEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(TEAM_GIFT_INVITES_SETTINGS_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${payload}/preview/invites`).pipe(
        map(({ settings }) => teamGiftInvitesSettingSuccess(settings)),
        catchError(errorHandler({ callbacks: teamGiftInvitesSettingsFail })),
      ),
    ),
  );

export const loadTeamGiftInvitesTypesEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(TEAM_SETTINGS_GIFT_INVITES_TYPES_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${payload}/types`).pipe(
        // eslint-disable-next-line camelcase
        map(({ types, available_products_amount }) =>
          teamSettingsGiftInvitesTypesSuccess({
            types: mapDescriptionToGiftTypes(types),
            availableProductsAmount: available_products_amount,
          }),
        ),
        catchError(errorHandler({ callbacks: teamSettingsGiftInvitesTypesFail })),
      ),
    ),
  );

export const updateTeamGiftInvitesTypesEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(TEAM_SETTINGS_GIFT_INVITES_TYPES_UPDATE_REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/teams/${payload.teamId}/types`, {
          body: {
            restricted_product_type_ids: payload.ids,
          },
        })
        .pipe(
          // eslint-disable-next-line camelcase
          mergeMap(({ types, available_products_amount }) => [
            teamSettingsGiftInvitesUpdateTypesSuccess({
              types: mapDescriptionToGiftTypes(types),
              availableProductsAmount: available_products_amount,
            }),
            showGlobalMessage({ type: 'success', text: 'Types has been updated' }),
          ]),
          catchError(errorHandler({ callbacks: teamSettingsGiftInvitesUpdateTypesFail })),
        ),
    ),
  );

export const loadTeamGiftInvitesVendorsEpic = (action$, state$, { apiService, messagesService: { errorHandler } }) =>
  action$.pipe(
    ofType(TEAM_SETTINGS_GIFT_INVITES_VENDORS_REQUEST),
    mergeMap(({ payload }) =>
      apiService.get(`/enterprise/dashboard/settings/teams/${payload}/vendors`).pipe(
        // eslint-disable-next-line camelcase
        map(({ vendors, available_products_amount }) =>
          teamSettingsGiftInvitesVendorsSuccess({ vendors, availableProductsAmount: available_products_amount }),
        ),
        catchError(errorHandler({ callbacks: teamSettingsGiftInvitesVendorsFail })),
      ),
    ),
  );

export const updateTeamGiftInvitesVendorsEpic = (
  action$,
  state$,
  { apiService, messagesService: { errorHandler, showGlobalMessage } },
) =>
  action$.pipe(
    ofType(TEAM_SETTINGS_GIFT_INVITES_VENDORS_UPDATE_REQUEST),
    mergeMap(({ payload }) =>
      apiService
        .post(`/enterprise/dashboard/settings/teams/${payload.teamId}/vendors`, {
          body: {
            restricted_brand_ids: payload.brandIds,
            restricted_merchant_ids: payload.merchantIds,
          },
        })
        .pipe(
          // eslint-disable-next-line camelcase
          mergeMap(({ vendors, available_products_amount }) => [
            teamSettingsGiftInvitesUpdateVendorsSuccess({
              vendors,
              availableProductsAmount: available_products_amount,
            }),
            showGlobalMessage({ type: 'success', text: 'Vendors has been updated' }),
          ]),
          catchError(errorHandler({ callbacks: teamSettingsGiftInvitesUpdateVendorsFail })),
        ),
    ),
  );

export const marketplaceRestrictionsEpics = [
  loadTeamGiftInvitesSettingsEpic,
  loadTeamGiftInvitesTypesEpic,
  updateTeamGiftInvitesTypesEpic,
  loadTeamGiftInvitesVendorsEpic,
  updateTeamGiftInvitesVendorsEpic,
];
