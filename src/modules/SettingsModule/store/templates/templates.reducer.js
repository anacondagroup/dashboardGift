import { map, filter } from 'ramda';
import { isString } from '@alycecom/utils';

import {
  updateTemplate,
  updateFailTemplate,
  clearTemplateErrors,
  renameTemplateKeys,
  getEmptyTemplate,
} from './templates.helpers';
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

const initialState = {
  isLoading: false,
  isLoaded: false,
  search: '',
  templates: [],
};

export const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOAD_TEMPLATES_REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
      };
    case LOAD_TEMPLATES_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        templates: map(renameTemplateKeys, payload.templates),
      };
    case LOAD_TEMPLATES_FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        error: payload,
      };
    case SAVE_TEMPLATE_REQUEST:
    case REMOVE_TEMPLATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ADD_NEW_TEMPLATE:
      return {
        ...state,
        templates: [getEmptyTemplate(), ...state.templates],
      };
    case DISCARD_TEMPLATE_ADDING:
      return {
        ...state,
        templates: filter(item => !isString(item.id), state.templates),
      };
    case SAVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        templates: updateTemplate(state.templates, payload),
      };
    case SAVE_TEMPLATE_FAIL:
      return {
        ...state,
        isLoading: false,
        templates: updateFailTemplate(state.templates, payload),
      };
    case REMOVE_TEMPLATE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        templates: filter(item => item.id !== payload, state.templates),
      };
    case REMOVE_TEMPLATE_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case RESET_TEMPLATE_ERRORS:
      return {
        ...state,
        templates: clearTemplateErrors(state.templates, payload),
      };
    default:
      return state;
  }
};
