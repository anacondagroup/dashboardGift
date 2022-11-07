import { createAction } from 'redux-act';
import { IResponse, TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TProspectingCampaign, TProspectingDetails, TProspectingDraftCampaign } from './prospectingCampaign.types';

const prefix = 'PROSPECTING_CAMPAIGN';

export const fetchProspectingDraftById = createAsyncAction<number, IResponse<TProspectingDraftCampaign>>(
  `${prefix}/FETCH_DRAFT_BY_ID`,
);

export const fetchProspectingById = createAsyncAction<number, IResponse<TProspectingCampaign>>(`${prefix}/FETCH_BY_ID`);

export const createProspectingDraft = createAsyncAction<
  TProspectingDetails,
  IResponse<TProspectingDraftCampaign>,
  TErrors<TProspectingDetails> | null
>(`CREATE_DRAFT`);

export const expireProspectingCampaignById = createAsyncAction<number, void, void>(`${prefix}/EXPIRE_BY_ID`);

export const unexpireProspectingCampaignById = createAsyncAction<number, void, void>(`${prefix}/UNEXPIRE_BY_ID`);

export const resetProspectingCampaign = createAction(`${prefix}/RESET`);
