import React from 'react';

import { render, screen } from '../../../../../testUtils';
import {
  ICustomerOrgState,
  initialState as customerOrgInitialState,
} from '../../../store/customerOrg/customerOrg.reducer';

import DepositOverview from './DepositOverview';

describe('DepositOverview', () => {
  const setup = (customerOrgState: ICustomerOrgState, featuresState: Record<string, boolean>) =>
    render(<DepositOverview />, {
      initialState: {
        billing: {
          customerOrg: customerOrgState,
        },
        modules: {
          features: {
            features: featuresState,
          },
        },
      },
    });

  test('Should not show deposit if feature disabled', () => {
    setup(
      {
        ...customerOrgInitialState,
        resources: {
          ...customerOrgInitialState.resources,
          remainingInvites: 1234,
          remainingDeposit: -1234,
        },
      },
      {
        showRemainingDeposits: false,
      },
    );

    expect(screen.queryByTestId('PlatformUsage.GiftDeposit')).not.toBeInTheDocument();
  });

  test('Should show deposit if feature enabled', () => {
    setup(
      {
        ...customerOrgInitialState,
        resources: {
          ...customerOrgInitialState.resources,
          remainingInvites: 1234,
          remainingDeposit: -1234,
        },
      },
      {
        showRemainingDeposits: true,
        showDepositLedger: false,
      },
    );

    expect(screen.getByTestId('PlatformUsage.GiftDeposit')).toHaveTextContent(/^-\$1,234\.00$/);
  });

  test('Should add link to Deposit Ledger page if showDepositLedger feature enabled', () => {
    setup(
      {
        ...customerOrgInitialState,
        resources: {
          ...customerOrgInitialState.resources,
          remainingInvites: 1234,
          remainingDeposit: -1234,
        },
      },
      {
        showRemainingDeposits: true,
        showDepositLedger: true,
      },
    );

    expect(screen.getByTestId('PlatformUsage.GiftDeposit')).toHaveTextContent(/^-\$1,234\.00$/);
  });
});
