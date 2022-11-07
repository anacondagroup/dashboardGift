import { StateStatus } from '@alycecom/utils';
import { createSlice } from '@reduxjs/toolkit';

import {
  clearActivateModuleState,
  loadActivateFail,
  loadActivateRequest,
  loadActivateSuccess,
} from '../../activate.actions';

export const { reducer: status, getInitialState, name } = createSlice({
  name: 'status' as const,
  initialState: StateStatus.Idle,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(loadActivateRequest.getType(), () => StateStatus.Pending)
      .addCase(loadActivateSuccess.getType(), () => StateStatus.Fulfilled)
      .addCase(loadActivateFail.getType(), () => StateStatus.Rejected)
      .addCase(clearActivateModuleState.getType(), () => StateStatus.Idle),
});

export type TStatusState = ReturnType<typeof getInitialState>;
