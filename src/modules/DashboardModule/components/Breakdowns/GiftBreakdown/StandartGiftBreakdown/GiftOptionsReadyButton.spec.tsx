import React from 'react';
import { Features } from '@alycecom/modules';
import { TCampaign, useGetBudgetUtilizationByUserIdQuery } from '@alycecom/services';

import { render } from '../../../../../../testUtils';

import GiftOptionsReadyButton from './GiftOptionsReadyButton';

jest.mock('@alycecom/services', () => ({
  ...jest.requireActual('@alycecom/services'),
  useGetBudgetUtilizationByUserIdQuery: jest.fn(),
}));

describe('GiftOptionsReadyButton', () => {
  const baseCampaign: TCampaign = {
    id: 9320,
    name: 'Campaign B',
    status: 'active',
    type: 'standard',
    isActive: true,
    team: {
      id: 9476,
      name: 'MT Steel Main Team',
    },
    owner: {
      id: 52540,
      firstName: 'Christian',
      lastName: 'Mignacca',
    },
    sendAs: {
      id: 123,
      firstName: 'Christian',
      lastName: 'Mignacca',
    },
    messageSubject: '',
    budgetSettings: {
      minPrice: 75,
      maxPrice: 100,
      giftCardPrice: 120,
      donationPrice: 100,
    },
    giftActions: {
      accept: true,
      exchange: true,
      donate: true,
    },
    researchType: 'restrict_research',
    giftsLimit: 20,
    hasLockedSendAs: false,
    currencyId: 1,
    recipientActions: {
      phone: false,
      email: false,
      date: false,
      question: false,
      affidavit: false,
    },
    invitationTypes: [
      'Email',
      'Handwritten card',
      'Lovepop card',
      'Classic box',
      'Wooden box',
      'Holiday card',
      'Mr-Dr',
    ],
    canEdit: true,
    countryIds: [1, 2],
    defaultProducts: [],
    productsOverrideEnabled: false,
    messageOverrideEnabled: false,
    videoOverrideEnabled: false,
    recipientActionOverrideEnabled: true,
    isFavourite: false,
    campaignInstruction: null,
  };

  const onStatusClickMock = jest.fn();

  const baseProps = {
    campaign: baseCampaign,
    giftStatus: 'Gift Options Ready',
    onStatusClick: onStatusClickMock,
  };

  const setup = (featuresState: Record<string, boolean>, props = baseProps) => {
    const initialState = {
      modules: {
        features: {
          features: featuresState,
        },
      },
    };

    return render(<GiftOptionsReadyButton {...props} />, { initialState });
  };

  describe('when budget management limit is disabled', () => {
    beforeEach(() => {
      const budgetUtilizationWithNoBudget = {
        entities: {},
        ids: {},
      };

      // @ts-ignore
      useGetBudgetUtilizationByUserIdQuery.mockReturnValue({ data: budgetUtilizationWithNoBudget, isLoading: false });
    });
    it('is enabled even if there is no budget defined for the team tied to the campaign', () => {
      const { getByText } = setup({ [Features.FLAGS.BUDGET_MANAGEMENT_LIMIT]: false });

      expect(getByText('Gift Options Ready')).toBeEnabled();
    });
  });

  describe('when budget management limit is enabled', () => {
    describe('when user has no budget defined', () => {
      beforeEach(() => {
        const budgetUtilizationWithNoBudget = {
          entities: {},
          ids: {},
        };

        // @ts-ignore
        useGetBudgetUtilizationByUserIdQuery.mockReturnValue({ data: budgetUtilizationWithNoBudget, isLoading: false });
      });

      it('is disabled when the user has no budget defined', () => {
        const { getByText } = setup({ [Features.FLAGS.BUDGET_MANAGEMENT_LIMIT]: true });

        expect(getByText('Gift Options Ready')).toBeDisabled();
      });
    });

    describe('when budget is less than enforcement limit', () => {
      // Enforcement limit = highest value for budgetSettings on campaign
      // in BaseProps that is 120 for gift card price, so setting available budget
      // as 110 to be less then enforcement
      beforeEach(() => {
        const budgetUtilizationWithInsufficientBudget = {
          entities: {
            9476: {
              teamId: 9476,
              userId: 5240,
              budgetAmount: 110,
              availableBudgetAmount: 0,
              pendingGiftAmount: 0,
              period: 'monthly',
            },
          },
          ids: [9476],
        };

        // @ts-ignore
        useGetBudgetUtilizationByUserIdQuery.mockReturnValue({
          data: budgetUtilizationWithInsufficientBudget,
          isLoading: false,
        });
      });

      it('is disabled when the user has a available budget, but is less then the enforcement limit', () => {
        const { getByText } = setup({ [Features.FLAGS.BUDGET_MANAGEMENT_LIMIT]: true }, baseProps);

        expect(getByText('Gift Options Ready')).toBeDisabled();
      });
    });

    describe('when budget is greater than enforcement limit', () => {
      beforeEach(() => {
        const budgetUtilizationWithSufficientBudget = {
          entities: {
            9476: {
              teamId: 9476,
              userId: 5240,
              budgetAmount: 130,
              availableBudgetAmount: 0,
              pendingGiftAmount: 0,
              period: 'monthly',
            },
          },
          ids: [9476],
        };

        // @ts-ignore
        useGetBudgetUtilizationByUserIdQuery.mockReturnValue({
          data: budgetUtilizationWithSufficientBudget,
          isLoading: false,
        });
      });

      it('is enabled when the user has a sufficient budget', () => {
        const { getByText } = setup({ [Features.FLAGS.BUDGET_MANAGEMENT_LIMIT]: true }, baseProps);

        expect(getByText('Gift Options Ready')).toBeEnabled();
      });
    });
  });
});
