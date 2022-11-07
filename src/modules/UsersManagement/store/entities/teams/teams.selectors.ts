import { pipe, propEq } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { teamsAdapter, TTeamsState } from './teams.reducer';

const getTeamsState = (state: IRootState): TTeamsState => state.usersManagement.entities.teams;

const selectors = teamsAdapter.getSelectors(getTeamsState);

export const getIsTeamsLoading = pipe(getTeamsState, propEq('status', StateStatus.Pending));
export const getIsTeamsLoaded = pipe(getTeamsState, propEq('status', StateStatus.Fulfilled));
export const getTeams = selectors.getAll;
export const getTeamsMap = selectors.getEntities;
export const getTeamIds = selectors.getIds;
