import React from 'react';
import { render } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { theme } from '@alycecom/ui';

export const mockMakeStyles = () => () =>
  new Proxy(
    {},
    {
      get: (target, prop, receiver) => {
        if (!Reflect.has(target, prop)) {
          Reflect.set(target, prop, `local_${prop}`);
        }
        return Reflect.get(target, prop, receiver);
      },
    },
  );

export const mockComponent = Component =>
  render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{Component}</ThemeProvider>
    </StyledEngineProvider>,
  );
