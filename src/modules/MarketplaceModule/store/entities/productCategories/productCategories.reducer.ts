import { createReducer } from 'redux-act';
import { createEntityAdapter, StateStatus } from '@alycecom/utils';

import * as actions from './productCategories.actions';
import { TProductCategory } from './productCategories.types';

export const categoriesAdapter = createEntityAdapter<TProductCategory>();

export const initialState = categoriesAdapter.getInitialState({
  status: StateStatus.Idle,
});

export type IProductCategoriesState = typeof initialState;

export const productCategories = createReducer({}, initialState);

productCategories.on(actions.fetchProductCategories, state => ({
  ...state,
  status: StateStatus.Pending,
}));
productCategories.on(actions.fetchProductCategoriesSuccess, (state, categories) => ({
  ...state,
  ...categoriesAdapter.setAll(categories, state),
  status: StateStatus.Fulfilled,
}));
productCategories.on(actions.fetchProductCategoriesFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));
