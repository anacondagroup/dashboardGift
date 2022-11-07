import React from 'react';

import { render, userEvent, screen, waitFor } from '../../../../../../testUtils';
import AssistEmailSettings, { IAssistEmailSettingsPropTypes } from '../AssistEmailSettings';

describe('AssistEmailSettings', () => {
  const onChangeAssistMock = jest.fn();
  const defaultProps: IAssistEmailSettingsPropTypes = {
    isAssistEnabled: false,
    onChange: onChangeAssistMock,
    disabled: false,
  };

  const setup = (props?: Partial<IAssistEmailSettingsPropTypes>) => {
    const utils = render(<AssistEmailSettings {...defaultProps} {...props} />);
    const getAssistCheckbox = () => screen.getByTestId('AssistEmail.Checkbox').querySelector('input[type="checkbox"]')!;
    const getCheckboxWrapper = () => screen.getByTestId('AssistEmail.Checkbox.Wrapper');

    return {
      ...utils,
      getAssistCheckbox,
      getCheckboxWrapper,
    };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('Should render without errors', () => {
    const { getByText, getAssistCheckbox } = setup();

    expect(getByText('Alyce Assist')).toBeInTheDocument();
    expect(getByText('Send me an Alyce Assist email')).toBeInTheDocument();
    expect(getAssistCheckbox()).toBeEnabled();
  });

  it('Should set passed prop value into checkbox', () => {
    const { getAssistCheckbox } = setup({ isAssistEnabled: true });
    expect(getAssistCheckbox()).toBeChecked();
  });

  it('Should disable checkbox if passed disabled prop is true', () => {
    const { getAssistCheckbox } = setup({ disabled: true });
    expect(getAssistCheckbox()).toBeDisabled();
  });

  it('Should call onChange callback once assist checkbox is checked', () => {
    const { getAssistCheckbox } = setup();
    userEvent.click(getAssistCheckbox());
    expect(onChangeAssistMock).toBeCalledWith(true);
  });

  it.skip('Should display tooltip when component is disabled', async () => {
    const { getCheckboxWrapper } = setup({ disabled: true });
    const getTooltip = () => screen.getByRole('tooltip');

    userEvent.hover(getCheckboxWrapper());

    await waitFor(() => expect(getTooltip()).toBeInTheDocument());
  });

  it.skip('Should not display tooltip when component is enabled', async () => {
    const { getCheckboxWrapper } = setup();
    const getTooltip = () => screen.queryByRole('tooltip');

    userEvent.hover(getCheckboxWrapper());

    await waitFor(() => expect(getTooltip()).not.toBeInTheDocument());
  });
});
