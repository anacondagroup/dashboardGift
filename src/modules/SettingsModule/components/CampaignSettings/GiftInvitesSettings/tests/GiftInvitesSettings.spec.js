import React from 'react';
import { Features } from '@alycecom/modules';

import GiftInvitesSettings from '../GiftInvitesSettings';
import { CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';
import { render, fireEvent } from '../../../../../../testUtils';

const mockedCampaign = {
  can_override_gift_default_budget: true,
  can_override_recipient_video: false,
  can_override_required_actions: 1,
  customization: {
    recipient_video: null,
    recipient_video_type: 'disabled',
    redirect_button: null,
    redirect_confirm: false,
    redirect_header: null,
    redirect_message: null,
    redirect_url: null,
    vidyard_image: null,
    vidyard_video: null,
  },
  disabled_gift_invitation_method_ids: [],
  enterprise_donation_price: 100,
  enterprise_gift_card_price: 100,
  enterprise_max_price: 1000,
  enterprise_min_price: 10,
  gift_default_budget: null,
  gift_expiration: 90,
  gift_limits_count: 0,
  gift_limits_period: 'week',
  required_actions: {
    capture_affidavit: false,
    capture_date: false,
    capture_email: false,
    capture_phone: false,
    capture_question: false,
    gifter_affidavit: '',
    gifter_question: '',
  },
  restricted_product_ids: [],
  vendor: null,
};

const mockedCurrency = {
  id: 1,
  name: 'US dollar',
  sign: '$',
  code: 'USD',
  image: 'https://alyce.com/images/us-flag.png',
};

describe('GiftInvitesSettings', () => {
  const overrideActionsCheckboxLabel = 'Allow team members to change required actions on a per gift basis';

  const setup = (props, featuresState = {}) =>
    render(
      <GiftInvitesSettings
        campaign={mockedCampaign}
        isLoading={false}
        campaignId={61}
        campaignType={CAMPAIGN_TYPES.ACTIVATE}
        currency={mockedCurrency}
        campaignName="Activate Campaign"
        onSaveBudget={() => {}}
        onSaveGiftExpiration={() => {}}
        onSaveGiftRedirect={() => {}}
        onSaveGiftVideo={() => {}}
        onSaveRequiredActions={() => {}}
        {...props}
      />,
      {
        initialState: {
          modules: {
            features: {
              features: featuresState,
            },
          },
        },
      },
    );

  describe('props:campaignType', () => {
    it('Should not display override RA checkbox if it is activate campaign', () => {
      const { getByTestId, queryByLabelText } = setup();
      const requiredActionsChangeBtn = getByTestId('required_actions_change');

      fireEvent.click(requiredActionsChangeBtn);

      const overrideRequiredActionsCheckbox = queryByLabelText(overrideActionsCheckboxLabel);

      expect(overrideRequiredActionsCheckbox).not.toBeInTheDocument();
    });

    it(`Should display override RA checkbox if it isn't activate campaign`, () => {
      const { getByTestId, getByLabelText } = setup({ campaignType: CAMPAIGN_TYPES.STANDARD });
      const requiredActionsChangeBtn = getByTestId('required_actions_change');

      fireEvent.click(requiredActionsChangeBtn);

      const overrideRequiredActionsCheckbox = getByLabelText(overrideActionsCheckboxLabel);

      expect(overrideRequiredActionsCheckbox).toBeInTheDocument();
    });

    it.each([[CAMPAIGN_TYPES.STANDARD]])(
      'Should display gift expiration section if campaignType either standard or international',
      campaignType => {
        const { getByText } = setup({ campaignType });
        expect(getByText('Gift expiration')).toBeInTheDocument();
      },
    );

    it.each([[CAMPAIGN_TYPES.ACTIVATE], [CAMPAIGN_TYPES.SWAG]])(
      'Should not display gift expiration section if campaignType either standard or international',
      campaignType => {
        const { queryByText } = setup({ campaignType });
        expect(queryByText('Gift expiration')).not.toBeInTheDocument();
      },
    );
  });

  describe('rendering of "Gift limits" item based on state of budget feature flags', () => {
    describe('with neither budget feature flag enabled', () => {
      it('shows the Gift limits settings item', () => {
        const { queryByText } = setup({ campaignType: CAMPAIGN_TYPES.STANDARD });
        expect(queryByText('Gift limits')).toBeInTheDocument();
      });
    });

    describe('with both budget feature flags enabled', () => {
      it('does not show the Gift limits settings item', () => {
        const { queryByText } = setup(
          { campaignType: CAMPAIGN_TYPES.STANDARD },
          { [Features.FLAGS.BUDGET_MANAGEMENT_LIMIT]: true, [Features.FLAGS.BUDGET_MANAGEMENT_SETUP]: true },
        );
        expect(queryByText('Gift limits')).not.toBeInTheDocument();
      });
    });
  });
});
