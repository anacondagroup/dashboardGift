import { createAsyncAction } from '@alycecom/utils';

import { TOrganizationSubscriptionsResponse } from './subscription.types';

const prefix = 'SETTINGS_MODULE/WORKATO/SUBSCRIPTION';

export const fetchOrganizationSubscriptions = createAsyncAction<void, TOrganizationSubscriptionsResponse>(
  `${prefix}/FETCH_RECIPES`,
);
