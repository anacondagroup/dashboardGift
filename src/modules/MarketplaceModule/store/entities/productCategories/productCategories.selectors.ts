import { compose, propEq } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import { categoriesAdapter, IProductCategoriesState } from './productCategories.reducer';

const getProductCategoriesState = (state: IRootState): IProductCategoriesState =>
  state.marketplace.entities.productCategories;

const selectors = categoriesAdapter.getSelectors(getProductCategoriesState);

export const getIsLoading = compose(propEq('status', StateStatus.Pending), getProductCategoriesState);
export const getIsLoaded = compose(propEq('status', StateStatus.Fulfilled), getProductCategoriesState);
export const getCategoriesIds = selectors.getIds;
export const getCategoriesMap = selectors.getEntities;
export const getCategories = selectors.getAll;
