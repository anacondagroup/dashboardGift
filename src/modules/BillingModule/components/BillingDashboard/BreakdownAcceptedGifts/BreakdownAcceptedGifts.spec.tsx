import React from 'react';
import userEvent from '@testing-library/user-event';

import { render, screen } from '../../../../../testUtils';
import { IBreakdownsState, initialState as breakdownsInitialState } from '../../../store/breakdowns/breakdowns.reducer';

import BreakdownAcceptedGifts from './BreakdownAcceptedGifts';

describe('BreakdownAcceptedGifts', () => {
  const setup = (breakdownsState: IBreakdownsState) =>
    render(<BreakdownAcceptedGifts />, {
      initialState: {
        billing: {
          breakdowns: {
            ...breakdownsInitialState,
            ...breakdownsState,
          },
        },
      },
    });

  test('Should render groups', () => {
    const state: IBreakdownsState = {
      ...breakdownsInitialState,
      accepted: {
        ...breakdownsInitialState.accepted,
        groups: [
          {
            groupId: 'g1',
            groupName: 'Group 1',
            totalMoney: 1234.21,
            totalInvites: 123,
            teams: [],
          },
          {
            groupId: 'g2',
            groupName: 'Group 2',
            totalMoney: 1,
            totalInvites: 1,
            teams: [],
          },
        ],
        totalMoney: 1235.21,
        totalInvites: 124,
      },
    };
    setup(state);

    expect(screen.getByTestId('BillingInsight.AcceptedSum.Group_1')).toHaveTextContent(/^1,234\.21$/);
    expect(screen.getByTestId('BillingInsight.AcceptedSum.Group_2')).toHaveTextContent(/^1\.00$/);
    expect(screen.queryByTestId('[data-testid^="BillingInsight.Accepted.Expand"]')).not.toBeInTheDocument();
  });

  test('Should render single team inventory', () => {
    const state: IBreakdownsState = {
      ...breakdownsInitialState,
      accepted: {
        ...breakdownsInitialState.accepted,
        groups: [
          {
            groupId: 'g1',
            groupName: 'Group 1',
            teams: [
              {
                teamId: 1,
                teamName: 'Team 1',
                resources: {
                  inventory: [
                    {
                      accountId: 'acc1',
                      resource: {
                        count: 123,
                        resourceId: 'res1',
                      },
                      resourceName: 'Resource 1',
                      resourceImageUrl: '',
                    },
                  ],
                  deposit: [
                    {
                      accountId: 'acc1',
                      money: { amount: 1234.21 },
                    },
                  ],
                },
                totalMoney: 1234.21,
                totalInvites: 123,
              },
            ],
            totalMoney: 1234.21,
            totalInvites: 123,
          },
          {
            groupId: 'g2',
            groupName: 'Group 2',
            totalMoney: 1,
            totalInvites: 1,
            teams: [],
          },
        ],
        inventories: {
          g1: {
            1: {
              list: [
                {
                  inventory: {
                    accountId: 'acc0',
                    resource: {
                      resourceId: '0',
                      count: 1,
                    },
                    resourceName: 'Inventory 0',
                    resourceImageUrl: '',
                  },
                  deposits: [],
                  totalMoney: 1000.2,
                },
              ],
              isLoading: false,
            },
          },
        },
        totalMoney: 1235.21,
        totalInvites: 124,
      },
    };
    setup(state);

    userEvent.click(screen.getByTestId('BillingInsight.Accepted.Expand.Group_1'));
    expect(screen.getByTestId('BillingInsight.AcceptedSum.Group_1.Team_1.Inventory_0')).toHaveTextContent(
      /^1,000\.20$/,
    );
    expect(screen.getByTestId('BillingInsight.AcceptedCount.Group_1.Team_1.Inventory_0')).toHaveTextContent(/^1$/);
  });
});
