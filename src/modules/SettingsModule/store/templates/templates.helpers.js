import qs from 'query-string';
import { propEq, findIndex, pipe, assoc } from 'ramda';
import { isString, renameKeys } from '@alycecom/utils';

const findItemById = id => findIndex(propEq('id', id));

export const renameTemplateKeys = pipe(renameKeys({ is_default: 'isDefault' }), assoc('errors', {}));

export const getEmptyTemplate = () => ({
  id: 'new-template',
  name: 'Empty template',
  subject: '',
  message: '',
  errors: {},
});

export const updateTemplate = (templates, { id, template }) => {
  const index = findItemById(id)(templates);
  const newTemplates = [...templates];
  newTemplates[index] = { ...renameTemplateKeys(template) };
  return newTemplates;
};

export const updateFailTemplate = (templates, { id, errors }) => {
  const index = findItemById(id)(templates);
  const newTemplates = [...templates];
  newTemplates[index] = {
    ...templates[index],
    errors,
  };
  return newTemplates;
};

export const clearTemplateErrors = (templates, id) => {
  const index = findItemById(id)(templates);
  const newTemplates = [...templates];
  newTemplates[index] = {
    ...templates[index],
    errors: {},
  };
  return newTemplates;
};

export const buildApiUrl = ({ search }) => {
  const searchString = search ? `?${qs.stringify({ search })}` : '';
  return `/enterprise/dashboard/settings/templates/saved${searchString}`;
};

export const buildSaveApiUrl = ({ id }) => {
  const actionName = isString(id) ? 'create' : 'update';
  return `/enterprise/dashboard/settings/templates/${actionName}`;
};

export const buildParams = ({ id, ...rest }) => (isString(id) ? { ...rest } : { template_id: id, ...rest });
