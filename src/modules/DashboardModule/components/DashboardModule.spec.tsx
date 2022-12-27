import React from 'react';
import { shallow } from 'enzyme';
import { createBrowserHistory } from 'history';

import DashboardModule from './DashboardModule';
import AppBarLayout from '../../../components/Dashboard/Shared/AppBarLayout';

jest.mock('@alycecom/modules/dist/Auth/hooks/useAuthService', () => ({
  useAuthService: () => ({}),
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  // eslint-disable-next-line global-require
  makeStyles: require('../../../libs/mocks').mockMakeStyles,
  withStyles: jest.fn(() => jest.fn()),
}));
jest.mock('react-redux', () => ({
  connect: jest.fn(() => jest.fn()),
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  withRouter: jest.fn(),
}));

describe('DashboardModule', () => {
  it('Should load user, teams, campaigns on mount', () => {
    const match = {
      url: '/',
      params: { url: '' },
      path: '/',
      isExact: true,
    };
    const location = {
      pathname: '/',
      hash: '',
      search: '',
      state: {},
    };
    const history = createBrowserHistory();

    const wrapper = shallow(<DashboardModule history={history} location={location} match={match} />);

    expect(wrapper.find(AppBarLayout).exists()).toBe(true);
  });
});
