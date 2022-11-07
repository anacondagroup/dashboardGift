import { createAction } from 'redux-act';
import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { IActivateDetails } from '../../activate.types';

import { TUpdateBuilderDetailsBody, TUpdateEditorDetailsBody } from './details.types';

const PREFIX = 'ACTIVATE_MODULE/STEPS/DETAILS';

export const createActivateDraftRequest = createAction<IActivateDetails>(`${PREFIX}/CREATE_DRAFT_REQUEST`);
export const createActivateDraftSuccess = createAction<IActivateDetails>(`${PREFIX}/CREATE_DRAFT_SUCCESS`);
export const createActivateDraftFail = createAction<TErrors>(`${PREFIX}/CREATE_DRAFT_FAIL`);

export const updateDetailsRequest = createAction<TUpdateBuilderDetailsBody | TUpdateEditorDetailsBody>(
  `${PREFIX}/UPDATE_REQUEST`,
);
export const updateDetailsSuccess = createAction<TUpdateBuilderDetailsBody | TUpdateEditorDetailsBody>(
  `${PREFIX}/UPDATE_SUCCESS`,
);
export const updateDetailsFail = createAction<TErrors>(`${PREFIX}/UPDATE_FAIL`);

export const updateFreeClaims = createAsyncAction<{ freeClaims: number }, { freeClaims: number }, TErrors>(
  `${PREFIX}/UPDATE_FREE_CLAIMS`,
);
