import { pipe } from 'ramda';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../store/root.types';

import { IProductDetailsState } from './productDetails.reducer';

export const pathToProductDetailsState = (state: IRootState): IProductDetailsState => state.marketplace.productDetails;

export const getIsLoading = pipe(pathToProductDetailsState, state => state.isLoading);

export const getProduct = createSelector(pathToProductDetailsState, state => state.product);
