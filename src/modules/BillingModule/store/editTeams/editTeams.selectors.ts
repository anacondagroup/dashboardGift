import { pipe } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

const editTeamsState = (state: IRootState) => state.billing.editTeams;

export const getEditTeamsModalIsOpen = pipe(editTeamsState, state => state.isEditTeamsModalOpen);

export const getIsSavingInProgress = pipe(editTeamsState, state => state.updateTeamsInProgress === StateStatus.Pending);

export const getIsLoadingTeamsList = pipe(editTeamsState, state => state.loadingTeamsList === StateStatus.Pending);

export const getSearch = pipe(editTeamsState, state => state.search);

export const getTeamsList = pipe(editTeamsState, state => state.teams);

export const getInitialTeamsList = pipe(editTeamsState, state => state.initialTeams);

export const getFilterGrouped = pipe(editTeamsState, state => state.filterGrouped);

export const getEditCurrentGroupIdToEditTeams = pipe(editTeamsState, state => state.currentGroupIdToEditTeams);
