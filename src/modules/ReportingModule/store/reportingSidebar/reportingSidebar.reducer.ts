import { createReducer } from 'redux-act';

import { ReportingSidebarStep } from '../reporting/reporting.constants';

import { setIsFormDirty, setSidebarStep } from './reportingSidebar.actions';

export interface ISidebarState {
  prevSidebarStep: ReportingSidebarStep | null;
  sidebarStep: ReportingSidebarStep | null;
  reportToEdit?: number;
  isFormDirty?: boolean;
}

export const initialSidebarState: ISidebarState = {
  prevSidebarStep: null,
  sidebarStep: null,
  reportToEdit: undefined,
  isFormDirty: false,
};

export const reportingSidebar = createReducer<ISidebarState>({}, initialSidebarState);

reportingSidebar.on(setSidebarStep, (state, payload) => ({
  ...state,
  prevSidebarStep: payload ? state.sidebarStep : null,
  sidebarStep: payload.step,
  reportToEdit: payload.id,
}));

reportingSidebar.on(setIsFormDirty, (state, payload) => ({
  ...state,
  isFormDirty: payload,
}));
