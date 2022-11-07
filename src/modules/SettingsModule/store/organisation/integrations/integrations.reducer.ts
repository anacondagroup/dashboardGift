import { combineReducers } from 'redux';

import salesforce, { ISfOauthState } from './salesforce/sfOauth.reducer';
import { marketo } from './marketo/marketo.reducer';
import { hubspot, IHubspotState } from './hubspot/hubspot.reducer';
import { eloqua, IEloquaState } from './eloqua/eloqua.reducer';
import { IWorkatoState, workato } from './workato/workato.reducer';

export interface IIntegrationsState {
  hubspot: IHubspotState;
  // todo refactor marketo
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  marketo: any;
  salesforce: ISfOauthState;
  eloqua: IEloquaState;
  workato: IWorkatoState;
}
export default combineReducers<IIntegrationsState>({
  hubspot,
  marketo,
  salesforce,
  eloqua,
  workato,
});
