import { createAction } from 'redux-act';

import { ReportingSidebarStep } from '../reporting/reporting.constants';

const PREFIX = 'GIFTING_INSIGHTS';

export const setSidebarStep = createAction<{ step: ReportingSidebarStep | null; id?: number }>(
  `${PREFIX}/SET_SIDEBAR_STEP`,
);

export const setIsFormDirty = createAction<boolean>(`${PREFIX}/SET_IS_FORM_DIRTY`);
