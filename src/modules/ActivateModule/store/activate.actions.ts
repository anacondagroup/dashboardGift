import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';

import { ActivateModes } from '../routePaths';

import { IFullActivate, IFullActivateDraft } from './activate.types';

const PREFIX = 'ACTIVATE_MODULE/DRAFT';

export const loadActivateRequest = createAction<{ campaignId: number; mode: ActivateModes }>(`${PREFIX}/LOAD_REQUEST`);
export const loadActivateSuccess = createAction<IFullActivateDraft | IFullActivate>(`${PREFIX}/LOAD_SUCCESS`);
export const loadActivateFail = createAction<TErrors>(`${PREFIX}/LOAD_FAIL`);

export const clearActivateModuleState = createAction(`${PREFIX}/RESET`);
