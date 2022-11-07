import { createAction } from 'redux-act';

const PREFIX = 'EMAIL_BRANDING';

export const resetEmailBranding = createAction(`${PREFIX}/RESET_EMAIL_BRANDING`);
