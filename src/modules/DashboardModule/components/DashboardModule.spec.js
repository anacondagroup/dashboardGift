import React from 'react';
import { shallow } from 'enzyme';

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
  connect: jest.fn(() => c => c),
  useDispatch: jest.fn(),
}));

describe('DashboardModule', () => {
  beforeAll(() => jest.spyOn(window, 'scrollTo').mockImplementation(jest.fn()));
  afterAll(() => window.scrollTo.mockRestore());

  it('Should load user, teams, campaigns on mount', () => {
    const match = {
      url: '/',
      params: {},
      path: '/',
    };
    const location = {
      pathname: '/',
      hash: '',
      search: '',
    };

    const wrapper = shallow(<DashboardModule location={location} match={match} />);

    expect(wrapper.find(AppBarLayout).exists()).toBe(true);
  });
});
