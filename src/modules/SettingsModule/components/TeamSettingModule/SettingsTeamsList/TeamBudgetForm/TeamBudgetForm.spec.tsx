import React from 'react';
import { initialUserState } from '@alycecom/modules';
import { RefreshPeriod } from '@alycecom/services';

import { render, screen, userEvent, waitFor } from '../../../../../../testUtils';
import TeamBudgetForm from './TeamBudgetForm';

describe('TeamBudgetForm', () => {
  const useSelector = jest.fn();

  beforeEach(() => {
    useSelector.mockImplementation(fn => fn());
  });

  const setup = () => {
    const Component = () => <TeamBudgetForm teamId={37} />;
    const utils = render(<Component />, {
      initialState: {
        modules: {
          user: {
            ...initialUserState,
          },
        },
      },
    });
    const getHeader = () => screen.getByText('Give the team a budget');
    const getBudgetField = () => screen.getByTestId('TeamMembersBudget.TeamBudget');
    const getBudgetTypeField = () => screen.getByRole('button', { name: /user gift budgets/i });
    const getRefreshSelect = () => screen.getByRole('button', { name: /monthly reset/i });
    const getPauseGiftingField = () =>
      screen.getByRole('button', { name: /total cost of claimed gifts meets gift budget/i });
    const getBackButton = () => screen.getByRole('button', { name: /back/i });
    const getCancelButton = () => screen.getByRole('button', { name: /cancel/i });
    const getSubmitButton = () => screen.getByRole('button', { name: /save/i });

    return {
      ...utils,
      rerender: () =>
        utils.rerender(<Component />, {
          initialState: {
            modules: {
              user: {
                ...initialUserState,
              },
            },
          },
        }),
      getHeader,
      getBudgetField,
      getBudgetTypeField,
      getRefreshSelect,
      getPauseGiftingField,
      getBackButton,
      getCancelButton,
      getSubmitButton,
    };
  };

  xit('should render with all the correct elements', async () => {
    const {
      getHeader,
      getBudgetTypeField,
      getBudgetField,
      getRefreshSelect,
      getPauseGiftingField,
      getBackButton,
      getCancelButton,
      getSubmitButton,
    } = setup();

    await waitFor(() => {
      expect(getHeader()).toBeInTheDocument();
      expect(getBudgetField()).toBeInTheDocument();
      expect(getBudgetTypeField()).toBeInTheDocument();
      expect(getRefreshSelect()).toBeInTheDocument();
      expect(getPauseGiftingField()).toBeInTheDocument();
      expect(getBackButton()).toBeInTheDocument();
      expect(getCancelButton()).toBeInTheDocument();
      expect(getSubmitButton()).toBeInTheDocument();
    });
  });

  it('validates the expected refresh options are shown', async () => {
    const { getRefreshSelect } = setup();

    userEvent.click(getRefreshSelect());

    const options = [
      await screen.findByRole('option', { name: `${RefreshPeriod.Weekly} reset` }),
      await screen.findByRole('option', { name: `${RefreshPeriod.Monthly} reset` }),
      await screen.findByRole('option', { name: `${RefreshPeriod.Quarterly} reset` }),
      await screen.findByRole('option', { name: RefreshPeriod.NoRefresh }),
    ];

    options.map(option => expect(option).toBeInTheDocument());
  }, 20000);

  xit('validates the form is submitable with default values', async () => {
    const { getSubmitButton } = setup();

    await waitFor(() => expect(getSubmitButton()).toBeEnabled());
  });
});
