import { compose, propEq } from 'ramda';
import { StateStatus } from '@alycecom/utils';

import { IRootState } from '../../../../../store/root.types';

import {
  customMarketplaceCampaignsAdapter,
  ICustomMarketplaceCampaignsState,
} from './customMarketplaceCampaigns.reducer';

const getCustomMarketplacesState = (state: IRootState): ICustomMarketplaceCampaignsState =>
  state.marketplace.entities.customMarketplaceCampaigns;

const selectors = customMarketplaceCampaignsAdapter.getSelectors(getCustomMarketplacesState);

export const getIsLoading = compose(propEq('status', StateStatus.Pending), getCustomMarketplacesState);
export const getIsLoaded = compose(propEq('status', StateStatus.Fulfilled), getCustomMarketplacesState);
export const getCustomMarketplaceCampaignsIds = selectors.getIds;
export const getCustomMarketplaceCampaignsMap = selectors.getEntities;
export const getCustomMarketplaceCampaigns = selectors.getAll;
