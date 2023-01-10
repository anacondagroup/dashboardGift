import * as R from 'ramda';
import { createSelector, Selector } from 'reselect';
import { Currencies, ICurrency, User } from '@alycecom/modules';

import { IRootState } from '../root.types';

import { ITeam } from './teams.types';

const getTeamsState = (state: IRootState) => state.teams;

export const getTeams = R.pipe(getTeamsState, state => state.teams);

// @ts-ignore
export const getUnarchivedTeams = R.pipe(getTeamsState, state => state.teams.filter(team => team.archivedAt !== null));

export const getIsLoaded = R.pipe(getTeamsState, state => state.isLoaded);

export const makeGetTeamById = (teamId: string): Selector<IRootState, ITeam | undefined> =>
  createSelector(getTeams, teams => teams.find(team => team.id === Number(teamId)));

export const getTeamNames = createSelector(getTeams, teams => teams.map(team => team.name));

export const makeGetCurrencyByTeamId = (teamId: string): Selector<IRootState, ICurrency | null> =>
  createSelector(makeGetTeamById(teamId), Currencies.selectors.getCurrenciesMap, (team, currencies) => {
    if (!team) {
      return null;
    }
    const currency = currencies[team.settings.currency_id];
    return currency || null;
  });

export const getTeamsByAdmin = (managedTeams: number[]): Selector<IRootState, ITeam[]> =>
  createSelector(getTeams, teams =>
    teams.reduce((result: ITeam[], team) => {
      if (managedTeams.includes(team.id)) {
        result.push(team);
      }
      return result;
    }, []),
  );

export const getTeamSetting = (
  teamId: string,
  settingKey: string,
): Selector<IRootState, number | boolean | undefined> =>
  createSelector(makeGetTeamById(teamId), R.pathOr(undefined, ['settings', settingKey]));

export const makeCanEditTeamById = (teamId: string): Selector<IRootState, boolean> =>
  createSelector(
    User.selectors.getUser,
    getTeamSetting(teamId, 'enterprise_mode_enabled'),
    (user, isEnterprise) =>
      Array.isArray(user.canManageTeams) && user.canManageTeams.includes(Number(teamId)) && Boolean(isEnterprise),
  );
