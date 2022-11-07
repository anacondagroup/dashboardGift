import { compose, path, propOr } from 'ramda';
import { DefaultRootState } from 'react-redux';

import { ICustomFieldState } from './customFields.reducer';
import { TCustomField, TCustomFieldFormErrors } from './customFields.types';

export const pathToCustomFields = path<ICustomFieldState>(['settings', 'organisation', 'customFields']);

export const getIsLoading = compose(propOr(false, 'isLoading'), pathToCustomFields) as (
  state: DefaultRootState,
) => boolean;

export const getIsLoaded = compose(propOr(false, 'isLoaded'), pathToCustomFields) as (
  state: DefaultRootState,
) => boolean;

export const getCustomFields = compose(propOr([], 'list'), pathToCustomFields) as (
  state: DefaultRootState,
) => TCustomField[];

export const getAddFieldFormErrors = compose(propOr({}, 'addFieldFormErrors'), pathToCustomFields) as (
  state: DefaultRootState,
) => TCustomFieldFormErrors;
