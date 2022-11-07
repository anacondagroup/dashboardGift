import * as React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { LastLocationProvider } from 'react-router-last-location';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { Auth } from '@alycecom/modules';
import { GlobalMessage } from '@alycecom/services';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

import { configureStore, history, authService } from './store/configureStore';
import GlobalStyles from './styles/alyce-global-styles';
import Routes from './Routes';
import { theme } from './styles/alyce-theme';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

const store = configureStore();

if (window.APP_CONFIG.environment !== 'production') {
  // eslint-disable-next-line global-require
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React);
}

const persistor = persistStore(store);

const App = React.memo(() => (
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
));

export default App;
