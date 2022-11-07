import { pipe } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

const pathToTeamState = (state: IRootState) => state.settings.teams.team;

export const getStatus = pipe(pathToTeamState, state => state.status);

export const getErrors = pipe(pathToTeamState, state => state.errors);

export const getIsTeamLoading = createSelector(getStatus, status => status === StateStatus.Pending);
