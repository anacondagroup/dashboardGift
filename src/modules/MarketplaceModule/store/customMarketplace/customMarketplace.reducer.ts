import { createReducer } from 'redux-act';
import { without } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { TCustomMarketplace, TCustomMarketplaceErrors } from './customMarketplace.types';
import {
  addAllProductsToMarketplace,
  addAllProductsToMarketplaceFail,
  addAllProductsToMarketplaceSuccess,
  addCustomMarketplaceProduct,
  addCustomMarketplaceProductFail,
  addCustomMarketplaceProductSuccess,
  createCustomMarketplace,
  createCustomMarketplaceFail,
  createCustomMarketplaceSuccess,
  fetchCustomMarketplaceById,
  fetchCustomMarketplaceFail,
  fetchCustomMarketplaceSuccess,
  removeAllProductsFromMarketplace,
  removeAllProductsFromMarketplaceSuccess,
  removeAllProductsFromToMarketplaceFail,
  removeCustomMarketplaceProduct,
  removeCustomMarketplaceProductFail,
  removeCustomMarketplaceProductSuccess,
  resetCustomMarketplace,
  resetDataChangeReason,
  updateCustomMarketplace,
  updateCustomMarketplaceFail,
  updateCustomMarketplaceSuccess,
} from './customMarketplace.actions';

export enum DataChangeReason {
  None,
  Fetched,
  Updated,
  Created,
}

export interface ICustomMarketplaceState {
  status: StateStatus;
  bulkStatus: StateStatus;
  dataChangeReason: DataChangeReason;
  pendingAddProductIds: number[];
  pendingRemoveProductIds: number[];
  data: Omit<TCustomMarketplace, 'id'> & { id: number | null };
  errors: TCustomMarketplaceErrors;
}

export const initialState: ICustomMarketplaceState = {
  status: StateStatus.Idle,
  bulkStatus: StateStatus.Idle,
  dataChangeReason: DataChangeReason.None,
  pendingAddProductIds: [],
  pendingRemoveProductIds: [],
  data: {
    id: null,
    name: '',
    countryIds: [],
    minPrice: null,
    maxPrice: null,
    donationPrice: null,
    giftCardPrice: null,
    teamIds: [],
    productIds: [],
    createdBy: {
      id: 0,
      firstName: '',
      lastName: '',
    },
    updatedBy: null,
    campaignIds: [],
    createdAt: '',
    updatedAt: '',
  },
  errors: {},
};

export const customMarketplace = createReducer({}, initialState);

customMarketplace.on(createCustomMarketplace, state => ({
  ...state,
  errors: {},
  status: StateStatus.Pending,
}));
customMarketplace.on(createCustomMarketplaceSuccess, (state, payload) => ({
  ...state,
  data: payload,
  status: StateStatus.Fulfilled,
  dataChangeReason: DataChangeReason.Created,
}));
customMarketplace.on(createCustomMarketplaceFail, (state, payload) => ({
  ...state,
  status: StateStatus.Rejected,
  errors: payload,
}));

customMarketplace.on(fetchCustomMarketplaceById, () => ({
  ...initialState,
  status: StateStatus.Pending,
}));
customMarketplace.on(fetchCustomMarketplaceSuccess, (state, payload) => ({
  ...state,
  data: payload,
  status: StateStatus.Fulfilled,
  dataChangeReason: DataChangeReason.Fetched,
}));
customMarketplace.on(fetchCustomMarketplaceFail, state => ({
  ...state,
  status: StateStatus.Rejected,
}));

customMarketplace.on(updateCustomMarketplace, state => ({
  ...state,
  status: StateStatus.Pending,
}));
customMarketplace.on(updateCustomMarketplaceSuccess, (state, payload) => ({
  ...state,
  data: payload,
  status: StateStatus.Fulfilled,
  dataChangeReason: DataChangeReason.Updated,
}));
customMarketplace.on(updateCustomMarketplaceFail, (state, payload) => ({
  ...state,
  status: StateStatus.Rejected,
  errors: payload,
}));

customMarketplace.on(addAllProductsToMarketplace, state => ({
  ...state,
  bulkStatus: StateStatus.Pending,
}));
customMarketplace.on(addAllProductsToMarketplaceSuccess, state => ({
  ...state,
  bulkStatus: StateStatus.Idle,
}));
customMarketplace.on(addAllProductsToMarketplaceFail, state => ({
  ...state,
  bulkStatus: StateStatus.Rejected,
}));

customMarketplace.on(removeAllProductsFromMarketplace, state => ({
  ...state,
  bulkStatus: StateStatus.Pending,
}));
customMarketplace.on(removeAllProductsFromMarketplaceSuccess, state => ({
  ...state,
  bulkStatus: StateStatus.Idle,
}));
customMarketplace.on(removeAllProductsFromToMarketplaceFail, state => ({
  ...state,
  bulkStatus: StateStatus.Rejected,
}));

customMarketplace.on(addCustomMarketplaceProduct, (state, payload) => ({
  ...state,
  pendingAddProductIds: [...state.pendingAddProductIds, payload.productId],
}));
customMarketplace.on(addCustomMarketplaceProductSuccess, (state, payload) => ({
  ...state,
  data: {
    ...state.data,
    productIds: [...state.data.productIds, ...payload.addedProductIds],
    updatedAt: payload.updatedAt,
  },
  pendingAddProductIds: state.pendingAddProductIds.filter(productId => !payload.addedProductIds.includes(productId)),
}));
customMarketplace.on(addCustomMarketplaceProductFail, (state, payload) => ({
  ...state,
  pendingAddProductIds: state.pendingAddProductIds.filter(productId => !payload.rejectedProductIds.includes(productId)),
}));

customMarketplace.on(removeCustomMarketplaceProduct, (state, payload) => ({
  ...state,
  pendingRemoveProductIds: [...state.pendingRemoveProductIds, payload.productId],
}));
customMarketplace.on(removeCustomMarketplaceProductSuccess, (state, payload) => ({
  ...state,
  data: {
    ...state.data,
    productIds: without(payload.removedProductIds, state.data.productIds),
    updatedAt: payload.updatedAt,
  },
  pendingRemoveProductIds: state.pendingRemoveProductIds.filter(
    productId => !payload.removedProductIds.includes(productId),
  ),
}));
customMarketplace.on(removeCustomMarketplaceProductFail, (state, payload) => ({
  ...state,
  pendingRemoveProductIds: state.pendingRemoveProductIds.filter(
    productId => !payload.rejectedProductIds.includes(productId),
  ),
}));

customMarketplace.on(resetDataChangeReason, state => ({ ...state, dataChangeReason: DataChangeReason.None }));
customMarketplace.on(resetCustomMarketplace, () => initialState);
