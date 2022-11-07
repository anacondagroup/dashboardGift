import * as R from 'ramda';
import { createSelector } from 'reselect';

export const getMarketplaceRestrictionsSettings = createSelector(
  state => R.path(['settings', 'teams', 'giftInvites', 'marketplaceRestrictions', 'settings'])(state),
  settings => settings,
);

export const getMarketplaceRestrictionsTypes = createSelector(
  state => R.path(['settings', 'teams', 'giftInvites', 'marketplaceRestrictions', 'restrictedTypes'])(state),
  types => types,
);

export const getMarketplaceRestrictionsVendors = createSelector(
  state => R.path(['settings', 'teams', 'giftInvites', 'marketplaceRestrictions', 'restrictedVendors'])(state),
  vendors => vendors,
);
