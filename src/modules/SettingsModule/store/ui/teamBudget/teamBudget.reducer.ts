import { EntityId } from '@alycecom/utils';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const initialState = {
  isAllUsersSelected: false,
  selectedUserIds: [],
};

export type TTeamBudgetState = {
  isAllUsersSelected: boolean;
  selectedUserIds: EntityId[];
};

export const {
  reducer,
  name,
  actions: { toggleAllUsersSelection, toggleUserSelection, toggleAllUsersAreSelected, resetUsersSelection },
  getInitialState,
} = createSlice({
  name: 'teamBudget' as const,
  initialState: initialState as TTeamBudgetState,
  reducers: {
    toggleAllUsersSelection: (
      state: TTeamBudgetState,
      action: PayloadAction<{ users: EntityId[]; checked: Boolean }>,
    ) => {
      const selectedUserIds = action.payload.checked ? [] : action.payload.users;

      return Object.assign(state, {
        isAllUsersSelected: !action.payload.checked,
        selectedUserIds,
      });
    },
    toggleUserSelection: (
      state: TTeamBudgetState,
      action: PayloadAction<{ user: EntityId; checked: Boolean; totalUsers: number }>,
    ) => {
      const selectedUserIds = action.payload.checked
        ? state.selectedUserIds.filter(selectedUserId => selectedUserId !== action.payload.user)
        : [...state.selectedUserIds, action.payload.user];

      const areAllSelected = selectedUserIds.length === action.payload.totalUsers;

      return Object.assign(state, {
        selectedUserIds,
        isAllUsersSelected: areAllSelected,
      });
    },
    toggleAllUsersAreSelected: (state: TTeamBudgetState) =>
      Object.assign(state, {
        ...state,
        isAllUsersSelected: !state.isAllUsersSelected,
      }),
    resetUsersSelection: (state: TTeamBudgetState) =>
      Object.assign(state, {
        isAllUsersSelected: false,
        selectedUserIds: [],
      }),
  },
});
