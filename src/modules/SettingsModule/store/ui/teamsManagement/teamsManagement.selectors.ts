import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { name, TTeamsManagementState } from './teamsManagement.reducer';

const getTeamsManagementState = (state: IRootState): TTeamsManagementState => state.settings.ui[name];

export const getIsArchiveTeamModalOpen = pipe(getTeamsManagementState, state => state.isArchiveTeamModalOpen);

export const getSelectedTeamId = pipe(getTeamsManagementState, state => state.selectedTeamId);
