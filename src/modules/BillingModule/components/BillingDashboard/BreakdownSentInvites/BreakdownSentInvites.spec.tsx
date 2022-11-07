import React from 'react';

import { render, screen } from '../../../../../testUtils';
import { IBreakdownsState, initialState as breadownsInitialState } from '../../../store/breakdowns/breakdowns.reducer';

import BreakdownSentInvites from './BreakdownSentInvites';

describe('BreakdownSentInvites', () => {
  const setup = (breakdownsState: IBreakdownsState) =>
    render(<BreakdownSentInvites />, {
      initialState: {
        billing: { breakdowns: breakdownsState },
      },
    });

  test('Should render one empty group', () => {
    const state: IBreakdownsState = {
      ...breadownsInitialState,
      sent: {
        ...breadownsInitialState.sent,
        groups: [
          {
            groupId: 'g1',
            groupName: 'Group 1',
            totalInvites: 1000,
            totalMoney: 0,
            teams: [],
          },
        ],
        totalInvites: 1234.21,
      },
    };
    setup(state);

    expect(screen.getByTestId('PlatformUsage.TotalInvites')).toHaveTextContent(/^1,234$/);
    expect(screen.getByTestId('BillingInsight.Invites.Group_1')).toHaveTextContent(/^1,000$/);
    expect(screen.queryByTestId('BillingInsight.Invites.Ungrouped_Teams')).not.toBeInTheDocument();
  });

  test('Should render single group with single team expanded by default', () => {
    const state: IBreakdownsState = {
      ...breadownsInitialState,
      sent: {
        ...breadownsInitialState.sent,
        groups: [
          {
            groupId: 'Ungrouped',
            groupName: 'Ungrouped Teams',
            teams: [
              {
                teamId: 1,
                teamName: 'Team 1',
                resources: {
                  inventory: [
                    {
                      accountId: '1',
                      resourceName: 'Resource 1',
                      resource: { count: 1, resourceId: 'res1' },
                      resourceImageUrl: '',
                    },
                    {
                      accountId: '2',
                      resourceName: 'Resource 2',
                      resource: { count: 122, resourceId: 'res2' },
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
                totalInvites: 123,
                totalMoney: 1234.21,
              },
            ],
            totalInvites: 124,
            totalMoney: 1234.21,
          },
        ],
        totalInvites: 125,
      },
    };
    setup(state);

    expect(screen.getByTestId('BillingInsight.Invites.Ungrouped_Teams')).toHaveTextContent(/^124$/);
    expect(screen.getByTestId('BillingInsight.Invites.Ungrouped_Teams.Team_1')).toHaveTextContent(/^123$/);
    expect(screen.getByTestId('BillingInsight.Invites.Ungrouped_Teams.Team_1.Resource_1')).toHaveTextContent(/^1$/);
    expect(screen.getByTestId('BillingInsight.Invites.Ungrouped_Teams.Team_1.Resource_2')).toHaveTextContent(/^122$/);
  });
});
