import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { theme } from '@alycecom/ui';
import { updateSearch } from '@alycecom/modules';
import { useUrlQuery } from '@alycecom/hooks';

import TeamsBreakdown from '../TeamsBreakdown';

jest.mock('@mui/material/Grid', () => 'Grid');
jest.mock('../TeamsBreakdownTable', () => ({ renderToolbar, ...props }) => <div {...props}>{renderToolbar()}</div>);
jest.mock('@alycecom/modules/dist/services/url.service');
jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
}));

describe('TeamsBreakdown', () => {
  let props;
  beforeEach(() => {
    props = {
      breakdown: [],
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
