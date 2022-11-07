import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { render, screen, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';

import { theme } from '../../../../../../styles/alyce-theme';
import * as selectors from '../../../../store/organisation/customFields/customFields.selectors';
import * as actions from '../../../../store/organisation/customFields/customFields.actions';

import CustomFieldsTable from './CustomFieldsTable';

jest.mock('../../../../store/organisation/customFields/customFields.selectors');
jest.mock('../../../../store/organisation/customFields/customFields.actions');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  connect: jest.fn(() => jest.fn()),
}));

const renderWithProviders = () =>
  render(
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CustomFieldsTable />
      </ThemeProvider>
    </StyledEngineProvider>,
  );

describe('<CustomFieldsTable />', () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    useSelector.mockReset().mockImplementation(selector => selector());
    dispatch.mockReset();
    useDispatch.mockReset().mockReturnValue(dispatch);
    actions.updateCustomField.mockReset();
    actions.deleteCustomField.mockReset();
    selectors.getCustomFields.mockReset();
  });

  afterEach(cleanup);

  it('should render "You have no custom fields"', () => {
    selectors.getCustomFields.mockReturnValue([]);
    renderWithProviders();

    expect(screen.getByText('You have no custom fields')).toBeInTheDocument();
  });

  it('should render table', async () => {
    selectors.getCustomFields.mockReturnValue([
      { label: 'Account ID', required: true },
      { label: 'State', required: false },
    ]);
    renderWithProviders();

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
