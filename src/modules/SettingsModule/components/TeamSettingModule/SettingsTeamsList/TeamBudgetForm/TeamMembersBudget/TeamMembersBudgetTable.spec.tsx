import React from 'react';
import { useForm } from 'react-hook-form';

import { useDispatch } from 'react-redux';

import { render, screen, waitFor, cleanup } from '../../../../../../../testUtils';
import {
  teamBudgetFormDefaultValues,
  teamBudgetFormResolver,
} from '../../../../../store/teams/budgetCreate/budgetCreate.schemas';
import { RefreshPeriod, TBudgetCreateParams } from '../../../../../store/teams/budgetCreate/budgetCreate.types';

import TeamMembersBudgetTable from './TeamMembersBudgetTable';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn().mockImplementation(fn => fn()),
  connect: () => () => {},
}));

jest.mock('../../../../../store/teams/budgetCreate/budgetCreate.selectors');

const DEFAULT_TABLE_PROPS = {
  users: [
    {
      id: 0,
      firstName: 'John',
      email: 'j.mcdonalds@alyce.com',
      lastName: 'Mc Donald',
      isLastAdmin: false,
      lastActivity: '07-07-2022',
      teams: [],
      integration: null,
    },
  ],
  teamUtilizations: [
    {
      userId: 0,
      teamId: 1,
      budgetAmount: 1000,
      amountSent: 200,
      amountClaimed: 100,
      period: 'weekly',
    },
  ],
  teamMembersHaveLoaded: false,
  isAllSelected: false,
  refreshPeriod: RefreshPeriod.Monthly,
  handleSelectUser: jest.fn(),
  onMemberBudgetDefinition: () => {},
  handleSelectAllTeamMembers: jest.fn(),
};

const useDispatchMock = useDispatch as jest.MockedFunction<typeof useDispatch>;

describe('TeamMembersBudgetTable', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    useDispatchMock.mockReset();
    dispatch.mockReset();
    useDispatchMock.mockReturnValue(dispatch);
  });

  afterEach(cleanup);

  const setup = (props = DEFAULT_TABLE_PROPS) => {
    const Component = () => {
      const { control } = useForm<TBudgetCreateParams>({
        mode: 'all',
        defaultValues: teamBudgetFormDefaultValues,
        resolver: teamBudgetFormResolver,
      });

      const teamMembersBudgetTableProps = {
        ...props,
        control,
      };

      return <TeamMembersBudgetTable {...teamMembersBudgetTableProps} />;
    };

    return render(<Component />);
  };

  it('should render the Table and its correct elements at the first rendering', async () => {
    setup();

    const loading = screen.getByTestId('TeamMembersBudget.TableLoading');
    const tableHead = screen.getByTestId('TeamMembersBudgetTable.Head');

    await waitFor(() => {
      expect(loading).toBeInTheDocument();
      expect(tableHead).toBeTruthy();
    });
  });

  it('should render rows and users', async () => {
    setup({ ...DEFAULT_TABLE_PROPS, teamMembersHaveLoaded: true });

    const { firstName, lastName } = DEFAULT_TABLE_PROPS.users[0];

    const mockedUser = screen.getByTestId(`TeamMembersBudget.Table.${DEFAULT_TABLE_PROPS.users[0].id}.Name`);
    const mockedUserName = screen.getByText(`${firstName} ${lastName}`);

    await waitFor(() => {
      expect(mockedUser).toBeInTheDocument();
      expect(mockedUserName).toBeInTheDocument();
    });
  });
});
