import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';
import { updateSearch, Auth, User } from '@alycecom/modules';
import { useUrlQuery } from '@alycecom/hooks';

import { ISelectFilterProps } from '@alycecom/ui';
import TeamFilters, { ITeamFiltersProps } from '../TeamFilters';
import { getTeams, makeCanEditTeamById } from '../../../../../store/teams/teams.selectors';

const mockedUseRouteMatch = useRouteMatch as jest.Mock;
const mockedUseSelector = useSelector as jest.Mock;
const mockedMakeCanEditTeamById = makeCanEditTeamById as jest.Mock;
const mockedUseUrlQuery = useUrlQuery as jest.Mock;
const mockedUpdateSearch = updateSearch as jest.Mock;

jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  // eslint-disable-next-line global-require
  makeStyles: require('../../../../../libs/mocks').mockMakeStyles,
  withStyles: jest.fn(() => jest.fn()),
}));
jest.mock('react-redux', () => ({
  connect: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  shallowEqual: 'shallowEqual',
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn(),
  useRouteMatch: jest.fn(),
  Link: 'Link',
}));
jest.mock('react-router-last-location', () => ({
  useLastLocation: jest.fn(),
}));
jest.mock('@alycecom/hooks', () => ({
  ...jest.requireActual('@alycecom/hooks'),
  useUrlQuery: jest.fn(),
  useRouting: jest.fn(),
  useSetUrlQuery: jest.fn(),
}));
jest.mock('@alycecom/modules', () => ({
  ...jest.requireActual('@alycecom/modules'),
  updateSearch: jest.fn(),
}));
jest.mock('@alycecom/ui', () => ({
  ...jest.requireActual('@alycecom/ui'),
  DateRangeSelect: 'DateRangeSelect',
  Icon: 'Icon',
}));
jest.mock(
  '../../../../../components/Dashboard/Header/SelectFilter',
  () => ({ renderItems, ...props }: Required<ISelectFilterProps>) => <div {...props}>{renderItems()}</div>,
);
jest.mock('../../../../../hoc/HasPermission/HasPermission', () => 'HasPermission');
jest.mock('../../../../../store/teams/teams.selectors');

describe('TeamFilters', () => {
  let props: ITeamFiltersProps;

  beforeEach(() => {
    props = {
      isLoading: true,
    };

    mockedUseRouteMatch.mockReturnValue({ params: { teamId: '1' } });
    mockedMakeCanEditTeamById.mockReset();
    mockedUseUrlQuery.mockReset().mockReturnValue({});
    mockedUpdateSearch.mockReset().mockReturnValue('param=value');
    mockedUseSelector.mockReset().mockReturnValueOnce([
      { id: 1, name: 'Team A' },
      { id: 2, name: 'Horde' },
    ]);
  });

  test('selectors', () => {
    mockedUseSelector.mockReturnValueOnce(false);

    mockedMakeCanEditTeamById.mockReturnValue('makeCanEditTeamByIdResult');
    shallow(<TeamFilters {...props} />);

    expect(mockedMakeCanEditTeamById).toBeCalledWith('1');
    expect(mockedUseUrlQuery).toBeCalled();

    expect(mockedUseSelector.mock.calls).toEqual([
      [getTeams, shallowEqual],
      ['makeCanEditTeamByIdResult'],
      [User.selectors.getUserId],
      [Auth.selectors.getLoginAsAdminId],
    ]);
  });

  it('should be rendered without edit feature', () => {
    mockedUseSelector.mockReturnValueOnce(false);
    // @ts-ignore
    const tree = create(shallow(<TeamFilters {...props} />));

    expect(tree).toMatchSnapshot();
  });

  it('should be rendered with edit feature', () => {
    mockedUseSelector.mockReturnValueOnce(true);

    mockedUseUrlQuery.mockReturnValue({
      dateRangeTo: '2012-12-12',
      dateRangeFrom: '2011-11-11',
    });
    props.isLoading = false;

    // @ts-ignore
    const tree = create(shallow(<TeamFilters {...props} />));

    expect(tree).toMatchSnapshot();
  });
});
