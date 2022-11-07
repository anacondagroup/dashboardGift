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
} from './customTemplates.types';

const initialState = {
  isLoading: false,
  errors: null,
  templates: [],
  teamName: '',
  createTemplate: null,
};

const newTemplate = {
  template: {
    name: '',
    subject: '',
    message: '',
  },
  isUploading: false,
};

export const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case ALL_CUSTOM_TEMPLATES_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case ALL_CUSTOM_TEMPLATES_LOAD_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        templates: action.payload.templates,
        teamName: action.payload.name,
      };
    }
    case ALL_CUSTOM_TEMPLATES_LOAD_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_NEW_CUSTOM_TEMPLATE:
      return {
        ...state,
        createTemplate: { ...newTemplate },
        errors: initialState.errors,
      };
    case DELETE_CUSTOM_TEMPLATE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case DELETE_CUSTOM_TEMPLATE_SUCCESS:
      return {
        ...state,
        templates: action.payload.templates,
        isLoading: false,
      };
    case DELETE_CUSTOM_TEMPLATE_FAIL:
      return {
        ...state,
        isLoading: false,
      };
    case CREATE_NEW_CUSTOM_TEMPLATE_REQUEST: {
      const { createTemplate } = state;
      createTemplate.isUploading = true;
      return {
        ...state,
        createTemplate: { ...createTemplate },
      };
    }
    case CREATE_NEW_CUSTOM_TEMPLATE_SUCCESS:
      return {
        ...state,
        createTemplate: null,
      };
    case CREATE_NEW_CUSTOM_TEMPLATE_FAIL: {
      const { createTemplate } = state;
      createTemplate.isUploading = false;
      return {
        ...state,
        createTemplate: { ...createTemplate },
        errors: action.payload || state.errors,
      };
    }
    case DISCARD_NEW_CUSTOM_TEMPLATE:
      return {
        ...state,
        createTemplate: null,
      };
    default:
      return state;
  }
};
