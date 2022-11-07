import React from 'react';
import PropTypes from 'prop-types';
import { render as rtlRender } from '@testing-library/react';
import { theme } from '@alycecom/ui';
import { ConnectedRouter } from 'connected-react-router';
import { createBrowserHistory, createMemoryHistory } from 'history';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createEpicMiddleware } from 'redux-observable';
import { GlobalMessage } from '@alycecom/services';
import { useForm, FormProvider } from 'react-hook-form';

import { rootReducer, rootEpic } from './store/root';
import { configureStore } from './store/configureStore';

const render = (
  ui,
  {
    initialState,
    history = createMemoryHistory(),
    store = createStore(rootReducer(history), initialState),
    ...renderOptions
  } = {},
) => {
  // eslint-disable-next-line no-param-reassign
  store.dispatch = jest.fn();

  const Wrapper = ({ children }) => (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        {initialState ? (
          <Provider store={store}>
            <ConnectedRouter history={history}>{children}</ConnectedRouter>
          </Provider>
        ) : (
          children
        )}
      </ThemeProvider>
    </StyledEngineProvider>
  );

  Wrapper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  };

  const utils = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });

  const rerender = (uiWithNewProps, options) =>
    render(uiWithNewProps, {
      container: utils.container,
      ...options,
    });

  return {
    ...utils,
    ...store,
    rerender,
  };
};

const renderWithReduxProvider = ui => {
  const store = configureStore();
  const history = createBrowserHistory();

  const Wrapper = ({ children }) => (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <ConnectedRouter history={history}>{children}</ConnectedRouter>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );

  Wrapper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]).isRequired,
  };

  const utils = rtlRender(ui, { wrapper: Wrapper });

  const rerender = (uiWithNewProps, options) =>
    render(uiWithNewProps, {
      container: utils.container,
      ...options,
    });

  return {
    ...utils,
    ...store,
    rerender,
  };
};

export const testEpic = (action, initialState = {}, deps = {}) => {
  const history = createMemoryHistory();
  const reducer = rootReducer(history);

  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      apiService: {},
      authService: {
        tokenService: {
          getToken: () => undefined,
          setToken: () => undefined,
        },
      },
      messagesService: GlobalMessage.messagesService,
      ...deps,
    },
  });
  const enhancer = applyMiddleware(epicMiddleware);

  const store = createStore(reducer, initialState, enhancer);
  epicMiddleware.run(rootEpic);

  store.dispatch(action);

  return store;
};

export function withReactHookForm(WrappedComponent, useFormParams = {}, restProps = {}) {
  function FormComponent() {
    const methods = useForm(useFormParams);
    return (
      <FormProvider {...methods}>
        <WrappedComponent {...restProps} />
      </FormProvider>
    );
  }
  return FormComponent;
}

export { default as userEvent } from '@testing-library/user-event';
export * from '@testing-library/react';
export { render, renderWithReduxProvider };
