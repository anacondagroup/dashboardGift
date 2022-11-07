import { Epic } from 'redux-observable';
import { Action } from 'redux';
import { tap, flatMap, map, take, switchMap } from 'rxjs/operators';
import { Auth, CommonData, Currencies, Features, Security, Timezones, User } from '@alycecom/modules';
import { TrackEvent } from '@alycecom/services';
import moment from 'moment';
import { ofType } from '@alycecom/utils';

import { fetchPermissions } from '../common/permissions/permissions.actions';
import { loadTeamsRequest } from '../teams/teams.actions';
import { loadCampaignsRequest } from '../campaigns/campaigns.actions';

export const loadUserAfterAuthEpic: Epic = action$ =>
  action$.pipe(
    ofType(Auth.actions.authComplete),
    flatMap(() => [
      User.actions.loadUserRequest(),
      fetchPermissions(),
      CommonData.actions.commonLoadRequest(),
      loadTeamsRequest(),
      loadCampaignsRequest(),
      Security.securityLoadRequest(),
      Features.actions.loadFeaturesRequest(),
      Timezones.actions.loadTimezonesRequest(),
      Currencies.actions.loadCurrenciesRequest(),
    ]),
  );

export const setRollbarEpic: Epic = action$ =>
  action$.pipe(
    ofType(User.actions.loadUserSuccess),
    take(1),
    tap(({ payload: user }) => {
      if (window.Rollbar) {
        const rollbarConfiguration: IRollbarConfig = {
          payload: {
            person: {
              id: user.id,
              username: `${user.first_name} ${user.last_name}`,
              email: user.email,
              org_id: user.organisation.id,
              org_name: user.organisation.name,
            },
          },
        };
        window.Rollbar.configure(rollbarConfiguration);
      }
    }),
  );

export const setUserIdentityEpic: Epic = (action$, state$) =>
  action$.pipe(
    ofType(User.actions.loadUserSuccess),
    switchMap(({ payload: user }) => {
      const adminId = Auth.selectors.getLoginAsAdminId(state$.value);
      const actions: Action[] = [
        TrackEvent.actions.setIdentity({
          id: String(user.id),
          traits: {
            company: {
              id: user.organisation.id,
              name: user.organisation.name,
            },
          },
        }),
        TrackEvent.actions.addUserProperties({
          org_id: user.organisation.id,
          is_dashboard_user: true,
          team_name: user.default_team.name,
          joinedAt: moment(user.joinedAt).toISOString(),
          abGroup: user.id % 2 === 1 ? 'A group' : 'B group',
          orgName: user.organisation.name,
        }),
        TrackEvent.actions.trackEvent({
          name: 'Dashboard visited',
          options: { adminId, traits: { adminId } },
        }),
      ];
      if (user.first_access) {
        actions.push(
          TrackEvent.actions.trackEvent({
            name: 'Dashboard visited - first access',
            payload: { orgId: user.organisation.id },
          }),
        );
      }
      return actions;
    }),
  );

export const setupUserFeaturesInSegmentEpic: Epic = action$ =>
  action$.pipe(
    ofType(Features.actions.loadFeaturesSuccess),
    map(({ payload }) =>
      TrackEvent.actions.addUserProperties({
        featureFlags: payload,
      }),
    ),
  );

export default [loadUserAfterAuthEpic, setRollbarEpic, setUserIdentityEpic, setupUserFeaturesInSegmentEpic];
