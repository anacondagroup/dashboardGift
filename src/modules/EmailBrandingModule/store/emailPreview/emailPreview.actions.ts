import { createAction } from 'redux-act';

import { IBrandingSettings } from '../emailBranding.types';

const PREFIX = 'EMAIL_BRANDING/EMAIL_PREVIEW';

export const loadEmailPreviewRequest = createAction<{ teamId: number; params: Partial<IBrandingSettings> }>(
  `${PREFIX}/LOAD_EMAIL_PREVIEW_REQUEST`,
);
export const loadEmailPreviewSuccess = createAction<string>(`${PREFIX}/LOAD_EMAIL_PREVIEW_SUCCESS`);
export const loadEmailPreviewFail = createAction(`${PREFIX}/LOAD_EMAIL_PREVIEW_FAIL`);

export const resetEmailPreview = createAction(`${PREFIX}/RESET_EMAIL_PREVIEW`);
