import { combineReducers } from 'redux';

import applicationsReducer from './applications/organisationApplications.reducer';
import integrations, { IIntegrationsState } from './integrations/integrations.reducer';
import generalReducer from './general/organisationGeneral.reducer';
import dkimReducer, { IDkimState } from './dkim/dkim.reducer';
import { customFields } from './customFields';
import { rightToBeForgotten, IRightToBeForgottenState } from './rightToBeForgotten';
import branding, { IBrandingState } from './branding/branding.reducer';

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IOrganizationState {
  applications: any;
  general: any;
  integrations: IIntegrationsState;
  dkim: IDkimState;
  customFields: any;
  rightToBeForgotten: IRightToBeForgottenState;
  branding: IBrandingState;
}

export const organisationReducer = combineReducers<IOrganizationState>({
  applications: applicationsReducer,
  general: generalReducer,
  integrations,
  dkim: dkimReducer,
  customFields,
  rightToBeForgotten,
  branding,
});
