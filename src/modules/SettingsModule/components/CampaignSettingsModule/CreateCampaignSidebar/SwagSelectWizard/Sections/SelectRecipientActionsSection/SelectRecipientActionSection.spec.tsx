import React from 'react';

import SelectRecipientActionSection from './SelectRecipientActionsSection';
import { CAPTURE_AFFIDAVIT, CAPTURE_QUESTION } from './recipientActions';
import { render, screen, userEvent } from '../../../../../../../../testUtils';

describe('Swag Campaign: SelectRecipientActionSection', () => {
  const setup = () =>
    render(
      <SelectRecipientActionSection
        title="Title"
        status="ACTIVE"
        order={5}
        data={{
          actions: undefined,
          availableRecipientActions: undefined,
        }}
        isLoading={false}
      />,
      { initialState: {} },
    );

  beforeEach(() => {
    setup();
  });

  const getGifterQuestionCheckbox = () =>
    screen.getByTestId(`SelectRecipientActionsSection.${CAPTURE_QUESTION}.Checkbox`);
  const getGifterQuestionField = () =>
    screen.getByTestId(`SelectRecipientActionsSection.${CAPTURE_QUESTION}.TextField`);
  const getAffidavitCheckbox = () => screen.getByTestId(`SelectRecipientActionsSection.${CAPTURE_AFFIDAVIT}.Checkbox`);
  const getAffidavitField = () => screen.getByTestId(`SelectRecipientActionsSection.${CAPTURE_AFFIDAVIT}.TextField`);

  it('Should enable action when selected', () => {
    expect(getGifterQuestionField()).toBeDisabled();

    userEvent.click(getGifterQuestionCheckbox());

    expect(getGifterQuestionField()).toBeEnabled();
  });

  it('Should trim left spaces in gifter question textarea', () => {
    userEvent.click(getGifterQuestionCheckbox());
    userEvent.type(getGifterQuestionField(), '   Question');

    expect(getGifterQuestionField()).toHaveTextContent(/^Question$/);
  });

  it('Should trim left spaces in affidavit textarea', () => {
    userEvent.click(getAffidavitCheckbox());
    userEvent.type(getAffidavitField(), '   Affidavit');

    expect(getAffidavitField()).toHaveTextContent(/^Affidavit$/);
  });
});
