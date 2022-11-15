import { handlers, gatewayApi } from '@alycecom/services';
import { ofType } from '@alycecom/utils';
import { Epic, ofType as nativeOfType } from 'redux-observable';
import { catchError, delay, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { CreateGift, Features, User } from '@alycecom/modules';
import { giftUnexpire } from '@alycecom/modules/dist/CreateGift/store/gift/gift.actions';

import { convertUtilizationsToDollars } from '../../helpers/budget.helpers';

import { loadTeamBudgetUtilization } from './budgetUtilization.actions';
import { IBudgetUtilizationByTeam } from './budgetUtilization.types';

const loadTeamBudgetUtilizationsEpic: Epic = (action$, _, { apiGateway }) =>
  action$.pipe(
    ofType(loadTeamBudgetUtilization.pending),
    switchMap(({ payload: { teamId } }) =>
      apiGateway.get(`/budget/team/${teamId}/membersUtilization`, null, true).pipe(
        map((response: { data: IBudgetUtilizationByTeam[] }) =>
          loadTeamBudgetUtilization.fulfilled(convertUtilizationsToDollars(response.data)),
        ),
        catchError(apiGateway.handleError(handlers.handleAnyError(loadTeamBudgetUtilization.rejected()))),
      ),
    ),
  );

const giftSendSideEffect: Epic = (action$, state$) =>
  action$.pipe(
    nativeOfType(
      CreateGift.actionTypes.GIFT_CREATE_SEND_SUCCESS,
      CreateGift.actionTypes.GIFT_EXPIRE_SUCCESS,
      CreateGift.actionTypes.GIFT_CANCEL_SUCCESS,
      giftUnexpire.fulfilled.getType(),
    ),
    withLatestFrom(state$),
    delay(1000),
    map(([, state]) => {
      const userId = User.selectors.getUserId(state);
      const hasBudgetManagementLimit = Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP)(state);

      return gatewayApi.endpoints.getBudgetUtilizationByUserId.initiate(
        { userId },
        { subscribe: false, forceRefetch: hasBudgetManagementLimit },
      );
    }),
  );

export const budgetUtilizationEpics = [loadTeamBudgetUtilizationsEpic, giftSendSideEffect];
