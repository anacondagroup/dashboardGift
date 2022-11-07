import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToTeamOperationState = (state: IRootState) => state.settings.teams.teamOperation;

export const getIsTeamSidebarOpen = pipe(pathToTeamOperationState, state => state.teamSidebarStep !== null);

export const getTeamSidebarStep = pipe(pathToTeamOperationState, state => state.teamSidebarStep);

export const getTeamSidebarTeam = pipe(pathToTeamOperationState, state => state.team);

export const getTeamId = pipe(pathToTeamOperationState, state => state.teamId);

export const getPrevTeamSidebarStep = pipe(pathToTeamOperationState, state => state.prevTeamSidebarStep);
