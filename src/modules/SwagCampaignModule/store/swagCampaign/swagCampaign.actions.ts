import { createAction } from 'redux-act';
import { IResponse, TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TSwagCampaign, TSwagDetails, TSwagDraftCampaign } from './swagCampaign.types';

const prefix = 'SWAG_CAMPAIGN';

export const fetchSwagDraftById = createAsyncAction<number, IResponse<TSwagDraftCampaign>>(
  `${prefix}/FETCH_DRAFT_BY_ID`,
);

export const fetchSwagById = createAsyncAction<number, IResponse<TSwagCampaign>>(`${prefix}/FETCH_BY_ID`);

export const createSwagDraft = createAsyncAction<
  TSwagDetails,
  IResponse<TSwagDraftCampaign>,
  TErrors<TSwagDetails> | null
>(`CREATE_DRAFT`);

export const resetSwagCampaign = createAction(`${prefix}/RESET`);
