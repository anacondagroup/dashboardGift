import { createReducer } from 'redux-act';

import * as actions from './template.actions';
import { ITemplate } from './template.types';

export interface ITemplateState {
  isLoaded: boolean;
  isLoading: boolean;
  errors: Record<string, unknown>;
  templates: ITemplate[];
}

export const initialState: ITemplateState = {
  isLoaded: false,
  isLoading: false,
  errors: {},
  templates: [],
};

const reducer = createReducer({}, initialState);

reducer.on(actions.getTemplates, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(actions.getTemplatesSuccess, (state, payload) => ({
  ...state,
  isLoaded: true,
  isLoading: false,
  templates: payload,
}));
reducer.on(actions.getTemplatesFail, state => ({
  ...state,
  isLoaded: false,
  isLoading: false,
}));

reducer.on(actions.saveTemplate, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(actions.saveTemplateSuccess, (state, payload) => {
  const templates = state.templates.map(t =>
    t.id === payload.id ? { ...payload, isDefault: true } : { ...t, isDefault: false },
  );
  return {
    ...state,
    isLoading: false,
    templates,
  };
});
reducer.on(actions.saveTemplateFail, (state, payload) => ({
  ...state,
  isLoading: false,
  errors: payload,
}));

reducer.on(actions.clearTemplate, state => ({
  ...state,
  isLoading: true,
}));
reducer.on(actions.clearTemplateSuccess, state => ({
  ...state,
  isLoading: false,
}));
reducer.on(actions.clearTemplateFail, state => ({
  ...state,
  isLoading: false,
}));

reducer.on(actions.setErrors, (state, payload) => ({
  ...state,
  errors: {
    ...state.errors,
    ...payload,
  },
}));

export { reducer };
