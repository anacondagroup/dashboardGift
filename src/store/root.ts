import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import {
  CreateGift,
  ContactDetails,
  Auth,
  Security,
  CommonData,
  PersonalIntegration,
  PersonalProfileSettings,
  PersonalGeneralSettings,
  PersonalTemplateSettings,
  Timezones,
} from '@alycecom/modules';
import { GlobalMessage, appApi, gatewayApi } from '@alycecom/services';
import { History } from 'history';

import confirmation from '../modules/AuthModule/store/confirmation.reducer';
import confirmationEpics from '../modules/AuthModule/store/confirmation.epics';
import billing from '../modules/BillingModule/store/billing.reducer';
import billingEpics from '../modules/BillingModule/store/billing.epics';
import dashboard from '../modules/DashboardModule/store/dashboard.reducer';
import dashboardEpics from '../modules/DashboardModule/store/dashboard.epics';
import settings from '../modules/SettingsModule/store/settings.reducer';
import settingsEpic from '../modules/SettingsModule/store/settings.epics';
import marketplace from '../modules/MarketplaceModule/store/marketplace.reducer';
import marketplaceEpics from '../modules/MarketplaceModule/store/marketplace.epics';
import emailBranding from '../modules/EmailBrandingModule/store/emailBranding.reducer';
import usersManagement from '../modules/UsersManagement/store/usersManagement.reducer';
import usersManagementEpics from '../modules/UsersManagement/store/usersManagement.epics';
import { activate, activateEpics } from '../modules/ActivateModule/store';
import { prospectingCampaign, prospectingCampaignEpics } from '../modules/ProspectingCampaignModule/store';
import { swagCampaign, swagCampaignEpics } from '../modules/SwagCampaignModule/store';
import { reporting, reportingSidebar, createReportEpics } from '../modules/ReportingModule/store';
import { roi } from '../modules/DashboardModule/components/DashboardRoi/store';
import { roiEpics } from '../modules/DashboardModule/components/DashboardRoi/store/roi.epics';

import { modules } from './modules/modules.reducer';
import modulesEpics from './modules/modules.epics';
import userEpics from './user/user.epics';
import common from './common/common.reducer';
import redirect from './redirect/redirect.reducer';
import contact from './contact/contact.reducer';
import bulkCreate from './bulkCreateContacts/bulkCreateContacts.reducer';
import commonEpic from './common/common.epics';
import contactEpic from './contact/contact.epics';
import { bulkCreateContactsEpic } from './bulkCreateContacts/bulkCreateContacts.epics';
import { redirectEpics } from './redirect/redirect.epics';
import campaigns from './campaigns/campaigns.reducer';
import campaignsEpics from './campaigns/campaigns.epics';
import teams from './teams/teams.reducer';
import teamsEpics from './teams/teams.epics';
import { reducer as budgetUtilization } from './budgetUtilization/budgetUtilization.reducer';
import { budgetUtilizationEpics } from './budgetUtilization/budgetUtilization.epics';

const { securityEpics, securityReducer } = Security;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const rootReducer = (history: History<unknown>) =>
  combineReducers({
    [appApi.reducerPath]: appApi.reducer,
    [gatewayApi.reducerPath]: gatewayApi.reducer,
    router: connectRouter(history),
    modules,
    createGift: CreateGift.reducer,
    dashboard,
    settings,
    contact,
    common,
    auth: Auth.reducer,
    security: securityReducer,
    bulkCreate,
    contactDetails: ContactDetails.reducer,
    redirect,
    billing,
    marketplace,
    campaigns,
    budgetUtilization,
    teams,
    confirmation,
    emailBranding,
    usersManagement,
    activate,
    prospectingCampaign,
    swagCampaign,
    reporting,
    reportingSidebar,
    roi,
    ...(CommonData.reducers as { [key: string]: unknown }),
    ...(GlobalMessage.reducers as { [key: string]: unknown }),
    ...(PersonalIntegration.reducers as { [key: string]: unknown }),
    ...(PersonalProfileSettings.reducers as { [key: string]: unknown }),
    ...(PersonalGeneralSettings.reducers as { [key: string]: unknown }),
    ...(PersonalTemplateSettings.reducers as { [key: string]: unknown }),
    ...(Timezones.reducers as { [key: string]: unknown }),
  } as const);

export const rootEpic = combineEpics(
  ...modulesEpics,
  ...settingsEpic,
  ...Auth.epics,
  ...securityEpics,
  ...userEpics,
  ...dashboardEpics,
  ...commonEpic,
  ...contactEpic,
  ...GlobalMessage.epics,
  ...CreateGift.epic,
  ...bulkCreateContactsEpic,
  ...ContactDetails.epic,
  ...redirectEpics,
  ...billingEpics,
  ...CommonData.epics,
  ...PersonalIntegration.epics,
  ...PersonalProfileSettings.epics,
  ...PersonalGeneralSettings.epics,
  ...PersonalTemplateSettings.epics,
  ...marketplaceEpics,
  ...campaignsEpics,
  ...teamsEpics,
  ...confirmationEpics,
  ...usersManagementEpics,
  ...Timezones.epics,
  ...activateEpics,
  ...prospectingCampaignEpics,
  ...swagCampaignEpics,
  ...createReportEpics,
  ...budgetUtilizationEpics,
  ...roiEpics,
);
