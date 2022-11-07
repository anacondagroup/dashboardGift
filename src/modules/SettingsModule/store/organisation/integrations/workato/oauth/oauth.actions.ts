import { createAsyncAction } from '@alycecom/utils';

import { TWorkatoToken, TTokenIdentifier } from '../workato.types';

const prefix = 'SETTINGS_MODULE/WORKATO';

export const fetchWorkatoIntegrationToken = createAsyncAction<
  TTokenIdentifier,
  TWorkatoToken & TTokenIdentifier,
  TTokenIdentifier
>(`${prefix}/FETCH_TOKEN`);

export const clearWorkatoIntegrationToken = createAsyncAction<TTokenIdentifier>(`${prefix}/CLEAR_TOKEN`);
