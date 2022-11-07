import { find, pipe, prop } from 'ramda';
import { createSelector } from 'reselect';
import { isString } from '@alycecom/utils';

export const templatesModule = state => state.settings.templates;

export const templatesSearch = createSelector(templatesModule, module => module.search);

export const templatesItems = createSelector(templatesModule, module => module.templates);

export const templatesIsLoading = createSelector(templatesModule, module => module.isLoading);

const isPhantomRecord = pipe(prop('id'), isString);

export const templatesIsCreating = createSelector(templatesItems, items => !!find(isPhantomRecord, items));

export const templatesHasTemplates = createSelector(
  templatesIsLoading,
  templatesItems,
  (isLoading, items) => isLoading || (!isLoading && items.length > 0),
);
