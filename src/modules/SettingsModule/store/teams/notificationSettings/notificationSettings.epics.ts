import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, switchMap, withLatestFrom, map } from 'rxjs/operators';
import { handleError, handlers, IResponse } from '@alycecom/services';
import { mergeMap } from 'rxjs/operators/index';

import { IRootState } from '../../../../../store/root.types';
import { setTeamSidebarStep } from '../teamOperation/teamOperation.actions';

import { getNotificationSettings, updateNotificationSettings } from './notificationSettings.actions';
import { TeamBudgetUtilizationThresholdResponse, notificationOptions } from './notificationSettings.types';
import {
  getAdminNotifyOption,
  getIsAdminNotify,
  getIsSenderNotify,
  getSenderNotifyOption,
} from './notificationSettings.selectors';

export const getNotificationSettingsEpic: Epic = (action$, state$, { apiGateway }) =>
  action$.pipe(
    ofType(getNotificationSettings.pending),
    switchMap(({ payload: teamId }) =>
      apiGateway.get(`/budget/team/${teamId}/utilization-threshold`, null, true).pipe(
        map((data: IResponse<TeamBudgetUtilizationThresholdResponse>) => getNotificationSettings.fulfilled(data.data)),
        catchError(handleError(handlers.handleAnyError(getNotificationSettings.rejected()))),
      ),
    ),
  );

const prepareNotificationSettings = (state: IRootState) => {
  const adminKey = getAdminNotifyOption(state);
  const senderKey = getSenderNotifyOption(state);
  const adminOption = notificationOptions[adminKey || 'test'];
  const senderOption = notificationOptions[senderKey || 'test'];
  return {
    admin: {
      notifyEnabled: getIsAdminNotify(state),
      notifyAtPercent: adminOption.percent,
      notifyType: adminOption.type,
    },
    member: {
      notifyEnabled: getIsSenderNotify(state),
      notifyAtPercent: senderOption.percent,
      notifyType: senderOption.type,
    },
  };
};

export const updateNotificationSettingsEpic: Epic = (
  action$,
  state$,
  { apiGateway, messagesService: { showGlobalMessage } },
) =>
  action$.pipe(
    ofType(updateNotificationSettings.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: teamId }, state]) =>
      apiGateway
        .put(
          `/budget/team/${teamId}/utilization-threshold`,
          {
            body: prepareNotificationSettings(state),
          },
          true,
        )
        .pipe(
          mergeMap(() => [
            updateNotificationSettings.fulfilled(),
            showGlobalMessage({ text: `Notification settings has been saved`, type: 'success' }),
            setTeamSidebarStep({ step: null }),
          ]),
          catchError(handleError(handlers.handleAnyError(updateNotificationSettings.rejected()))),
        ),
    ),
  );

export const notificationSettingsEpic = [getNotificationSettingsEpic, updateNotificationSettingsEpic];
