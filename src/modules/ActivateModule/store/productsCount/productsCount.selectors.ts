import { pipe, prop, propEq } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../store/root.types';

import { TProductsCountState } from './productsCount.reducer';

const getProductsCountState = (state: IRootState): TProductsCountState => state.activate.productsCount;

export const getIsPending = pipe(getProductsCountState, propEq('status', StateStatus.Pending));
export const getIsFulfilled = pipe(getProductsCountState, propEq('status', StateStatus.Fulfilled));
export const getIsRejected = pipe(getProductsCountState, propEq('status', StateStatus.Rejected));

export const getProductsCount = pipe(getProductsCountState, prop('count'));
