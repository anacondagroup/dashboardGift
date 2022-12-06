import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { resetBillingUi } from '../ui.actions';

import { BillingTab } from './tab.types';

export type TTabState = {
  currentTab: BillingTab;
};

const initialState: TTabState = {
  currentTab: BillingTab.Overview,
};

export const {
  name,
  reducer: tab,
  actions: { setBillingTab },
  getInitialState,
} = createSlice({
  name: 'tab' as const,
  initialState,
  reducers: {
    setBillingTab: (state, action: PayloadAction<BillingTab>) =>
      Object.assign(state, {
        currentTab: action.payload,
      }),
  },
  extraReducers: builder => builder.addCase(resetBillingUi, () => initialState),
});
