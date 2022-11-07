import { createAction } from 'redux-act';
import { identity, always, prop } from 'ramda';

import { ITemplate } from './template.types';

const PREFIX = 'ED/CAMPAIGN_SETTINGS';

export const getTemplates = createAction<null, number>(`${PREFIX}/GET_TEMPLATES_REQUEST`, always(null), identity);
export const getTemplatesSuccess = createAction<ITemplate[]>(`${PREFIX}/GET_TEMPLATES_SUCCESS`);
export const getTemplatesFail = createAction<Record<string, unknown>>(`${PREFIX}/GET_TEMPLATES_FAIL`);

export const saveTemplate = createAction<ITemplate, number>(
  `${PREFIX}/SAVE_TEMPLATE_REQUEST`,
  prop('template'),
  prop('campaignId'),
);
export const saveTemplateSuccess = createAction<ITemplate>(`${PREFIX}/SAVE_TEMPLATE_SUCCESS`);
export const saveTemplateFail = createAction<Record<string, unknown>>(`${PREFIX}/SAVE_TEMPLATE_FAIL`);

export const clearTemplate = createAction<null, number>(`${PREFIX}/CLEAR_TEMPLATE_REQUEST`, always(null), identity);
export const clearTemplateSuccess = createAction(`${PREFIX}/CLEAR_TEMPLATE_SUCCESS`);
export const clearTemplateFail = createAction<Record<string, unknown>>(`${PREFIX}/CLEAR_TEMPLATE_FAIL`);

export const setErrors = createAction<Record<string, unknown>>(`${PREFIX}/SET_ERRORS`);
