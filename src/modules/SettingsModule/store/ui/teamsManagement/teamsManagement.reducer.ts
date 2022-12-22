import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TTeamsManagementState = {
  isArchiveTeamModalOpen: boolean;
  selectedTeamId: number | null;
};

export const initialState: TTeamsManagementState = {
  isArchiveTeamModalOpen: false,
  selectedTeamId: null,
};

export const {
  reducer,
  name,
  actions: { setArchiveTeamModalOpenStatus, setSelectedTeamId, resetState },
  getInitialState,
} = createSlice({
  name: 'teamsManagement' as const,
  initialState,
  reducers: {
    setArchiveTeamModalOpenStatus: (state, action: PayloadAction<boolean>) =>
      Object.assign(state, {
        isArchiveTeamModalOpen: action.payload,
      }),
    setSelectedTeamId: (state, action: PayloadAction<number>) =>
      Object.assign(state, {
        selectedTeamId: action.payload,
      }),
    resetState: state => Object.assign(state, initialState),
  },
});
