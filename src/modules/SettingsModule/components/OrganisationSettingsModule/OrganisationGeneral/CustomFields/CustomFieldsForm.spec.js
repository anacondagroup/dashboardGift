import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { render, fireEvent, screen, cleanup, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';

import { theme } from '../../../../../../styles/alyce-theme';
import * as selectors from '../../../../store/organisation/customFields/customFields.selectors';
import * as actions from '../../../../store/organisation/customFields/customFields.actions';

import CustomFieldsForm from './CustomFieldsForm';

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
        <CustomFieldsForm />
      </ThemeProvider>
    </StyledEngineProvider>,
  );

const getters = {
  getNameInput: () => screen.getByTestId('OrgSettings.CustomFields.CustomFieldName'),
  getAddBtn: () => screen.getByTestId('OrgSettings.CustomFields.AddCustomFieldButton'),
  getRequiredCheckbox: () => screen.queryByTestId('OrgSettings.CustomFields.CustomFieldRequiredCheckbox'),
  getCheckboxLabel: label => screen.queryByText(`Set “${label}” to be a required field`),
};

describe('<CustomFieldsForm />', () => {
  const dispatch = jest.fn();
  beforeEach(() => {
    useSelector.mockReset().mockImplementation(selector => selector());
    dispatch.mockReset();
    useDispatch.mockReset().mockReturnValue(dispatch);
    actions.addCustomField.mockReset();
    selectors.getIsLoading.mockReset().mockReturnValue(false);
    selectors.getAddFieldFormErrors.mockReset().mockReturnValue({});
  });
  afterEach(cleanup);

  it('should disable button and hide checkbox when input is empty', async () => {
    renderWithProviders();

    expect(getters.getNameInput()).toHaveValue('');
    await waitFor(() => expect(getters.getAddBtn()).toBeDisabled());
    expect(getters.getRequiredCheckbox()).not.toBeInTheDocument();
  });

  it('should disable adding custom field while custom fields loading', () => {
    selectors.getIsLoading.mockReturnValue(true);
    renderWithProviders();

    fireEvent.input(getters.getNameInput(), { target: { value: 'Account ID' } });

    expect(getters.getAddBtn()).toBeDisabled();
  });

  it('should enable button and show checkbox when input not empty', async () => {
    renderWithProviders();

    fireEvent.input(getters.getNameInput(), { target: { value: 'Account ID' } });

    expect(getters.getNameInput()).toHaveValue('Account ID');
    await waitFor(() => expect(getters.getAddBtn()).toBeEnabled());
    await waitFor(() => expect(getters.getRequiredCheckbox()).not.toBeChecked());

    fireEvent.click(getters.getRequiredCheckbox());

    expect(getters.getRequiredCheckbox()).toBeChecked();
    expect(getters.getCheckboxLabel('Account ID')).toBeInTheDocument();
  });

  it('should dispatch action that add custom field and clear input', async () => {
    actions.addCustomField.mockReturnValue('ADD_CUSTOM_FIELD');
    renderWithProviders();

    fireEvent.input(getters.getNameInput(), { target: { value: 'Account ID' } });
    await waitFor(() => expect(getters.getAddBtn()).toBeEnabled());
    fireEvent.click(getters.getAddBtn());

    await waitFor(() => expect(getters.getNameInput()).toHaveValue(''));
    expect(dispatch).toBeCalledWith('ADD_CUSTOM_FIELD');
    expect(actions.addCustomField).toBeCalledWith({
      label: 'Account ID',
      required: false,
    });
  });
});
