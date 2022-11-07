import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { catchError, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { handleError, handlers, MessageType, TrackEvent } from '@alycecom/services';
import { Auth, Features } from '@alycecom/modules';

import { setTeamSidebarStep } from '../teamOperation/teamOperation.actions';
import { loadTeamsSettingsRequest } from '../teams/teams.actions';
import { TeamSidebarStep } from '../teamOperation/teamOperation.types';

import { renameTeam, createTeam } from './team.actions';

export const createTeamEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(createTeam.pending),
    withLatestFrom(state$),
    switchMap(([{ payload }, state]) =>
      apiService.post('/api/v1/teams', { body: payload }, true).pipe(
        mergeMap(({ data }) => {
          const adminId = Auth.selectors.getLoginAsAdminId(state);
          const hasBudgetManagementSetup = Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP)(
            state,
          );

          const sideBarStep: TeamSidebarStep | null = hasBudgetManagementSetup ? TeamSidebarStep.TeamBudget : null;

          return [
            createTeam.fulfilled(),
            setTeamSidebarStep({ step: sideBarStep, teamId: data.teamId }),
            loadTeamsSettingsRequest(),
            TrackEvent.actions.trackEvent({
              name: 'New team — created',
              payload: { adminId },
            }),
            showGlobalMessage({
              text: `Success! You created a new team.`,
              type: MessageType.Success,
            }),
          ];
        }),
        catchError(
          handleError(
            handlers.handleAnyError(
              createTeam.rejected,
              showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
            ),
          ),
        ),
      ),
    ),
  );

export const renameTeamEpic: Epic = (action$, state$, { apiService, messagesService: { showGlobalMessage } }) =>
  action$.pipe(
    ofType(renameTeam.pending),
    withLatestFrom(state$),
    switchMap(([{ payload: { teamId, ...body } }, state]) =>
      apiService
        .patch(
          `/enterprise/dashboard/settings/teams/${teamId}/settings`,
          { body: { teamName: body.name, groupId: body.groupId } },
          true,
        )
        .pipe(
          mergeMap(() => {
            const adminId = Auth.selectors.getLoginAsAdminId(state$.value);
            const hasBudgetManagementSetup = Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_SETUP)(
              state,
            );

            const sideBarStep: TeamSidebarStep | null = hasBudgetManagementSetup ? TeamSidebarStep.TeamBudget : null;

            return [
              renameTeam.fulfilled(),
              setTeamSidebarStep({ step: sideBarStep, teamId }),
              loadTeamsSettingsRequest(),
              TrackEvent.actions.trackEvent({
                name: 'Team — renamed',
                payload: { adminId },
              }),
              showGlobalMessage({
                text: `Success! Changes have been saved.`,
                type: MessageType.Success,
              }),
            ];
          }),
          catchError(
            handleError(
              handlers.handleAnyError(
                renameTeam.rejected,
                showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }),
              ),
            ),
          ),
        ),
    ),
  );

export const teamEpics = [createTeamEpic, renameTeamEpic];
