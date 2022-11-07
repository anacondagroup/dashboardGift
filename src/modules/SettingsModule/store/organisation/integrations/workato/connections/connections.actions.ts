import { createAsyncAction } from '@alycecom/utils';

import { IWorkatoConnection, WorkatoConnectionStatus } from '../workato.types';

const prefix = 'SETTINGS_MODULE/WORKATO/CONNECTIONS';

interface IWorkatoConnectionsByIntegration {
  integrationId: string;
}

interface IWorkatoConnectionsByIntegrationSuccess extends IWorkatoConnectionsByIntegration {
  data: IWorkatoConnection[];
}

export const fetchWorkatoConnectionsByIntegration = createAsyncAction<
  IWorkatoConnectionsByIntegration,
  IWorkatoConnectionsByIntegrationSuccess
>(`${prefix}/FETCH_CONNECTIONS`);

export const handleConnectionStatusChange = createAsyncAction<{
  status: WorkatoConnectionStatus | null;
  connectionId: string;
}>(`${prefix}/CHANGE_STATUS`);
