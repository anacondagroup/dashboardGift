import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { LastLocationProvider } from 'react-router-last-location';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { Auth, MESSAGES_IGNORED } from '@alycecom/modules';
import { GlobalMessage } from '@alycecom/services';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { Provider as RollbarProvider } from '@rollbar/react';

import { configureStore, history, authService } from './store/configureStore';
import GlobalStyles from './styles/alyce-global-styles';
import Routes from './Routes';
import { theme } from './styles/alyce-theme';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const { rollbarAccessToken, environment, codeVersion } = window.APP_CONFIG;

const store = configureStore();

if (environment !== 'production') {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const persistor = persistStore(store);

const rollbarConfig = {
  enabled: Boolean(rollbarAccessToken && !rollbarAccessToken.includes('ROLLBAR_TOKEN_FRONT')),
  accessToken: rollbarAccessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment,
    server: {
      root: '/src',
    },
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: codeVersion,
        guess_uncaught_frames: true,
      },
    },
  },
  ignoredMessages: MESSAGES_IGNORED,
};

const App = React.memo(() => (
  <RollbarProvider config={rollbarConfig}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ConnectedRouter history={history}>
          <LastLocationProvider>
            <StyledEngineProvider injectFirst>
              <ThemeProvider theme={theme}>
                <GlobalStyles />
                <Auth.AuthServiceProvider authService={authService}>
                  <>
                    <Routes />
                    <GlobalMessage.Message />
                  </>
                </Auth.AuthServiceProvider>
              </ThemeProvider>
            </StyledEngineProvider>
          </LastLocationProvider>
        </ConnectedRouter>
      </PersistGate>
    </Provider>
  </RollbarProvider>
));

export default App;
