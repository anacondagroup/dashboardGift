import { RouterState } from 'connected-react-router';
import { IAuthState, IContactDetailsState, ICreateGiftState, Security } from '@alycecom/modules';
import { appApi, gatewayApi } from '@alycecom/services';

import { IConfirmationState } from '../modules/AuthModule/store/confirmation.reducer';
import { IBillingState } from '../modules/BillingModule/store/billing.reducer';
import { ISettingsState } from '../modules/SettingsModule/store/settings.reducer';
import { IDashboardState } from '../modules/DashboardModule/store/dashboard.reducer';
import { IMarketplaceState } from '../modules/MarketplaceModule/store/marketplace.reducer';
import { IEmailBrandingState } from '../modules/EmailBrandingModule/store/emailBranding.reducer';
import { IUsersManagementState } from '../modules/UsersManagement/store/usersManagement.reducer';
import { TActivateModuleState } from '../modules/ActivateModule/store';
import { TProspectingCampaignState } from '../modules/ProspectingCampaignModule/store';
import { IReportingState, ISidebarState } from '../modules/ReportingModule/store';
import { TRoiState } from '../modules/DashboardModule/components/DashboardRoi/store';
import { TSwagCampaignState } from '../modules/SwagCampaignModule/store';

import { IContactState } from './contact/contact.reducer';
import { ICommonState } from './common/common.reducer';
import { ICampaignsState } from './campaigns/campaigns.reducer';
import { ITeamsState } from './teams/teams.reducer';
import { TModulesState } from './modules/modules.reducer';
import { TBudgetUtilizationState } from './budgetUtilization/budgetUtilization.reducer';

// TODO Remove once all properties of root state is defined
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface IRootState {
  router: RouterState;
  modules: TModulesState;
  createGift: ICreateGiftState;
  dashboard: IDashboardState;
  settings: ISettingsState;
  contact: IContactState;
  common: ICommonState;
  auth: IAuthState;
  security: Security.ISecurityState;
  bulkCreate: any;
  contactDetails: IContactDetailsState;
  redirect: any;
  billing: IBillingState;
  marketplace: IMarketplaceState;
  campaigns: ICampaignsState;
  teams: ITeamsState;
  confirmation: IConfirmationState;
  emailBranding: IEmailBrandingState;
  usersManagement: IUsersManagementState;
  activate: TActivateModuleState;
  prospectingCampaign: TProspectingCampaignState;
  swagCampaign: TSwagCampaignState;
  reporting: IReportingState;
  reportingSidebar: ISidebarState;
  budgetUtilization: TBudgetUtilizationState;
  roi: TRoiState;
  [appApi.reducerPath]: typeof appApi.reducer;
  [gatewayApi.reducerPath]: typeof gatewayApi.reducer;
}
