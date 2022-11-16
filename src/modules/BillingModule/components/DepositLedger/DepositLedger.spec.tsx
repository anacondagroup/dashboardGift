import React from 'react';
import moment from 'moment';

import { render, screen, userEvent, waitFor } from '../../../../testUtils';
import {
  ICustomerOrgState,
  initialState as customerOrgInitialState,
} from '../../store/customerOrg/customerOrg.reducer';
import { initialState as operationsInitialState, IOperationsState } from '../../store/operations/operations.reducer';
import { loadHierarchyRequest, setSelectedHierarchyId } from '../../store/customerOrg';
import { loadTypesRequest, setSelectedTypes } from '../../store/operations';
import { OperationType } from '../../constants/operations.constants';

import DepositLedger from './DepositLedger';
import { GroupsTeamsConstants } from '../../constants/groupsTeams.constants';
import { AllGroupsAndTeamsOption, UngroupedTeamsOption } from '../../store/customerOrg/customerOrg.constants';

describe('DepositLedger', () => {
  const setup = (customerOrgState: ICustomerOrgState, operationsState: IOperationsState) =>
    render(<DepositLedger />, {
      initialState: {
        billing: {
          customerOrg: customerOrgState,
          operations: operationsState,
        },
      },
    });

  test('Should render loading labels while hierarchy is loading', () => {
    setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          isLoading: true,
        },
      },
      {
        ...operationsInitialState,
      },
    );

    expect(screen.getByTestId('DepositLedger.GroupsAndTeams')).toBeInTheDocument();
    expect(screen.getByTestId('DepositLedger.TypeSelect')).toBeInTheDocument();
    expect(screen.getByTestId('DepositLedger.DateRange')).toBeInTheDocument();

    expect(screen.queryAllByTestId('TableLoadingLabel')).toHaveLength(30);
  });

  test('Should render loading labels while operations are loading', () => {
    setup(
      {
        ...customerOrgInitialState,
      },
      {
        ...operationsInitialState,
        operations: {
          ...operationsInitialState.operations,
          isLoading: true,
        },
      },
    );

    expect(screen.queryAllByTestId('TableLoadingLabel')).toHaveLength(30);
  });

  test('Should request hierarchy and types', () => {
    const { dispatch } = setup(
      {
        ...customerOrgInitialState,
      },
      {
        ...operationsInitialState,
      },
    );

    expect(dispatch).toBeCalledWith(loadHierarchyRequest());
    expect(dispatch).toBeCalledWith(loadTypesRequest());
  });

  test('Should render hierarchy with groups and teams', () => {
    setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: 1110.79,
              },
            },
            remainingTeamsTotal: {
              accountId: 'Ungrouped',
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [
              {
                groupInfo: {
                  groupId: 'g1',
                  groupName: 'Group 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: 1234 },
                  },
                ],
                teams: [
                  {
                    teamInfo: {
                      teamId: 1,
                      teamName: 'Team 1',
                    },
                    deposits: [
                      {
                        accountId: 'acc2',
                        money: { amount: 0 },
                      },
                    ],
                  },
                ],
              },
            ],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 2,
                  teamName: 'Team 2',
                },
                deposits: [
                  {
                    accountId: 'acc3',
                    money: { amount: -123.21 },
                  },
                ],
              },
              {
                teamInfo: {
                  teamId: 3,
                  teamName: 'Team 3',
                },
                deposits: [
                  {
                    accountId: 'acc4',
                    money: { amount: 0 },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        ...operationsInitialState,
      },
    );

    expect(screen.queryByTestId('TableLoadingLabel')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('Groups and Teams'));

    expect(
      screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.${GroupsTeamsConstants.AllGroupsAndTeams}`),
    ).toHaveTextContent(/^All Groups\$1,110.79$/);
    expect(screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.group-g1`)).toHaveTextContent(/^Group 1\$1,234.00$/);
    expect(screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.team-3`)).toHaveTextContent(/^Team 3\$0.00$/);
  });

  test('Should render hierarchy with grouped teams', () => {
    setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: 1110.79,
              },
            },
            remainingTeamsTotal: {
              accountId: 'Ungrouped',
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [
              {
                groupInfo: {
                  groupId: 'g1',
                  groupName: 'Group 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: 1234 },
                  },
                ],
                teams: [
                  {
                    teamInfo: {
                      teamId: 1,
                      teamName: 'Team 1',
                    },
                    deposits: [
                      {
                        accountId: 'acc2',
                        money: { amount: 0 },
                      },
                    ],
                  },
                ],
              },
            ],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 2,
                  teamName: 'Team 2',
                },
                deposits: [
                  {
                    accountId: 'acc3',
                    money: { amount: -123.21 },
                  },
                ],
              },
              {
                teamInfo: {
                  teamId: 3,
                  teamName: 'Team 3',
                },
                deposits: [
                  {
                    accountId: 'acc4',
                    money: { amount: 0 },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        ...operationsInitialState,
      },
    );

    expect(screen.queryByTestId('TableLoadingLabel')).not.toBeInTheDocument();

    userEvent.click(screen.getByLabelText('Groups and Teams'));

    expect(screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.team-1`)).toHaveTextContent(/^Team 1$/);
    expect(screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.team-2`)).toHaveTextContent(/^Team 2-\$123.21$/);
    expect(screen.getByTestId(`DepositLedger.GroupsAndTeams.Option.team-3`)).toHaveTextContent(/^Team 3\$0.00$/);
  });

  test('Should select account by click', async () => {
    const { dispatch } = setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: -246.42,
              },
            },
            remainingTeamsTotal: {
              accountId: 'Ungrouped',
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: -123.21 },
                  },
                ],
              },
              {
                teamInfo: {
                  teamId: 2,
                  teamName: 'Team 2',
                },
                deposits: [
                  {
                    accountId: 'acc2',
                    money: { amount: -123.21 },
                  },
                ],
              },
            ],
          },
        },
      },
      {
        ...operationsInitialState,
      },
    );

    userEvent.click(screen.getByLabelText('Groups and Teams'));
    userEvent.click(screen.getByTestId('DepositLedger.GroupsAndTeams.Option.team-2'));

    expect(dispatch).toBeCalledWith(setSelectedHierarchyId('team-2'));
  });

  test('Should request operations when types filter changed', async () => {
    const { dispatch } = setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: -123.21,
              },
            },
            remainingTeamsTotal: {
              accountId: UngroupedTeamsOption.accountId,
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: -123.21 },
                  },
                ],
              },
            ],
          },
          selectedHierarchyId: 'team-1',
        },
      },
      {
        ...operationsInitialState,
        typesFilter: {
          ...operationsInitialState.typesFilter,
          items: [
            { id: 'deposit', name: 'Deposit' },
            { id: 'withdrawal', name: 'Withdrawal' },
          ],
          selected: ['deposit'],
        },
      },
    );

    userEvent.click(screen.getByTestId('DepositLedger.TypeSelect').children[0]);
    await waitFor(() => {
      expect(screen.queryByTestId('DepositLedger.TypeSelect.Withdrawal')).toBeInTheDocument();
    });
    userEvent.click(screen.getByTestId('DepositLedger.TypeSelect.Withdrawal'));

    expect(dispatch).toBeCalledWith(setSelectedTypes(['deposit', 'withdrawal']));
  });

  test('Should render operations list', async () => {
    setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: -123.21,
              },
            },
            remainingTeamsTotal: {
              accountId: 'Ungrouped',
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: -123.21 },
                  },
                ],
              },
            ],
          },
          selectedHierarchyId: 'team-1',
        },
      },
      {
        ...operationsInitialState,
        typesFilter: {
          ...operationsInitialState.typesFilter,
          items: [
            {
              id: 'deposit',
              name: 'Deposit',
              children: [
                {
                  id: 'deposit',
                  name: 'Deposit',
                },
                {
                  id: 'historic_deposit',
                  name: 'Historic deposit',
                },
              ],
            },
            {
              id: 'withdrawal',
              name: 'Withdrawal',
              children: [
                {
                  id: 'withdraw',
                  name: 'Withdraw',
                },
                {
                  id: 'gifting_withdrawal',
                  name: 'Gifting withdrawal',
                },
                {
                  id: 'historic_withdraw',
                  name: 'Historic withdraw',
                },
              ],
            },
          ],
          selected: ['deposit', 'withdrawal'],
        },
        operations: {
          ...operationsInitialState.operations,
          list: [
            {
              id: 'op1',
              operatedAt: moment().utc().format('YYYY-MM-DD'),
              amount: { amount: 123 },
              accountRemaining: { amount: 1234 },
              typeId: OperationType.Deposit,
              references: {},
            },
            {
              id: 'op2',
              operatedAt: moment().utc().format('YYYY-MM-DD'),
              amount: { amount: -123 },
              accountRemaining: { amount: 0 },
              typeId: OperationType.GiftingWithdrawal,
              references: { giftId: 12321 },
            },
            {
              id: 'op3',
              operatedAt: moment().utc().format('YYYY-MM-DD'),
              amount: { amount: 0 },
              accountRemaining: { amount: 0 },
              typeId: OperationType.Unknown,
              references: {},
              comment: 'Some comment',
            },
          ],
        },
      },
    );

    expect(screen.queryByTestId('DepositLedger.List.Note.op1')).toHaveTextContent(/^$/);

    expect(screen.queryByTestId('DepositLedger.List.Reference.Link.op2')).toHaveTextContent(/^gift #12321$/);
    expect(screen.queryByTestId('DepositLedger.List.Amount.op2')).toHaveTextContent(/^-\$123\.00$/);

    expect(screen.queryByTestId('DepositLedger.List.Amount.op3')).toHaveTextContent(/^\$0\.00$/);
    expect(screen.queryByTestId('DepositLedger.List.Type.op3')).toHaveTextContent(/^unknown$/);
    expect(screen.queryByTestId('DepositLedger.List.Reference.op3')).toHaveTextContent(/^-$/);
    expect(screen.queryByTestId('DepositLedger.List.Note.op3')).toHaveTextContent(/^Some comment$/);
  });

  test('Should not display remaining deposit when not all types selected', () => {
    setup(
      {
        ...customerOrgInitialState,
        hierarchy: {
          ...customerOrgInitialState.hierarchy,
          data: {
            depositsTotal: {
              accountId: AllGroupsAndTeamsOption.accountId,
              money: {
                amount: -123.21,
              },
            },
            remainingTeamsTotal: {
              accountId: 'Ungrouped',
              money: {
                amount: 2500.84,
              },
            },
            groupGrouped: [],
            ungrouped: [
              {
                teamInfo: {
                  teamId: 1,
                  teamName: 'Team 1',
                },
                deposits: [
                  {
                    accountId: 'acc1',
                    money: { amount: -123.21 },
                  },
                ],
              },
            ],
          },
          selectedHierarchyId: 'team-1',
        },
      },
      {
        ...operationsInitialState,
        typesFilter: {
          ...operationsInitialState.typesFilter,
          items: [
            { id: 'deposit', name: 'Deposit' },
            { id: 'withdrawal', name: 'Withdrawal' },
          ],
          selected: [],
        },
        operations: {
          ...operationsInitialState.operations,
          list: [
            {
              id: 'op1',
              operatedAt: moment().utc().format('YYYY-MM-DD'),
              amount: { amount: 123 },
              accountRemaining: { amount: 1234 },
              typeId: OperationType.Deposit,
              references: {},
            },
          ],
        },
      },
    );

    expect(screen.getByTestId('DepositLedger.List.Amount.op1')).toHaveTextContent(/^\$123\.00$/);
    expect(screen.queryByTestId('DepositLedger.List.Remaining.op1')).not.toBeInTheDocument();
  });
});
