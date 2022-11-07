import { Epic } from 'redux-observable';
import { ofType } from '@alycecom/utils';
import { filter, mergeMap } from 'rxjs/operators';

import { resetTeamData } from '../team/team.actions';

import { setTeamSidebarStep } from './teamOperation.actions';

export const closeTeamSidebarEpic: Epic = action$ =>
  action$.pipe(
    ofType(setTeamSidebarStep),
    filter(({ payload }) => payload.step === null),
    mergeMap(() => [resetTeamData()]),
  );

export const teamOperationEpics = [closeTeamSidebarEpic];
