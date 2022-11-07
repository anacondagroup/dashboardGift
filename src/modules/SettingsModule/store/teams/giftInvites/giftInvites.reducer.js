import { combineReducers } from 'redux';

import { reducer as marketplaceRestrictionsReducer } from './marketplaceRestrictions/marketplaceRestrictions.reducer';

export const reducer = combineReducers({
  marketplaceRestrictions: marketplaceRestrictionsReducer,
});
