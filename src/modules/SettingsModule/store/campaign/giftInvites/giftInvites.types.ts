/* eslint-disable camelcase */
import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import { ProductTypes } from '../../settings.types';

export interface ICampaignRequiredActions {
  capture_affidavit: boolean;
  capture_date: boolean;
  capture_email: boolean;
  capture_phone: boolean;
  capture_question: boolean;
  gifter_affidavit: string;
  gifter_question: string;
}

export interface ICampaignCustomization {
  recipient_video: string;
  recipient_video_type: string;
  redirect_button: string;
  redirect_confirm: boolean;
  redirect_header: string;
  redirect_message: string;
  redirect_url: string;
  vidyard_image: string;
  vidyard_video: string;
}

export interface ICampaignBudget {
  enterprise_donation_price: number;
  enterprise_gift_card_price: number;
  enterprise_max_price: number;
  enterprise_min_price: number;
}

export interface IGiftInvitesCampaignSettings {
  can_override_gift_default_budget: boolean;
  can_override_recipient_video: boolean;
  can_override_required_actions: number;
  countryIds: number[];
  customisation: ICampaignCustomization;
  defaultProductId: number;
  disabled_gift_invitation_method_ids: number[];
  enterprise_min_price: number;
  enterprise_max_price: number;
  enterprise_donation_price: number;
  enterprise_gift_card_price: number;
  gift_default_budget: number | null;
  gift_expiration: number;
  gift_limits_count: number;
  gift_limits_period: string;
  productIsSuitable: boolean;
  required_actions: ICampaignRequiredActions;
  restricted_product_ids: number[];
  vendor: string;
}

export interface IGiftType {
  id: ProductTypes;
  name: string;
  is_campaign_restricted: boolean;
  is_team_restricted: boolean;
  countryIds: number[];
  description?: string;
}

export interface IGiftVendor {
  id: number;
  name: string;
  type: string;
  description: string;
  is_campaign_restricted: boolean;
  is_team_restricted: boolean;
  logo_url: string;
  countries: string[];
}

export interface IGiftInvitesResponse {
  success: true;
  settings: IGiftInvitesCampaignSettings;
}

export interface IUpdateGiftBudgetPayload {
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
  giftMinPrice: number;
  giftMaxPrice: number;
  giftCardPrice: number;
  giftDonationPrice: number;
}

export interface IUpdateRequiredActionsPayload {
  campaign_id: number;
  can_override_required_actions: boolean;
  required_actions: ICampaignRequiredActions;
}

export interface ICampaignGiftVendorsResponse {
  success: true;
  available_products_amount: number;
  vendors: IGiftVendor[];
}

export interface ICampaignVendorRestrictionsPayload {
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
  restrictedBrandIds: number[];
  restrictedMerchantIds: number[];
}

export interface ICampaignGiftTypesResponse {
  success: true;
  available_products_amount: number;
  types: IGiftType[];
}

export interface ICampaignTypeRestrictionsPayload {
  campaignId: number;
  campaignType: CAMPAIGN_TYPES;
}

export interface IUpdateVideoMessagePayload {
  campaign_id: number;
  recipient_video: string;
  can_override_recipient_video: boolean;
  recipient_video_type: string;
  vidyard_video: string;
  vidyard_image: string;
}

export interface IUpdateRedirectPayload {
  campaign_id: number;
  redirect_url: string;
  redirect_header: string;
  redirect_message: string;
  redirect_button: string;
  redirect_confirm: boolean;
}
/* eslint-enable camelcase */
