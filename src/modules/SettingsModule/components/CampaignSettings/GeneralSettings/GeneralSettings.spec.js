import React from 'react';

import { render } from '../../../../../testUtils';
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';

import GeneralSettings from './GeneralSettings';
import { initialGeneralCampaignSettingsState } from '../../../store/campaign/general/general.reducer';

jest.mock('../../CampaignSettingsModule/hoc/CampaignSendAsLoader', () => 'CampaignSendAsLoader');

const countries = [
  {
    id: 1,
    name: 'United States',
    code: 'US',
  },
  {
    id: 2,
    name: 'Canada',
    code: 'CA',
  },
];

// Sometime these functions might be used in CampaignFactory within all unit test where campaign creation is needed
const createStandardCampaign = () => ({
  id: 20,
  name: 'Standard Campaign',
  type: CAMPAIGN_TYPES.STANDARD,
  campaign_type: 'Standard',
  team_name: 'Team',
  can_override_from: 1,
  research_flow: 'optional',
  send_as: null,
  campaignLink: null,
  gift_research_option: 'instant',
  owner: {
    id: 111,
    full_name: 'Owner Name',
    email: 'owner@mail.com',
    avatar: 'http://alyce.test/images/avatar.png',
  },
  notifications: {
    options_are_ready: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
    invitation_is_delivered: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
    need_more_information: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
    gift_viewed: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
    gift_recipient_actions_group: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
    gift_expired_unexpired: {
      notify_owner: false,
      notify_sender: true,
      notify_send_as_person: false,
    },
  },
});

const createSWAGCampaign = () => ({
  id: 20,
  name: 'SWAG Campaign',
  type: 'swag digital',
  campaign_type: 'Swag Select Plus - Digital codes',
  team_name: 'Team',
  can_override_from: 1,
  research_flow: 'optional',
  send_as: null,
  campaignLink: null,
  gift_research_option: 'instant',
  is_disabled: false,
  owner: {
    id: 111,
    full_name: 'Owner Name',
    email: 'owner@mail.com',
    avatar: 'http://alyce.test/images/avatar.png',
  },
  notifications: {
    gift_viewed: {
      notify_owner: false,
      notify_sender: true,
    },
    gift_recipient_actions_group: {
      notify_owner: false,
      notify_sender: true,
    },
    gift_expired_unexpired: {
      notify_owner: false,
      notify_sender: true,
    },
  },
});

describe('GeneralSettings', () => {
  const setup = state => {
    const initialState = {
      settings: {
        campaign: {
          general: {
            ...initialGeneralCampaignSettingsState,
            ...state,
          },
        },
      },
      commonData: {
        countries,
      },
    };
    return render(<GeneralSettings campaignId={10} />, { initialState });
  };

  it('Should render without errors', () => {
    setup();
  });

  describe('StandardCampaign', () => {
    it('Should not display link section', () => {
      const campaign = createStandardCampaign();
      const { queryByText } = setup({ campaign });

      expect(queryByText(/link is set to/i)).not.toBeInTheDocument();
    });
  });

  describe('SWAGCampaign', () => {
    it('Should not display link section', () => {
      const campaign = createSWAGCampaign();
      const { queryByText } = setup({ campaign });

      expect(queryByText(/link is set to/i)).not.toBeInTheDocument();
    });
  });
});
