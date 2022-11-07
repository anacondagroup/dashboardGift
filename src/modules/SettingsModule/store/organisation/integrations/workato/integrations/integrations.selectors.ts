import { equals, pipe, prop } from 'ramda';
import { StateStatus } from '@alycecom/utils';
import { createSelector } from 'reselect';

import { IRootState } from '../../../../../../../store/root.types';
import { IWorkatoIntegration, WorkatoIntegrations } from '../workato.types';

import { IIntegrationState, ISalesforceCardState } from './integrations.reducer';

const getWorkatoIntegrationState = (state: IRootState): IIntegrationState =>
  state.settings.organisation.integrations.workato.integrations;
const getSalesforceCardState = (state: IRootState): ISalesforceCardState =>
  state.settings.organisation.integrations.workato.integrations.salesforce;

const getWorkatoIntegrationStateStatus = pipe(getWorkatoIntegrationState, prop('state'));
const getSfCardStateStatus = pipe(getSalesforceCardState, prop('status'));

export const getWorkatoIntegrationsList = pipe(getWorkatoIntegrationState, prop('list'));
export const getWorkatoIntegrations = createSelector(
  getWorkatoIntegrationsList,
  list =>
    list.reduce((acc, integration) => ({ ...acc, [integration.id]: integration }), {}) as Record<
      WorkatoIntegrations,
      IWorkatoIntegration
    >,
);
export const getIsWorkatoIntegrationsLoading = pipe(getWorkatoIntegrationStateStatus, equals(StateStatus.Pending));

export const getSfConnectionState = pipe(getSalesforceCardState, state => state.connectionState);
export const getIsSfConnectionStateLoading = pipe(getSfCardStateStatus, equals(StateStatus.Pending));
export const getIsSfConnectionStateLoaded = pipe(getSfCardStateStatus, equals(StateStatus.Fulfilled));
