import { createReducer } from 'redux-act';

import * as actions from './customFields.actions';
import { TCustomField, TCustomFieldFormErrors, TFakeCustomField } from './customFields.types';
import { generateFakeCustomFields } from './customFields.helpers';

export interface ICustomFieldState {
  isLoading: boolean;
  isLoaded: boolean;
  list: Array<TCustomField | TFakeCustomField>;
  addFieldFormErrors: TCustomFieldFormErrors;
}

export const initialState: ICustomFieldState = {
  isLoading: false,
  isLoaded: false,
  list: generateFakeCustomFields(5),
  addFieldFormErrors: {},
};

const customFields = createReducer<ICustomFieldState>({}, initialState);

customFields.on(actions.getCustomFields, state => ({
  ...state,
  isLoading: true,
}));

customFields.on(actions.getCustomFieldsSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  isLoaded: true,
  list: payload,
}));

customFields.on(actions.getCustomFieldsFail, state => ({
  ...state,
  list: [],
  isLoading: false,
  isLoaded: false,
}));

customFields.on(actions.addCustomField, state => ({
  ...state,
  isLoading: true,
  list: state.list.concat(generateFakeCustomFields(1)),
}));

customFields.on(actions.addCustomFieldSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  list: state.list.filter(customField => !customField.isFake).concat(payload),
}));

customFields.on(actions.addCustomFieldFail, (state, payload) => ({
  ...state,
  isLoading: false,
  list: state.list.filter(customField => !customField.isFake),
  addFieldFormErrors: payload,
}));

customFields.on(actions.updateCustomField, state => ({
  ...state,
  isLoading: true,
}));

customFields.on(actions.updateCustomFieldSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  list: state.list.map(field => (field.name === payload.name ? payload : field)),
}));

customFields.on(actions.updateCustomFieldFail, state => ({
  ...state,
  isLoading: false,
}));

customFields.on(actions.deleteCustomField, state => ({
  ...state,
  isLoading: true,
}));

customFields.on(actions.deleteCustomFieldSuccess, (state, payload) => ({
  ...state,
  isLoading: false,
  list: state.list.filter(field => field.name !== payload),
}));

customFields.on(actions.deleteCustomFieldFail, state => ({
  ...state,
  isLoading: false,
}));

export { customFields };
