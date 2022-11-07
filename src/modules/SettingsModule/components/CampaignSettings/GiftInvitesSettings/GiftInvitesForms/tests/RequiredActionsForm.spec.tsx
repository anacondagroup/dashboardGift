import React from 'react';

import RequiredActionsForm from '../RequiredActionsForm';
import { render, screen, userEvent } from '../../../../../../../testUtils';

describe('Activate Campaign: RequiredActionsForm', () => {
  const overrideActionsCheckboxLabel = 'Allow team members to change required actions on a per gift basis';
  const defaultProps = {
    isLoading: false,
    actions: {
      capture_affidavit: false,
      capture_date: false,
      capture_email: false,
      capture_phone: false,
      capture_question: false,
      gifter_affidavit: '',
      gifter_question: '',
    },
    canOverrideActions: false,
    showCanOverrideActions: false,
    onSave: () => {},
  };

  const setup = (props: Record<string, unknown>) => render(<RequiredActionsForm {...defaultProps} {...props} />);

  describe('props:showCanOverrideActions', () => {
    it('Should not display override RA checkbox if showCanOverrideActions is false', () => {
      const { queryByLabelText } = setup({});
      const overrideRequiredActionsCheckbox = queryByLabelText(overrideActionsCheckboxLabel);
      expect(overrideRequiredActionsCheckbox).not.toBeInTheDocument();
    });

    it('Should display override RA checkbox if showCanOverrideActions is true', () => {
      const { getByLabelText } = setup({ showCanOverrideActions: true });
      const overrideRequiredActionsCheckbox = getByLabelText(overrideActionsCheckboxLabel);
      expect(overrideRequiredActionsCheckbox).toBeInTheDocument();
    });
  });

  describe('validate form values', () => {
    beforeEach(() => {
      setup({});
    });

    const getGifterQuestionField = () => screen.getByTestId(`RequiredActions.gifter_question`);
    const getAffidavitField = () => screen.getByTestId(`RequiredActions.gifter_affidavit`);

    it('Should trim left spaces for gifter question field ', () => {
      userEvent.type(getGifterQuestionField(), '   Question');
      expect(getGifterQuestionField()).toHaveTextContent(/^Question$/);
    });

    it('Should trim left spaces for affidavit field ', () => {
      userEvent.type(getAffidavitField(), '   Affidavit');
      expect(getAffidavitField()).toHaveTextContent(/^Affidavit$/);
    });
  });
});
