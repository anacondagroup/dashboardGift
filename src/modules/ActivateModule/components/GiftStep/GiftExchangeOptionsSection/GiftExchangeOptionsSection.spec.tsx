import React from 'react';
import { StateStatus } from '@alycecom/utils';

import { render, screen, waitFor } from '../../../../../testUtils';
import GiftExchangeOptionsSection from './GiftExchangeOptionsSection';
import { initialGiftState } from '../../../store/steps/gift/gift.reducer';
import {
  initialState as initialGiftTypeState,
  TGiftTypesState,
} from '../../../store/entities/giftTypes/giftTypes.reducer';
import { GiftExchangeOptions } from '../../../constants/exchange.constants';
import { updateMarketplaceSettingsRequest } from '../../../store/steps/gift';
import { IActivateDraftGift } from '../../../store';
import { initialState as initialGiftVendorState } from '../../../store/entities/giftVendors/giftVendors.reducer';

describe('GiftExchangeOptionsSection', () => {
  const getInitialState = (
    stepsGiftDataState: IActivateDraftGift = {
      ...initialGiftState.data,
      giftExchangeOptions: GiftExchangeOptions.campaignBudget,
    },
    giftTypesState: TGiftTypesState = initialGiftTypeState,
  ) => ({
    initialState: {
      router: {
        location: {
          pathname: '/activate/builder/1/gift',
        },
      },
      activate: {
        ui: {
          status: StateStatus.Fulfilled,
        },
        steps: {
          gift: {
            ...initialGiftState,
            data: stepsGiftDataState,
          },
        },
        entities: {
          giftTypes: {
            ...giftTypesState,
            status: 2,
          },
          giftVendors: {
            ...initialGiftVendorState,
            status: 2,
          },
        },
      },
    },
  });
  test('Set initial filters', async () => {
    const { dispatch } = render(<GiftExchangeOptionsSection isMultiCountry={false} />, getInitialState());
    expect(dispatch).toBeCalledWith(
      updateMarketplaceSettingsRequest({
        donationMaxBudget: 50,
        giftCardMaxBudget: 50,
        maxBudgetAmount: 50,
        minBudgetAmount: 5,
        restrictedBrandIds: [],
        restrictedGiftTypeIds: [],
        restrictedMerchantIds: [],
      }),
    );
  });

  test('Set filters when there are unAvailableTypes', async () => {
    const { dispatch } = render(
      <GiftExchangeOptionsSection isMultiCountry={false} />,
      getInitialState(
        {
          ...initialGiftState.data,
          giftExchangeOptions: GiftExchangeOptions.campaignBudget,
        },
        {
          ids: [1, 2, 3, 4, 5, 6, 7],
          status: 2,
          entities: {
            1: {
              id: 1,
              name: 'Physical',
              description: 'Physical',
              countryIds: [],
              isTeamRestricted: false,
            },
            2: {
              id: 2,
              name: 'Subscription Box',
              countryIds: [],
              description: 'Subscription Box',
              isTeamRestricted: false,
            },
            3: {
              id: 3,
              name: 'On-Demand Service',
              countryIds: [],
              description: 'On-Demand Service',
              isTeamRestricted: false,
            },
            4: {
              id: 4,
              name: 'Experience',
              countryIds: [],
              description: 'Experience',
              isTeamRestricted: false,
            },
            5: {
              id: 5,
              name: 'Donation',
              countryIds: [1],
              description: 'Donation',
              isTeamRestricted: false,
            },
            6: {
              id: 6,
              name: 'Gift Card',
              countryIds: [],
              description: 'Gift Card',
              isTeamRestricted: false,
            },
            7: {
              id: 7,
              name: 'Branded Product',
              countryIds: [],
              description: 'Branded Product',
              isTeamRestricted: false,
            },
          },
        },
      ),
    );
    expect(dispatch).toBeCalledWith(
      updateMarketplaceSettingsRequest({
        donationMaxBudget: 50,
        giftCardMaxBudget: null,
        maxBudgetAmount: null,
        minBudgetAmount: null,
        restrictedBrandIds: [],
        restrictedGiftTypeIds: [1, 2, 3, 4, 6, 7],
        restrictedMerchantIds: [],
      }),
    );
  });

  test('Render preview settings with set initial filters', async () => {
    render(
      <GiftExchangeOptionsSection isMultiCountry={false} />,
      getInitialState({
        ...initialGiftState.data,
        giftExchangeOptions: GiftExchangeOptions.campaignBudget,
        exchangeMarketplaceSettings: {
          donationMaxBudget: 50,
          giftCardMaxBudget: 50,
          maxBudgetAmount: 50,
          minBudgetAmount: 5,
          restrictedBrandIds: [],
          restrictedGiftTypeIds: [],
          restrictedMerchantIds: [],
        },
      }),
    );

    expect(await screen.findByTestId('MarketplaceSettings.GiftBudget')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Preview Marketplace')).toHaveAttribute(
        'href',
        '/marketplace/campaign?donationPrice=50&giftCardPrice=50&maxPrice=50&minPrice=5',
      );
    });
  });

  test('Render preview settings with set filters with an unAvailableTypes', async () => {
    render(
      <GiftExchangeOptionsSection isMultiCountry={false} />,
      getInitialState({
        ...initialGiftState.data,
        giftExchangeOptions: GiftExchangeOptions.campaignBudget,
        exchangeMarketplaceSettings: {
          donationMaxBudget: 50,
          giftCardMaxBudget: null,
          maxBudgetAmount: null,
          minBudgetAmount: null,
          restrictedBrandIds: [],
          restrictedGiftTypeIds: [1, 2, 3, 4, 6, 7],
          restrictedMerchantIds: [],
        },
      }),
    );

    expect(await screen.findByTestId('MarketplaceSettings.GiftBudget')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Preview Marketplace')).toHaveAttribute(
        'href',
        '/marketplace/campaign?donationPrice=50&giftCardPrice&maxPrice&minPrice',
      );
    });
  });
});
