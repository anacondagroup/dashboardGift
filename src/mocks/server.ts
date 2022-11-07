import { RequestHandler } from 'msw';
import { setupServer, SetupServerApi } from 'msw/node';
import { CommonData, Security, Features, Timezones, Currencies, User } from '@alycecom/modules';

import { dashboardCampaignsMocks } from '../store/campaigns/campaigns.mocks';
import { dashboardTeamsMocks } from '../store/teams/teams.mocks';
import { permissionsMocks } from '../store/common/permissions/permissions.mocks';

const deafaultHandlers: RequestHandler[] = [
  ...dashboardCampaignsMocks,
  ...dashboardTeamsMocks,
  ...permissionsMocks,
  ...CommonData.mocks.commonDataMocks,
  ...Security.mocks.securityMocks,
  ...Features.mocks.featuresMocks,
  ...Timezones.mocks.timezonesMocks,
  ...Currencies.mocks.currenciesMocks,
  ...User.mocks.userMocks,
];

export const setupTestServer = (...handlers: RequestHandler[]): SetupServerApi =>
  setupServer(...deafaultHandlers, ...handlers);
