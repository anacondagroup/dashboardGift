import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { IEmailBrandingResponse } from './emailBranding.types';

const PREFIX = 'TEAM_SETTINGS/EMAIL_BRANDING';

export const loadEmailBrandingRequest = createAction<{ teamId: number }>(`${PREFIX}/LOAD_EMAIL_BRANDING_REQUEST`);
export const loadEmailBrandingSuccess = createAction<IEmailBrandingResponse>(`${PREFIX}/LOAD_EMAIL_BRANDING_SUCCESS`);
export const loadEmailBrandingFail = createAction<TErrors>(`${PREFIX}/LOAD_EMAIL_BRANDING_FAIL`);
