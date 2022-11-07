import { createAsyncAction } from '@alycecom/utils';

import { TProspectingMessaging } from '../../prospectingCampaign.types';

import { TMessagingErrors } from './messaging.types';

const prefix = 'PROSPECTING_CAMPAIGN/STEPS/MESSAGING';

export const updateDraftProspectingMessaging = createAsyncAction<
  TProspectingMessaging & { id: number },
  TProspectingMessaging,
  TMessagingErrors
>(`${prefix}/UPDATE_DRAFT`);

export const updateProspectingMessaging = createAsyncAction<
  TProspectingMessaging & { id: number },
  TProspectingMessaging,
  TMessagingErrors
>(`${prefix}/UPDATE`);
