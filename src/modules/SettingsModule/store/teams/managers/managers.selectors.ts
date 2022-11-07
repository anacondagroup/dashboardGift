import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

const pathToManagersState = (state: IRootState) => state.settings.teams.managers;

export const getIsLoading = pipe(pathToManagersState, state => state.isLoading);

export const getManagers = pipe(pathToManagersState, state => state.managers);
