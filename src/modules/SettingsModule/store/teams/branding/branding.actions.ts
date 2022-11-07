import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IBrandingResponse } from './branding.types';

const PREFIX = 'TEAM_SETTINGS/BRANDING';

export const loadBrandingRequest = createAction<{ teamId: number; showBranding: boolean }>(
  `${PREFIX}/LOAD_BRANDING_REQUEST`,
);
export const loadBrandingSuccess = createAction<IBrandingResponse>(`${PREFIX}/LOAD_BRANDING_SUCCESS`);
export const loadBrandingFail = createAction<TErrors>(`${PREFIX}/LOAD_BRANDING_FAIL`);
