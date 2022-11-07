import { Moment } from 'moment';

export enum WorkatoIntegrations {
  Slack = 'slack',
  SixSense = '6sense',
  DemandBase = 'demandbase',
  Teams = 'teams',
  Salesforce = 'salesforce',
  Rollworks = 'rollworks',
}

export type TWorkatoToken = {
  token: string;
};

export type TTokenIdentifier = { connectionId: string };

export interface IWorkatoIntegration {
  id: WorkatoIntegrations;
  enabled: boolean;
}

export enum WorkatoConnectionStatus {
  Success = 'success',
}

export interface IWorkatoConnection {
  uuid: string;
  name: string;
  provider: string;
  authorizedAt: Moment;
  workatoConnectionId: string;
  status: WorkatoConnectionStatus | null;
  error: string;
}

interface IWorkatoRecipeFields {
  code: string;
  value: string;
}

export interface IWorkatoRecipe {
  id: string;
  name: string;
  description: string;
  running: boolean;
  lastRunAt: Moment | null;
  error: string;
  workatoRecipeId: string;
  fields: IWorkatoRecipeFields[];
}

export interface IWorkatoPicklist {
  name: string;
  value: string;
}

export interface IWorkatoPicklistPayload {
  code: string;
  value: string;
}

export type TRecipeAction = 'start' | 'stop';

export enum WorkatoMessageType {
  HeightChange = 'heightChange',
  ConnectionStatusChange = 'connectionStatusChange',
  Error = 'error',
}
export enum WorkatoProviders {
  Salesforce = 'salesforce',
  Hubspot = 'hubspot',
  Alyce = 'alyce',
  Slack = 'slack',
  Teams = 'teams_bot',
}

export interface IIntegrationContent {
  title: string;
  id: WorkatoIntegrations;
  route: string;
  icon: string;
  helpDocLink: string;
  via?: boolean;
  description: string;
}

export type TIntegrationUrlParams = { integrationId?: string };

export const workatoWidgetPadding = 16;
export const alyceConnectorProviderName = 'alyce';
export const permanentlyClosedConnectionsCountThreshold = 2;
export const connectionsQuantityForDynamicFrameHeight = 1;
export const fixedFrameHeight = 200;
