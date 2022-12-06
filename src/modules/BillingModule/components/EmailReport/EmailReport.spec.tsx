import React from 'react';

import { render, screen, userEvent } from '../../../../testUtils';
import { initialState } from '../../store/breakdowns/breakdowns.reducer';
import { emailReportRequest } from '../../store/breakdowns';

import EmailReport from './EmailReport';

describe('EmailReport', () => {
  const setup = (email: string) =>
    render(<EmailReport />, {
      initialState: {
        billing: {
          breakdowns: { ...initialState },
        },
        auth: {
          userInfo: {
            email,
          },
        },
      },
    });

  test('Should open popup by click', async () => {
    setup('user@alyce.com');

    expect(screen.queryByText('BillingInsight.EmailReport.Submit')).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId('BillingInsight.EmailReport.Link'));
    await screen.findByTestId('BillingInsight.EmailReport.Submit');
  });

  test('Should disable if email invalid', async () => {
    setup('user@alyce.com');

    userEvent.click(screen.getByTestId('BillingInsight.EmailReport.Link'));
    await screen.findByTestId('BillingInsight.EmailReport.Submit');

    userEvent.type(screen.getByTestId('BillingInsight.EmailReport.Input'), 'user@not-alyce.com');
    await screen.findByTestId('BillingInsight.EmailReport.Submit');

    expect(screen.getByTestId('BillingInsight.EmailReport.Submit')).toBeEnabled();
  });

  test('Should request report by click', async () => {
    const { dispatch } = setup('user@alyce.com');

    userEvent.click(screen.getByTestId('BillingInsight.EmailReport.Link'));
    await screen.findByTestId('BillingInsight.EmailReport.Submit');
    userEvent.click(screen.getByTestId('BillingInsight.EmailReport.Submit'));

    expect(dispatch).toBeCalledWith(emailReportRequest('user@alyce.com'));
  });
});
