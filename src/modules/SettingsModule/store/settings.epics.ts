import { campaignSettingsEpics } from './campaign/campaign.epics';
import { templatesEpics } from './templates/templates.epics';
import { teamSettingsEpics } from './teams/teamsSettings.epics';
import { customTemplatesEpic } from './teams/customTemplates/customTemplates.epics';
import { organisationSettingsEpics } from './organisation/organisation.epics';
import { personalSettingsEpics } from './personal/personal.epics';

export default [
  ...templatesEpics,
  ...campaignSettingsEpics,
  ...teamSettingsEpics,
  ...customTemplatesEpic,
  ...organisationSettingsEpics,
  ...personalSettingsEpics,
];
