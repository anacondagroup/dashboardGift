import * as R from 'ramda';

const customTemplatesPath = R.path(['settings', 'teams', 'customTemplates']);

export const getCustomTemplates = customTemplatesPath;

export const getCustomTemplateErrors = R.compose(R.prop('errors'), customTemplatesPath);
