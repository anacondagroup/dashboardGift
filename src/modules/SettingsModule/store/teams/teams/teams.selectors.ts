import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { getSettingsState } from '../../settings.selectors';

import { teamsAdapter } from './teams.reducer';

export const getTeamsSettings = pipe(getSettingsState, state => state.teams);

export const getTeamsState = pipe(getTeamsSettings, state => state.teams);

const selectors = teamsAdapter.getSelectors(getTeamsState);

export const getIsLoading = pipe(getTeamsState, state => state.status === StateStatus.Pending);
export const getIsLoaded = pipe(getTeamsState, state => state.status === StateStatus.Fulfilled);

export const getTeams = selectors.getAll;

export const getTeamById = selectors.getById;

export const getTeamIds = selectors.getIds;

export const getErrors = pipe(getTeamsState, state => state.errors);
