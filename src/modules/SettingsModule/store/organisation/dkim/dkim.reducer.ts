import { combineReducers } from 'redux';

import domainsReducer, { IDomainsState } from './domains/domains.reducer';
import detailsReducer, { IDetailsState } from './details/details.reducer';

export interface IDkimState {
  domains: IDomainsState;
  details: IDetailsState;
}

export default combineReducers<IDkimState>({
  domains: domainsReducer,
  details: detailsReducer,
});
