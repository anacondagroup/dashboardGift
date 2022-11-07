import { cleanup, waitFor } from '@testing-library/react';
import React from 'react';
import { rest } from 'msw';

import WorkatoIntegrations, { IWorkatoIntegrationsProps } from './WorkatoIntegrations';
import { renderWithReduxProvider } from '../../../../../../testUtils';
import { setupTestServer } from '../../../../../../mocks/server';

const server = setupTestServer(
  rest.get('/marketing/workato/integrations', (req, res, ctx) =>
    res(
      ctx.json({
        data: [
          { id: '6sense', enabled: false },
          { id: 'slack', enabled: false },
          { id: 'teams', enabled: false },
        ],
      }),
    ),
  ),
  rest.get('/marketing/workato/subscription', (req, res, ctx) =>
    res(ctx.json({ integrations: { allowed: 10, enabled: 0 } })),
  ),
);

describe('WorkatoIntegrations', () => {
  beforeAll(() => server.listen());

  beforeEach(() => jest.resetAllMocks());

  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });

  afterAll(() => server.close());

  const setup = (props: IWorkatoIntegrationsProps = { parentUrl: '/parent' }) =>
    renderWithReduxProvider(<WorkatoIntegrations {...props} />);

  xit('should render integration card skeleton if integrations are being loaded', async () => {
    const { getByTestId, queryByTestId } = setup();

    expect(getByTestId('WorkatoIntegrations.CardSkeleton')).toBeInTheDocument();
    await waitFor(() => {
      expect(queryByTestId('WorkatoIntegrations.CardSkeleton')).not.toBeInTheDocument();
    });
  });

  it('should render Workato integrations', async () => {
    const { findByText } = setup();

    expect(await findByText(/^Slack$/)).toBeInTheDocument();
    expect(await findByText(/^6sense$/)).toBeInTheDocument();
    expect(await findByText(/^Microsoft Teams$/)).toBeInTheDocument();
  });

  it('should display active integrations counter if there is at least one active integration', async () => {
    server.use(
      rest.get('/marketing/workato/subscription', (req, res, ctx) =>
        res(ctx.json({ integrations: { allowed: 10, enabled: 1 } })),
      ),
    );

    const { findByText, queryByText } = setup();

    expect(queryByText(/1 Active automations/)).not.toBeInTheDocument();
    expect(await findByText(/1 Active automations/)).toBeInTheDocument();
    expect(await findByText(/1 Active automations/)).toBeInTheDocument();
  });

  it('should display banner if limit of active integrations is reached', async () => {
    server.use(
      rest.get('/marketing/workato/subscription', (req, res, ctx) =>
        res(ctx.json({ integrations: { allowed: 1, enabled: 1 } })),
      ),
    );

    const { findByText, queryByText } = setup();

    expect(queryByText(/You are using 1 out of 1 automations with Alyce/)).not.toBeInTheDocument();
    expect(await findByText(/You are using 1 out of 1 automations with Alyce/)).toBeInTheDocument();
  });
});
