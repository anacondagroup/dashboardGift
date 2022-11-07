import React from 'react';
import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import '@testing-library/jest-dom/extend-expect';
import 'mutationobserver-shim';

configure({ adapter: new Adapter() });

React.useLayoutEffect = React.useEffect;

// @ts-ignore
global.APP_CONFIG = {
  apiHost: 'http://localhost',
  dashboardHost: 'http://localhost', // used to derive APP_HOST
  marketoApiHost: 'http://localhost',
  appHost: 'http://localhost',
  gatewayHost: 'http://localhost',
  segmentApiKey: '',
  dataDogApiKey: '',
  authStrategy: 'auth0',
  rollbarAccessToken: '',
  environment: 'development',
  vidyardClientId: '',
  codeVersion: '',
  hubspotAppHost: 'http://localhost',
  workatoAppHost: 'http://localhost',
};

Object.defineProperty(window, 'location', {
  writable: true,
  value: { assign: jest.fn() },
});
