import {
  IIntegrationContent,
  WorkatoIntegrations,
} from '../../../../store/organisation/integrations/workato/workato.types';
import slackIcon from '../../../../../../assets/images/slack.png';
import sixthSenseIcon from '../../../../../../assets/images/6sense.png';
import demandbaseIcon from '../../../../../../assets/images/demandbase.jpeg';
import msTeamsIcon from '../../../../../../assets/images/ms-teams.svg';
import rollworks from '../../../../../../assets/images/rollworks.png';
import salesforceIcon from '../../../../../../assets/images/salesdorce.png';

export const Slack: IIntegrationContent = {
  title: 'Slack',
  id: WorkatoIntegrations.Slack,
  route: 'slack',
  icon: slackIcon,
  helpDocLink: 'https://help.alyce.com/category/412-slack',
  description:
    'Alyce for Slack allows you to keep your team informed about how recipients are engaging with their Alyce gifts through real-time notifications via Slack to help optimize follow-ups with gift recipients.',
};

export const SixthSense: IIntegrationContent = {
  title: '6sense',
  id: WorkatoIntegrations.SixSense,
  route: '6sense',
  icon: sixthSenseIcon,
  helpDocLink: 'https://help.alyce.com/category/400-6sense',
  via: true,
  description:
    'Alyce for 6Sense automation allows you to tailor your gifting motion to ensure that you are targeting the accounts and contacts who are showing your desired level of intent based on intent score and stage so that you can be targeted in scaling your gifting ...',
};

export const Demandbase: IIntegrationContent = {
  title: 'Demandbase',
  id: WorkatoIntegrations.DemandBase,
  route: 'demandbase',
  icon: demandbaseIcon,
  helpDocLink: 'https://help.alyce.com/category/404-demandbase',
  via: true,
  description:
    'Alyce for Demandbase automation allows you to tailor your gifting motion to ensure that you are targeting the accounts and contacts who are showing your desired level of intent based on intent score and stage so that you can be targeted in scaling your gifting motion.',
};

export const Teams: IIntegrationContent = {
  title: 'Microsoft Teams',
  id: WorkatoIntegrations.Teams,
  route: 'ms-teams',
  icon: msTeamsIcon,
  helpDocLink: 'https://help.alyce.com/category/367-microsoft',
  description:
    'Alyce for Microsoft Teams allows you to keep your team informed about how recipients are engaging with their Alyce gifts through real-time notifications via Microsoft Teams to help optimize follow-ups with gift recipients.',
};

export const SalesForce: IIntegrationContent = {
  title: 'Salesforce',
  id: WorkatoIntegrations.Salesforce,
  route: 'salesforce',
  icon: salesforceIcon,
  helpDocLink: 'https://help.alyce.com/category/361-salesforce',
  description:
    'Alyce for Salesforce automation allows you to streamline the process of adding your Salesforce contacts to Alyce 1:Many campaigns to achieve even more personal and targeted gifting at scale.',
};

export const Rollworks: IIntegrationContent = {
  title: 'RollWorks',
  id: WorkatoIntegrations.Rollworks,
  route: 'rollworks',
  icon: rollworks,
  helpDocLink: 'https://help.alyce.com/category/415-rollworks',
  via: true,
  description:
    'Alyce for Rollworks automation allows you to tailor your gifting motion to ensure that you are targeting the accounts and contacts who are showing your desired level of intent based on intent stage so that you can be targeted in scaling your gifting motion.',
};

export const WorkatoIntegrationContents = {
  [SalesForce.id]: SalesForce,
  [Slack.id]: Slack,
  [SixthSense.id]: SixthSense,
  [Demandbase.id]: Demandbase,
  [Rollworks.id]: Rollworks,
  [Teams.id]: Teams,
};
