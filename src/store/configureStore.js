import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { createEpicMiddleware } from 'redux-observable';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Auth } from '@alycecom/modules';
import {
  createApiService,
  cookiesStorage as storageService,
  GlobalMessage,
  createTokenService,
  appApi,
  setAppApiOptions,
  appApiRejectionsLoggerMiddleware,
  gatewayApi,
  setGatewayApiOptions,
} from '@alycecom/services';
import { downloadFile, getDomain } from '@alycecom/utils';
import { configureStore as rjsConfigureStore } from '@reduxjs/toolkit';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import { createGiftCreateService } from '../services/createGift.service';
import { createGeneralSettingsService } from '../services/generalSettings.service';
import { analyticService } from '../services/analytics.service';
import { createPersonalSettingsService } from '../services/personalSettings.service';
import { getMarketoBaseUrl } from '../helpers/url.helpers';

import { rootEpic, rootReducer } from './root';

export const history = createBrowserHistory();

export const tokenService = createTokenService({
  storageService,
  cookieAttrs: {
    url: window.APP_CONFIG.dashboardHost,
    path: '/',
    domain: getDomain(window.APP_CONFIG.dashboardHost),
  },
});
export const authService = Auth.services.createAuthService({
  strategy: window.APP_CONFIG.authStrategy,
  appHost: window.APP_CONFIG.dashboardHost,
  apiHost: window.APP_CONFIG.apiHost,
  callbackUrl: `${window.APP_CONFIG.dashboardHost}/callback`,
  returnUrl: `${window.APP_CONFIG.dashboardHost}/login/redirect`,
  tokenService,
});
setAppApiOptions({ baseUrl: window.APP_CONFIG.apiHost, getToken: () => tokenService.getToken() });
setGatewayApiOptions({ baseUrl: window.APP_CONFIG.gatewayHost, getToken: () => tokenService.getToken() });
export const apiService = createApiService({ baseUrl: window.APP_CONFIG.apiHost, tokenService });
export const marketoService = createApiService({ baseUrl: getMarketoBaseUrl(), tokenService });
export const salesforceApiService = createApiService({
  baseUrl: window.APP_CONFIG.gatewayHost,
  withCredentials: false,
  tokenService,
});
export const apiGateway = createApiService({ baseUrl: window.APP_CONFIG.gatewayHost, tokenService });

const createGiftService = createGiftCreateService(apiService);
const generalSettingsService = createGeneralSettingsService(apiService);
const personalSettingsService = createPersonalSettingsService(apiService);

export const configureStore = () => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      apiService,
      marketoService,
      salesforceApiService,
      apiGateway,
      storageService,
      authService,
      downloadFile,
      createGiftService,
      generalSettingsService,
      personalSettingsService,
      messagesService: GlobalMessage.messagesService,
      analyticService,
    },
  });

  const middlewares = [
    routerMiddleware(history),
    Auth.createAuthMiddleware(authService),
    epicMiddleware,
    appApi.middleware,
    gatewayApi.middleware,
    appApiRejectionsLoggerMiddleware,
  ];

  const epic$ = new BehaviorSubject(rootEpic);

  const hotReloadingEpic = (...args) => epic$.pipe(switchMap(epic => epic(...args)));

  const store = rjsConfigureStore({
    reducer: rootReducer(history),
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(middlewares),
    devTools: true,
  });

  epicMiddleware.run(hotReloadingEpic);

  if (module.hot) {
    module.hot.accept('./root', () => {
      store.replaceReducer(rootReducer);
      epic$.next(rootEpic);
    });
  }

  return store;
};
