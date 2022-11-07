import {
  INTEGRATION_STATUS_ACTIVE,
  INTEGRATION_STATUS_ATTENTION,
  INTEGRATION_STATUS_CONNECTED,
  INTEGRATION_STATUS_ERROR,
  INTEGRATION_STATUS_INACTIVE,
  INTEGRATION_STATUS_LOCKED,
} from '../../../../../constants/organizationSettings.constants';

export type TIntegrationStatus =
  | typeof INTEGRATION_STATUS_ACTIVE
  | typeof INTEGRATION_STATUS_INACTIVE
  | typeof INTEGRATION_STATUS_ERROR
  | typeof INTEGRATION_STATUS_LOCKED
  | typeof INTEGRATION_STATUS_ATTENTION
  | typeof INTEGRATION_STATUS_CONNECTED
  | null;

export enum Integrations {
  Hubspot = 'hubspot',
  Marketo = 'marketo',
  Eloqua = 'eloqua',
  Salesforce = 'salesforce',
  Workato = 'workato',
}

export interface IConfigurableIntegration {
  url: string;
}
