import {
  LOAD_TEMPLATES_REQUEST,
  LOAD_TEMPLATES_SUCCESS,
  LOAD_TEMPLATES_FAIL,
  SAVE_TEMPLATE_REQUEST,
  SAVE_TEMPLATE_SUCCESS,
  SAVE_TEMPLATE_FAIL,
  REMOVE_TEMPLATE_REQUEST,
  REMOVE_TEMPLATE_SUCCESS,
  REMOVE_TEMPLATE_FAIL,
  ADD_NEW_TEMPLATE,
  DISCARD_TEMPLATE_ADDING,
  RESET_TEMPLATE_ERRORS,
} from './templates.types';

export const loadTemplatesRequest = search => ({
  type: LOAD_TEMPLATES_REQUEST,
  payload: search,
});

export const loadTemplatesSuccess = templates => ({
  type: LOAD_TEMPLATES_SUCCESS,
  payload: templates,
});

export const loadTemplatesFail = error => ({
  type: LOAD_TEMPLATES_FAIL,
  payload: error,
});

export const saveTemplateRequest = template => ({
  type: SAVE_TEMPLATE_REQUEST,
  payload: template,
});

export const saveTemplatesSuccess = payload => ({
  type: SAVE_TEMPLATE_SUCCESS,
  payload,
});

export const saveTemplatesFail = payload => ({
  type: SAVE_TEMPLATE_FAIL,
  payload,
});

export const removeTemplateRequest = id => ({
  type: REMOVE_TEMPLATE_REQUEST,
  payload: id,
});

export const removeTemplatesSuccess = id => ({
  type: REMOVE_TEMPLATE_SUCCESS,
  payload: id,
});

export const removeTemplatesFail = error => ({
  type: REMOVE_TEMPLATE_FAIL,
  payload: error,
});

export const addNewTemplate = () => ({
  type: ADD_NEW_TEMPLATE,
});

export const discardTemplatesAdding = () => ({
  type: DISCARD_TEMPLATE_ADDING,
});

export const resetTemplateErrors = id => ({
  type: RESET_TEMPLATE_ERRORS,
  payload: id,
});
