import { compose, prop } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { ITemplateState } from './template.reducer';

export const templatePath = (state: IRootState): ITemplateState => state.settings.campaign.template;

export const getTemplates = compose(prop('templates'), templatePath);

export const getErrors = compose(prop('errors'), templatePath);

export const getIsLoading = compose(prop('isLoading'), templatePath);

export const getIsLoaded = compose(prop('isLoaded'), templatePath);
