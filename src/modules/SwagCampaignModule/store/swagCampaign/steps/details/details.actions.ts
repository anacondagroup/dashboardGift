import { TErrors } from '@alycecom/services';
import { createAsyncAction } from '@alycecom/utils';

import { TSwagDetails } from '../../swagCampaign.types';

const prefix = 'SWAG_CAMPAIGN/STEPS/DETAILS';

export const updateDraftSwagDetails = createAsyncAction<
  TSwagDetails & { id: number },
  TSwagDetails,
  TErrors<TSwagDetails>
>(`${prefix}/UPDATE_DRAFT`);

export const updateSwagDetails = createAsyncAction<TSwagDetails & { id: number }, TSwagDetails, TErrors<TSwagDetails>>(
  `${prefix}/UPDATE`,
);
