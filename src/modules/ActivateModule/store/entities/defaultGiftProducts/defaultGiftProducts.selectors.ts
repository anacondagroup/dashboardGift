import { pipe } from 'ramda';

import { IRootState } from '../../../../../store/root.types';

import { defaultGiftProductsAdapter, TDefaultGiftProductsState } from './defaultGiftProducts.reducer';

const getDefaultGiftProductsState = (state: IRootState): TDefaultGiftProductsState =>
  state.activate.entities.defaultGiftProducts;
const selectors = defaultGiftProductsAdapter.getSelectors(getDefaultGiftProductsState);

export const getDefaultGiftProductsStatus = pipe(getDefaultGiftProductsState, state => state.status);

export const getDefaultGiftProducts = selectors.getAll;
