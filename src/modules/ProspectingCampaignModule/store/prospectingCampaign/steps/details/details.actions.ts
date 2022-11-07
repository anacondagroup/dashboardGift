import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TProspectingDetails } from '../../prospectingCampaign.types';

const prefix = 'PROSPECTING_CAMPAIGN/STEPS/DETAILS';

export const updateDraftProspectingDetails = createAsyncAction<
  TProspectingDetails & { id: number },
  TProspectingDetails & { id: number },
  TErrors<TProspectingDetails>
>(`${prefix}/UPDATE_DRAFT`);

export const updateProspectingDetails = createAsyncAction<
  TProspectingDetails & { id: number },
  TProspectingDetails,
  TErrors<TProspectingDetails>
>(`${prefix}/UPDATE`);
