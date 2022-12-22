import React from 'react';
import { StateStatus } from '@alycecom/utils';

import { render } from '../../../../../../../testUtils';
import BudgetCell, { IBudgetCellProps } from './BudgetCell';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}));

describe('BudgetCell', () => {
  const setup = (props: IBudgetCellProps) => {
    const initialState = {
      settings: {
        teams: {
          budgets: {
            ids: [37],
            entities: {
              37: {
                teamId: 37,
                amount: 134.54,
                period: 'monthly',
                teamMembers: [
                  {
                    userId: 12345,
                    budget: 1000.16,
                  },
                  {
                    userId: 32234,
                    budget: 2000,
                  },
                ],
              },
            },
            status: StateStatus.Fulfilled,
          },
        },
      },
    };
    return render(<BudgetCell {...props} />, { initialState });
  };

  describe('budget info displayed', () => {
    it('shows the budget amount and refresh period when one exists for the team', () => {
      const { getByText } = setup({ teamId: 37 });
      expect(getByText('$ 3,000 / monthly')).toBeInTheDocument();
    });

    it('shows the user they need to define a budget and refresh period when one does not exist', () => {
      const { getByText } = setup({ teamId: 38 });
      expect(getByText('Define budget / reset period')).toBeInTheDocument();
    });
  });
});
