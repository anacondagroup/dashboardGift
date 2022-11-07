import { createAsyncAction } from '@alycecom/utils';

import { IWorkatoIntegration } from '../workato.types';
import { TSfConnectionStateResponse } from '../../salesforce/sfOAuth.types';

const prefix = 'SETTINGS_MODULE/WORKATO';

export const fetchWorkatoIntegrations = createAsyncAction<void, IWorkatoIntegration[]>(`${prefix}/FETCH_INTEGRATIONS`);

export const fetchSfConnectionState = createAsyncAction<void, TSfConnectionStateResponse>(
  `${prefix}/FETCH_SF_CONNECTION_STATE`,
);
