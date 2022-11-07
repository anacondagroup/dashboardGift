import React from 'react';

import { render, screen } from '../../../../../testUtils';
import {
  ICustomerOrgState,
  initialState as customerOrgInitialState,
} from '../../../store/customerOrg/customerOrg.reducer';

import BillingOverview from './BillingOverview';

describe('BillingOverview', () => {
  const setup = (customerOrgState: ICustomerOrgState, featuresState: Record<string, boolean>) =>
    render(<BillingOverview />, {
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

  test('Should render physical invites', () => {
    setup(
      {
        ...customerOrgInitialState,
        resources: {
          ...customerOrgInitialState.resources,
          remainingInvites: 1234,
          remainingDeposit: -1234,
        },
      },
      {},
    );

    expect(screen.getByTestId('PlatformUsage.PhysicalInvites')).toHaveTextContent(/^1,234$/);
  });

  test('Should not show remaining invites if filtered by group', () => {
    setup(
      {
        ...customerOrgInitialState,
        resources: {
          ...customerOrgInitialState.resources,
          remainingInvites: 1234,
          remainingDeposit: -1234,
        },
        teamsFilter: {
          ...customerOrgInitialState.teamsFilter,
          groupIds: ['g1'],
        },
      },
      {
        showRemainingDeposits: true,
      },
    );

    expect(screen.getByTestId('PlatformUsage.PhysicalInvites')).toHaveTextContent(/^N\/A$/);
  });
});
