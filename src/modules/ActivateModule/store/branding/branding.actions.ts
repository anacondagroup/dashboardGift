import { createAction } from 'redux-act';

import { IBranding } from './branding.types';

const PREFIX = 'ACTIVATE_MODULE/UI/EDIT/BRANDING';

export const loadBrandingRequest = createAction<{ campaignId: number; showBranding: boolean }>(
  `${PREFIX}/LOAD_BRANDING_REQUEST`,
);
export const loadBrandingSuccess = createAction<IBranding>(`${PREFIX}/LOAD_BRANDING_SUCCESS`);
export const loadBrandingFail = createAction(`${PREFIX}/LOAD_BRANDING_FAIL`);
