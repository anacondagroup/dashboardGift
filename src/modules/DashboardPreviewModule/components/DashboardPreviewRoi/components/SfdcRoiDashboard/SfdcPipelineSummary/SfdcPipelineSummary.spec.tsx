import React from 'react';
import { screen } from '@testing-library/react';
import { getSfdcSummary } from '@alycecom/services';
import { renderWithReduxProvider } from '../../../../../../../testUtils';
import SfdcPipelineSummary from './SfdcPipelineSummary';
import { setupTestServer } from '../../../../../../../mocks/server';
import { useMswServer } from '../../../../../../../testHelpers';

const server = setupTestServer(getSfdcSummary);

describe('SfdcPipelineSummary', () => {
  useMswServer(server);

  const setup = () => {
    renderWithReduxProvider(<SfdcPipelineSummary />);
  };

  it('should render sfdc summary tiles', () => {
    setup();

    expect(screen.getByText(/Influenced Open Revenue/)).toBeInTheDocument();
    expect(screen.getByText(/Closed-Won Revenue/)).toBeInTheDocument();
    expect(screen.getByText(/Total Influenced/)).toBeInTheDocument();
    expect(screen.getByText(/Total Spend/)).toBeInTheDocument();
    expect(screen.getByText(/ROI/)).toBeInTheDocument();
  });

  xit('should render sfdc summary tiles with correct values', async () => {
    setup();
    expect(await screen.findByText('180')).toBeInTheDocument();
    expect(await screen.findByText('93')).toBeInTheDocument();
    expect(await screen.findByText('281')).toBeInTheDocument();
    expect(await screen.findByText('4033')).toBeInTheDocument();
    expect(await screen.findByText('21')).toBeInTheDocument();
  }, 20000);
});
