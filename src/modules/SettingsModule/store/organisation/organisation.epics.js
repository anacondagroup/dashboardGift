import { organizationGeneralEpics } from './general/organisationGeneral.epics';
import { organisationIntegrationsEpics } from './integrations/marketo/marketo.epics';
import { organisationApplicationsEpics } from './applications/organizationApplications.epics';
import { dkimEpics } from './dkim/dkim.epics';
import { epics as customFieldsEpics } from './customFields';
import { epics as rightToBeForgottenEpics } from './rightToBeForgotten';
import { brandingEpics } from './branding/branding.epics';
import { sfOauthEpics } from './integrations/salesforce/sfOauth.epics';
import { hubspotEpics } from './integrations/hubspot/hubspot.epics';
import { eloquaEpics } from './integrations/eloqua/eloqua.epics';
import { workatoEpics } from './integrations/workato/workato.epics';

export const organisationSettingsEpics = [
  ...organizationGeneralEpics,
  ...organisationIntegrationsEpics,
  ...organisationApplicationsEpics,
  ...dkimEpics,
  ...hubspotEpics,
  ...eloquaEpics,
  ...workatoEpics,
  ...customFieldsEpics,
  ...rightToBeForgottenEpics,
  ...brandingEpics,
  ...sfOauthEpics,
];
