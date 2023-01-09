import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { theme } from '@alycecom/ui';
import { updateSearch } from '@alycecom/modules';
import { useUrlQuery } from '@alycecom/hooks';

import TeamsBreakdown from '../TeamsBreakdown';
import { getTeams } from '../../../../../../store/teams/teams.selectors';

jest.mock('@mui/material/Grid', () => 'Grid');
jest.mock('../TeamsBreakdownTable', () => ({ renderToolbar, ...props }) => <div {...props}>{renderToolbar()}</div>);
jest.mock('@alycecom/modules/dist/services/url.service');
jest.mock('../../../../../../store/teams/teams.selectors');
jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
}));

jest.mock('react-redux', () => ({
  connect: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
}));

describe.skip('TeamsBreakdown', () => {
  let props;
  beforeEach(() => {
    getTeams.mockReset().mockReturnValue([
      { id: 1, name: 'Team 1', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
      { id: 2, name: 'Team 2', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
    ]);
    props = {
      breakdown: [
        { id: 1, name: 'Team 1', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
        { id: 2, name: 'Team 2', settings: { country_id: 1, currency_id: 1, enterprise_mode_enabled: true } },
      ],
      isLoading: true,
      onChangeDateRange: jest.fn(),
    };
    useUrlQuery.mockReset();
    updateSearch.mockReset();
    updateSearch.mockImplementation((search, updateObj) => JSON.stringify({ search, updateObj }));
  });

  test('render while breakdown is loading', () => {
    useUrlQuery.mockReturnValue({});

    const tree = create(
      shallow(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <TeamsBreakdown {...props} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ),
    );

    expect(tree).toMatchSnapshot();
  });

  test('render with breakdown', () => {
    useUrlQuery.mockReturnValue({
      teamsDirection: 'asc',
      teamsSort: 'someProperty',
      teamsSearch: 'search',
      dateRangeFrom: '2011-11-11',
      dateRangeTo: '2012-12-12',
      teamsPage: '0',
    });
    props = {
      breakdown: [{ id: 0, prop: 'value' }],
      isLoading: false,
      onChangeDateRange: jest.fn(),
    };

    const tree = create(
      shallow(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <TeamsBreakdown {...props} />
          </ThemeProvider>
        </StyledEngineProvider>,
      ),
    );

    expect(tree).toMatchSnapshot();
  });
});
