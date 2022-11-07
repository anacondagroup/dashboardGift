import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { TCustomField, TCustomFieldFormErrors } from './customFields.types';

const prefix = 'ED/ORG_SETTINGS/CUSTOM_FIELDS' as const;

export const getCustomFields = createAction<void>(`${prefix}_GET_CUSTOM_FIELDS_REQUEST`);

export const getCustomFieldsSuccess = createAction<TCustomField[]>(`${prefix}_GET_CUSTOM_FIELDS_SUCCESS`);

export const getCustomFieldsFail = createAction(`${prefix}_GET_CUSTOM_FIELDS_FAIL`);

export const addCustomField = createAction<{ label: string; required: boolean }>(`${prefix}_ADD_CUSTOM_FIELD_REQUEST`);

export const addCustomFieldSuccess = createAction<TCustomField>(`${prefix}_ADD_CUSTOM_FIELD_SUCCESS`);

export const addCustomFieldFail = createAction<TErrors<TCustomFieldFormErrors>>(`${prefix}_ADD_CUSTOM_FIELD_FAIL`);

export const updateCustomField = createAction<{ name: string; required?: boolean; active?: boolean }>(
  `${prefix}_UPDATE_CUSTOM_FIELD_REQUEST`,
);

export const updateCustomFieldSuccess = createAction<TCustomField>(`${prefix}_UPDATE_CUSTOM_FIELD_SUCCESS`);

export const updateCustomFieldFail = createAction<unknown>(`${prefix}_UPDATE_CUSTOM_FIELD_FAIL`);

export const deleteCustomField = createAction<TCustomField['name']>(`${prefix}_DELETE_CUSTOM_FIELD_REQUEST`);
export const deleteCustomFieldSuccess = createAction<TCustomField['name']>(`${prefix}_DELETE_CUSTOM_FIELD_SUCCESS`);

export const deleteCustomFieldFail = createAction(`${prefix}_DELETE_CUSTOM_FIELD_FAIL`);
