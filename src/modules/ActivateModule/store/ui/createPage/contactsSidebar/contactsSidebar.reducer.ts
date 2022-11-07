import { createReducer } from 'redux-act';

import { ContactsUploadingStates, SourceTypes } from '../../../../constants/recipientSidebar.constants';
import { clearActivateModuleState, loadActivateSuccess } from '../../../activate.actions';
import { isActivate, isFullActivate } from '../../../activate.types';

import {
  clearContactsSidebar,
  closeContactsUploadingSidebar,
  openContactsUploadingSidebar,
  setContactsUploadingSectionState,
  setSourceType,
} from './contactsSidebar.actions';
import {
  calculateContactsUploadingSectionState,
  calculateContactsUploadingSectionStateForEditorMode,
  defineContactsSourceType,
} from './contactsSidebar.helpers';

export interface IContactsSidebarState {
  isOpened: boolean;
  state: ContactsUploadingStates;
  source: SourceTypes | null;
}

export const initialState: IContactsSidebarState = {
  isOpened: false,
  state: ContactsUploadingStates.ChooseSource,
  source: null,
};

export const contactsSidebar = createReducer({}, initialState);

contactsSidebar.on(loadActivateSuccess, (state, payload) => {
  const isActivateCampaign = isActivate(payload);

  if (isActivateCampaign && payload.recipients.attributes) {
    return {
      ...state,
      state: calculateContactsUploadingSectionStateForEditorMode(payload.recipients.attributes),
      source: defineContactsSourceType(payload.recipients.attributes),
    };
  }

  if (payload.recipients.attributes) {
    return {
      ...state,
      state: calculateContactsUploadingSectionState(payload.recipients.attributes),
      source: defineContactsSourceType(payload.recipients.attributes),
    };
  }
  /*
   * If it's active activate campaign (aka New Campaign Editor) we need to hardcode allowed source type for bulk uploading
   * For now only xlsx file uploading is supported
   * */
  if (isFullActivate(payload)) {
    return {
      ...state,
      state: !payload.recipients.sourceType ? ContactsUploadingStates.ChooseSource : ContactsUploadingStates.XLSX,
      source: SourceTypes.File,
    };
  }
  return {
    ...initialState,
  };
});

contactsSidebar.on(clearActivateModuleState, () => ({
  ...initialState,
}));

contactsSidebar.on(clearContactsSidebar, state => ({
  ...state,
  state: ContactsUploadingStates.ChooseSource,
  source: null,
}));

contactsSidebar.on(openContactsUploadingSidebar, state => ({
  ...state,
  isOpened: true,
}));
contactsSidebar.on(closeContactsUploadingSidebar, state => ({
  ...state,
  isOpened: false,
}));

contactsSidebar.on(setSourceType, (state, payload) => ({
  ...state,
  state: payload === SourceTypes.File ? ContactsUploadingStates.XLSX : ContactsUploadingStates.Integration,
  source: payload,
}));

contactsSidebar.on(setContactsUploadingSectionState, (state, payload) => ({
  ...state,
  state: payload,
}));
