import { equals, pipe, prop } from 'ramda';
import { createSelector } from 'reselect';
import { StateStatus } from '@alycecom/utils';

import { alyceConnectorProviderName, WorkatoConnectionStatus, WorkatoProviders } from '../workato.types';
import { IRootState } from '../../../../../../../store/root.types';

import { IConnectionState } from './connections.reducer';

export const getWorkatoConnectionsState = (state: IRootState): IConnectionState =>
  state.settings.organisation.integrations.workato.connections;

const getWorkatoIntegrationConnectionsState = pipe(getWorkatoConnectionsState, prop('state'));
export const getWorkatoIntegrationConnectionsList = pipe(getWorkatoConnectionsState, prop('list'));
export const getIsLoadingWorkatoConnections = createSelector(
  getWorkatoIntegrationConnectionsState,
  equals(StateStatus.Pending),
);

export const getIfAllConnectionsAuthorized = createSelector(
  getWorkatoIntegrationConnectionsList,
  connections =>
    connections.length && connections.every(connection => connection.status === WorkatoConnectionStatus.Success),
);

const getAllConnectionsForAuthorizing = createSelector(getWorkatoIntegrationConnectionsList, connections =>
  connections.filter(connection => connection.provider !== WorkatoProviders.Alyce),
);

export const getIfAnyConnectionIsAuthorized = createSelector(
  getAllConnectionsForAuthorizing,
  connections => connections && connections.some(connection => connection.status === WorkatoConnectionStatus.Success),
);

export const getConnectionsForAuthorizing = createSelector(getWorkatoIntegrationConnectionsList, connections =>
  connections.filter(connection => connection.provider !== alyceConnectorProviderName),
);

export const makeGetConnectionUuidByProvider = (provider: string): ((state: IRootState) => string | undefined) =>
  createSelector(
    getWorkatoIntegrationConnectionsList,
    connections => connections.find(connection => connection.provider === provider)?.uuid,
  );

export const makeGetConnectionStatusByUuid = (
  uuid: string | undefined,
): ((state: IRootState) => WorkatoConnectionStatus | null | undefined) =>
  createSelector(
    getWorkatoIntegrationConnectionsList,
    connections => connections.find(connection => connection.uuid === uuid)?.status,
  );

export const makeGetConnectionStatusById = (
  connectionId: string | undefined,
): ((state: IRootState) => WorkatoConnectionStatus | null | undefined) =>
  createSelector(
    getWorkatoIntegrationConnectionsList,
    connections => connections.find(connection => connection.workatoConnectionId === connectionId)?.status,
  );

export const makeGetIsTiedConnectionActive = (tiedConnector: WorkatoProviders): ((state: IRootState) => boolean) =>
  createSelector(
    getWorkatoIntegrationConnectionsList,
    connections => connections.find(c => c.provider === tiedConnector)?.status === WorkatoConnectionStatus.Success,
  );
