import { StateStatus } from '@alycecom/utils';
import { createSlice } from '@reduxjs/toolkit';

import {
  fetchProspectingById,
  fetchProspectingDraftById,
  resetProspectingCampaign,
} from '../../prospectingCampaign.actions';

export const { reducer: status, getInitialState, name } = createSlice({
  name: 'status' as const,
  initialState: StateStatus.Idle,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(fetchProspectingDraftById.pending.getType(), () => StateStatus.Pending)
      .addCase(fetchProspectingDraftById.fulfilled.getType(), () => StateStatus.Fulfilled)
      .addCase(fetchProspectingDraftById.rejected.getType(), () => StateStatus.Rejected)

      .addCase(fetchProspectingById.pending.getType(), () => StateStatus.Pending)
      .addCase(fetchProspectingById.fulfilled.getType(), () => StateStatus.Fulfilled)
      .addCase(fetchProspectingById.rejected.getType(), () => StateStatus.Rejected)

      .addCase(resetProspectingCampaign.getType(), () => StateStatus.Idle),
});

export type TStatusState = ReturnType<typeof getInitialState>;
