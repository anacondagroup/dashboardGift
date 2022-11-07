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

    expect(screen.getByText(/Influenced Open ARR/)).toBeInTheDocument();
    expect(screen.getByText(/Closed-Won ARR/)).toBeInTheDocument();
    expect(screen.getByText(/Total Influenced/)).toBeInTheDocument();
    expect(screen.getByText(/Total Spend/)).toBeInTheDocument();
    expect(screen.getByText(/ROI/)).toBeInTheDocument();
  });

  it('should render sfdc in loading state', () => {
    setup();
    expect(screen.getAllByTestId(/RoiSummaryTile\..*\.loader/)).toHaveLength(5);
  });

  it('should render sfdc summary tiles with correct values', async () => {
    setup();
    expect(await screen.findByText('$150k')).toBeInTheDocument();
    expect(await screen.findByText('$50k')).toBeInTheDocument();
    expect(await screen.findByText('$25k')).toBeInTheDocument();
    expect(await screen.findByText('$2,500')).toBeInTheDocument();
    expect(await screen.findByText('76x')).toBeInTheDocument();
  }, 20000);
});
