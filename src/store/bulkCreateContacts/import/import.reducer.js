import * as R from 'ramda';

import {
  BULK_UPLOAD_FILE_UPLOAD_REQUEST,
  BULK_UPLOAD_FILE_UPLOAD_SUCCESS,
  BULK_UPLOAD_FILE_UPLOAD_FAIL,
  BULK_UPLOAD_RESET_PREVIEW,
  BULK_IMPORT_UPDATE_CONTACT,
  BULK_IMPORT_REMOVE_CONTACT,
  BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_SUCCESS,
  BULK_IMPORT_SUCCESS,
  BULK_IMPORT_REQUEST,
  BULK_IMPORT_VALIDATION_ERRORS,
  BULK_IMPORT_FINISH,
  BULK_IMPORT_FAIL,
  BULK_UPLOAD_RESET,
  BULK_CREATE,
} from './import.types';

export const initialState = {
  contacts: [],
  isLoading: false,
  campaigns: [],
  processed: 0,
  totalContacts: 0,
  errors: {},
  uploadError: {},
  validationErrors: null,
  status: 'initial',
  remainingContactsImport: '',
  importId: null,
};
const filterErrorLines = ({ lines, errorField, contactId, fields = null }) =>
  lines.filter(line => line !== contactId || (fields && fields.indexOf(errorField) === -1));

const filterValidationErrors = ({ validationErrors, contactId, fields }) =>
  R.compose(
    R.filter(error => error.lines.length),
    R.map(error => ({
      ...error,
      lines: filterErrorLines({ lines: error.lines, errorField: error.field, contactId, fields }),
    })),
  )(validationErrors);

const getFieldNames = updatedFields => {
  const { custom_fields: customFields = null, ...other } = updatedFields;
  const names = Object.keys(other || {});
  if (customFields) {
    const customNames = Object.keys(customFields).map(name => `custom_${name}`);
    names.push(...customNames);
  }

  return names;
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BULK_UPLOAD_FILE_UPLOAD_REQUEST:
      return {
        ...state,
        isLoading: true,
        uploadError: {},
      };
    case BULK_UPLOAD_FILE_UPLOAD_SUCCESS:
      return {
        ...state,
        contacts: action.payload.contacts,
        validationErrors: action.payload.errors,
        isLoading: false,
        importId: action.payload.importId,
      };
    case BULK_UPLOAD_FILE_UPLOAD_FAIL:
      return {
        ...state,
        uploadError: action.payload,
        isLoading: false,
      };
    case BULK_IMPORT_REMOVE_CONTACT:
      return {
        ...state,
        contacts: R.without([state.contacts.find(contact => contact.id === action.payload.id)], state.contacts),
        validationErrors: state.validationErrors
          ? filterValidationErrors({ validationErrors: state.validationErrors, contactId: action.payload.id })
          : state.validationErrors,
      };
    case BULK_UPLOAD_RESET_PREVIEW:
      return { ...initialState, campaigns: state.campaigns };
    case BULK_UPLOAD_RESET:
      return { ...initialState };
    case BULK_IMPORT_UPDATE_CONTACT:
      return {
        ...state,
        contacts: [
          ...state.contacts.map(contact => {
            if (contact.id === action.payload.contact.id) {
              return {
                ...contact,
                ...action.payload.updatedData,
              };
            }
            return {
              ...contact,
            };
          }),
        ],
        validationErrors: state.validationErrors
          ? filterValidationErrors({
              validationErrors: state.validationErrors,
              contactId: action.payload.contact.id,
              fields: getFieldNames(action.payload.updatedData),
            })
          : state.validationErrors,
      };
    case BULK_IMPORT_AVAILABLE_CAMPAIGNS_FOR_TEAM_SUCCESS:
      return {
        ...state,
        campaigns: action.payload,
      };

    case BULK_IMPORT_VALIDATION_ERRORS:
      return {
        ...state,
        isLoading: false,
        validationErrors: action.payload,
      };
    case BULK_IMPORT_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case BULK_IMPORT_SUCCESS:
      return {
        ...initialState,
        totalContacts: action.payload.total_contacts,
        importId: action.payload.importId,
        processed: action.payload.processed,
      };

    case BULK_IMPORT_FINISH:
      return { ...initialState };
    case BULK_IMPORT_FAIL:
      return { ...initialState, isLoading: false, uploadError: action.payload };
    case BULK_CREATE.WAIT_FOR_IMPORT_UPDATE:
      return {
        ...state,
        status: action.payload.status,
        processed: action.payload.processed || state.processed,
        remainingContactsImport: action.payload.remaining_contacts_import || '',
      };
    case BULK_CREATE.WAIT_FOR_IMPORT_FAIL:
      return {
        ...state,
        status: 'error',
      };
    default:
      return state;
  }
};
