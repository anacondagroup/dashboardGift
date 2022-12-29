import React from 'react';
import { RefreshPeriod, TBudgetCreateParams } from '@alycecom/services';
import { FormProvider, useForm } from 'react-hook-form';

import { useDispatch, useSelector } from 'react-redux';

import { render, screen, waitFor, cleanup } from '../../../../../../../testUtils';
import {
  teamBudgetFormDefaultValues,
  teamBudgetFormResolver,
} from '../../../../../store/teams/budgetCreate/budgetCreate.schemas';

import TeamMembersBudgetTable from './TeamMembersBudgetTable';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
  connect: () => () => {},
}));

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
  teamId: 1,
  teamMembersHaveLoaded: false,
};

const useDispatchMock = useDispatch as jest.MockedFunction<typeof useDispatch>;

describe('TeamMembersBudgetTable', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    useDispatchMock.mockReset();
    dispatch.mockReset();
    useDispatchMock.mockReturnValue(dispatch);

    useSelector.mockImplementation(fn =>
      fn({
        settings: {
          ui: {
            teamBudget: {
              isAllUsersSelected: false,
              selectedUserIds: [],
            },
          },
          teams: {
            budgets: {
              entities: {},
              ids: [],
            },
          },
        },
        budgetUtilization: {
          teamUtilization: [
            {
              userId: 0,
              teamId: 1,
              budgetAmount: 1000,
              amountSent: 200,
              amountClaimed: 100,
              period: RefreshPeriod.Weekly,
            },
          ],
        },
      }),
    );
  });

  afterEach(cleanup);

  const setup = (props = DEFAULT_TABLE_PROPS) => {
    const Component = () => {
      const formMethods = useForm<TBudgetCreateParams>({
        mode: 'all',
        defaultValues: teamBudgetFormDefaultValues,
        resolver: teamBudgetFormResolver,
      });

      const { control } = formMethods;

      const teamMembersBudgetTableProps = {
        ...props,
        control,
      };

      return (
        <FormProvider {...formMethods}>
          <TeamMembersBudgetTable {...teamMembersBudgetTableProps} />
        </FormProvider>
      );
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
    const warningIcon = screen.getByTestId('TeamMembersBudgetTable.WarningIcon');

    await waitFor(() => {
      expect(mockedUser).toBeInTheDocument();
      expect(mockedUserName).toBeInTheDocument();
      expect(warningIcon).toBeInTheDocument();
    });
  });
});
