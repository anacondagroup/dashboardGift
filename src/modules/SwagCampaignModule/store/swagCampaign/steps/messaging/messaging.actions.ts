import { createAsyncAction } from '@alycecom/utils';

import { TSwagMessaging } from '../../swagCampaign.types';

import { TMessagingErrors } from './messaging.types';

const prefix = 'SWAG_CAMPAIGNS/STEPS/MESSAGING';

export const updateDraftSwagMessaging = createAsyncAction<
  TSwagMessaging & { draftId: number },
  TSwagMessaging,
  TMessagingErrors
>(`${prefix}/UPDATE_DRAFT`);
