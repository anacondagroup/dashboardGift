import {
  ALL_CUSTOM_TEMPLATES_LOAD_FAIL,
  ALL_CUSTOM_TEMPLATES_LOAD_REQUEST,
  ALL_CUSTOM_TEMPLATES_LOAD_SUCCESS,
  CREATE_NEW_CUSTOM_TEMPLATE,
  CREATE_NEW_CUSTOM_TEMPLATE_FAIL,
  CREATE_NEW_CUSTOM_TEMPLATE_REQUEST,
  CREATE_NEW_CUSTOM_TEMPLATE_SUCCESS,
  DELETE_CUSTOM_TEMPLATE_FAIL,
  DELETE_CUSTOM_TEMPLATE_REQUEST,
  DELETE_CUSTOM_TEMPLATE_SUCCESS,
  DISCARD_NEW_CUSTOM_TEMPLATE,
  UPDATE_CUSTOM_TEMPLATE_FAIL,
  UPDATE_CUSTOM_TEMPLATE_REQUEST,
  UPDATE_CUSTOM_TEMPLATE_SUCCESS,
} from './customTemplates.types';

export const createNewCustomTemplate = () => ({
  type: CREATE_NEW_CUSTOM_TEMPLATE,
});

export const discardNewCustomTemplate = () => ({
  type: DISCARD_NEW_CUSTOM_TEMPLATE,
});

export const createNewCustomTemplateRequest = payload => ({
  type: CREATE_NEW_CUSTOM_TEMPLATE_REQUEST,
  payload,
});

export const createNewCustomTemplateSuccess = () => ({
  type: CREATE_NEW_CUSTOM_TEMPLATE_SUCCESS,
});

export const createNewCustomTemplateFail = errors => ({
  type: CREATE_NEW_CUSTOM_TEMPLATE_FAIL,
  payload: errors,
});

export const loadCustomTemplatesRequest = teamId => ({
  type: ALL_CUSTOM_TEMPLATES_LOAD_REQUEST,
  payload: teamId,
});

export const loadCustomTemplatesSuccess = templates => ({
  type: ALL_CUSTOM_TEMPLATES_LOAD_SUCCESS,
  payload: templates,
});

export const loadCustomTemplatesFail = error => ({
  type: ALL_CUSTOM_TEMPLATES_LOAD_FAIL,
  payload: error,
});

export const updateCustomTemplateRequest = payload => ({
  type: UPDATE_CUSTOM_TEMPLATE_REQUEST,
  payload,
});

export const updateCustomTemplateSuccess = () => ({
  type: UPDATE_CUSTOM_TEMPLATE_SUCCESS,
});

export const updateCustomTemplateFail = errors => ({
  type: UPDATE_CUSTOM_TEMPLATE_FAIL,
  payload: errors,
});

export const deleteCustomTemplateRequest = payload => ({
  type: DELETE_CUSTOM_TEMPLATE_REQUEST,
  payload,
});

export const deleteCustomTemplateSuccess = templates => ({
  type: DELETE_CUSTOM_TEMPLATE_SUCCESS,
  payload: templates,
});

export const deleteCustomTemplateFail = error => ({
  type: DELETE_CUSTOM_TEMPLATE_FAIL,
  payload: error,
});
