import { IApiService } from '@alycecom/services';
import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';
import qs from 'query-string';

interface ICreateGiftParams {
  campaignId: number;
  contactId: number;
  product: unknown;
}

interface ISetGiftMessageParams {
  giftId: number;
  subject: string;
  message: string;
  isReadyToBeSend: boolean;
}

interface ISetVideoMessageParams {
  giftId: number;
  type: string;
  videoUrl: string;
  vidyardImage: string;
  vidyardVideo: string;
  isReady: boolean;
}

interface IGetAvailableCampaignsParams {
  search?: string;
  countryId: number | null;
}

interface IGetAvailableContactsParams {
  firstName?: string;
  lastName?: string;
  email?: string;
  employment?: string;
  page: number;
  perPage: number;
}

export interface IGiftCreateService {
  getEnrichmentResult: (enrichmentId: number) => Observable<AjaxResponse>;
  setFullResearchType: (giftId: number) => Observable<AjaxResponse>;
  getInstantResearchStatus: (giftId: number) => Observable<AjaxResponse>;
  getFeatureFlags: () => Observable<AjaxResponse>;
  getAvailableCampaigns: ({ search, countryId }: IGetAvailableCampaignsParams) => Observable<AjaxResponse>;
  getAvailableContacts: (params: IGetAvailableContactsParams) => Observable<AjaxResponse>;
  getAvailableTemplates: (giftId: number) => Observable<AjaxResponse>;
  loadGift: (giftId: number) => Observable<AjaxResponse>;
  createRecipient: (recipient: unknown) => Observable<AjaxResponse>;
  createGift: ({ campaignId, contactId, product }: ICreateGiftParams) => Observable<AjaxResponse>;
  sendGift: (gift: unknown) => Observable<AjaxResponse>;
  setGiftMessage: (params: ISetGiftMessageParams) => Observable<AjaxResponse>;
  getAvailableInvitationTypes: (giftId: number) => Observable<AjaxResponse>;
  selectInvitationType: (giftId: number, invitation: unknown) => Observable<AjaxResponse>;
  setGiftProduct: (giftId: number, productId: number) => Observable<AjaxResponse>;
  discardGift: (giftId: number) => Observable<AjaxResponse>;
  loadSendAs: (teamId: number) => Observable<AjaxResponse>;
  setSendAs: (giftId: number, userId: number) => Observable<AjaxResponse>;
  setVideoMessage: (params: ISetVideoMessageParams) => Observable<AjaxResponse>;
  getEmailPreview: (giftId: number, provider: string) => Observable<AjaxResponse>;
  setGiftActions: (giftId: number, giftActionsId: number, prospect: unknown) => Observable<AjaxResponse>;
  getCampaignProductDetails: (productId: number, campaignId: number) => Observable<AjaxResponse>;
  getProductDetails: (productId: number, giftId: number) => Observable<AjaxResponse>;
  getExchangeProducts: (giftId: number, requestOptions: string) => Observable<AjaxResponse>;
  getCampaignProducts: (campaignId: number, requestOptions: string) => Observable<AjaxResponse>;
  setExchangeProduct: (giftId: number, product: unknown) => Observable<AjaxResponse>;
  getMarketplaceFilters: (giftId: number) => Observable<AjaxResponse>;
  getCampaignFilters: (campaignId: number) => Observable<AjaxResponse>;
  sendMoreInfo: ({ giftId, info }: { giftId: number; info: unknown }) => Observable<AjaxResponse>;
  getCommonData: () => Observable<AjaxResponse>;
  expireGift: (giftId: number) => Observable<AjaxResponse>;
  cancelGift: (giftId: number) => Observable<AjaxResponse>;
  getCountries: () => Observable<AjaxResponse>;
  getAvailableCountriesIds: () => Observable<AjaxResponse>;
}

export const createGiftCreateService = (apiService: IApiService): IGiftCreateService => ({
  getEnrichmentResult: enrichmentId => apiService.get(`/enterprise/contact/enrichment/${enrichmentId}`, {}, false),
  setFullResearchType: giftId => apiService.get(`/enterprise/gift-create/full-research?gift_id=${giftId}`, {}, false),
  getInstantResearchStatus: giftId =>
    apiService.get(`/enterprise/gift-create/is-proposed?gift_id=${giftId}`, {}, false),
  getFeatureFlags: () => apiService.get('/enterprise/dashboard/settings/organisations/enabled-features', {}, false),
  getAvailableCampaigns: params =>
    apiService.get(
      `/enterprise/gift-create/available-campaigns?${qs.stringify(params, { skipEmptyString: true, skipNull: true })}`,
      {},
      false,
    ),
  getAvailableContacts: params =>
    apiService.get(`/enterprise/gift-create/available-contacts?${qs.stringify(params)}`, {}, false),
  getAvailableTemplates: giftId => apiService.get(`/enterprise/gifts/${giftId}/templates`, {}, false),
  loadGift: giftId => apiService.get(`/enterprise/gifts/${giftId}`, {}, false),
  createRecipient: recipient => apiService.post('/enterprise/contact', { body: recipient }, false),
  createGift: ({ campaignId, contactId, product }) =>
    apiService.post(
      '/enterprise/gift-create',
      { body: { contact_id: contactId, campaign_id: campaignId, product } },
      false,
    ),
  sendGift: gift => apiService.post('/enterprise/gift-create/send', { body: gift }, true),
  setGiftMessage: ({ giftId, subject, message, isReadyToBeSend }) =>
    apiService.post(
      `/enterprise/gifts/${giftId}/set-message-template`,
      {
        body: { subject, message, is_ready_to_be_sent: isReadyToBeSend },
      },
      false,
    ),
  getAvailableInvitationTypes: giftId => apiService.get(`/enterprise/gifts/${giftId}/gift-invitation-items`, {}, false),
  selectInvitationType: (giftId, invitation) =>
    apiService.post(`/enterprise/gifts/${giftId}/set-delivery-method`, { body: invitation }, false),
  setGiftProduct: (giftId, productId) =>
    apiService.post(`/enterprise/gifts/${giftId}/set-product`, { body: { product_id: productId } }, false),
  discardGift: giftId => apiService.get(`/enterprise/gifts/${giftId}/discard`, {}, false),
  loadSendAs: teamId => apiService.get(`/enterprise/gift-create/available-send-as?team_id=${teamId}`, {}, false),
  setSendAs: (giftId, userId) =>
    apiService.post(
      '/enterprise/gift-create/set-send-as',
      {
        body: {
          gift_id: giftId,
          send_as_user_id: userId,
        },
      },
      false,
    ),
  setVideoMessage: ({ giftId, type, videoUrl, vidyardImage, vidyardVideo, isReady }) =>
    apiService.post(
      `/enterprise/gifts/${giftId}/set-recipient-video`,
      {
        body: {
          is_recipient_video_ready: isReady,
          recipient_video_type: type,
          recipient_video: videoUrl,
          vidyard_video: vidyardVideo,
          vidyard_image: vidyardImage,
        },
      },
      false,
    ),
  getEmailPreview: (giftId, provider = 'default') =>
    apiService.get(`/enterprise/dashboard/email/preview/${giftId}?provider=${provider}`, {}, false),
  setGiftActions: (giftId, giftActionsId, prospect) =>
    apiService.post(
      `/enterprise/gifts/${giftId}/set-gift-actions`,
      {
        body: {
          available_recipient_actions: giftActionsId,
          prospect,
        },
      },
      false,
    ),
  getProductDetails: (productId, giftId) =>
    apiService.get(`/enterprise/marketplace/products/${productId}?gift_id=${giftId}`, {}, false),
  getCampaignProductDetails: (productId, campaignId) =>
    apiService.get(`/enterprise/marketplace/products/${productId}?campaign_id=${campaignId}`, {}, false),
  getExchangeProducts: (giftId, requestOptions) =>
    apiService.get(`/enterprise/marketplace/gift/${giftId}/products?${requestOptions}`, {}, false),
  getCampaignProducts: (campaignId, requestOptions) =>
    apiService.get(`/enterprise/marketplace/campaigns/${campaignId}/products?${requestOptions}`, {}, false),
  setExchangeProduct: (giftId, product) =>
    apiService.post(
      `/enterprise/marketplace/gift/${giftId}/choose-product`,
      {
        body: product,
      },
      false,
    ),
  getMarketplaceFilters: giftId => apiService.get(`/enterprise/marketplace/gift/${giftId}/filters`, {}, false),
  getCampaignFilters: campaignId => apiService.get(`/enterprise/marketplace/campaign/${campaignId}/filters`, {}, false),
  sendMoreInfo: ({ giftId, info }) =>
    apiService.post(
      `/enterprise/gifts/${giftId}/post-more-info`,
      {
        body: {
          free_input: info,
        },
      },
      false,
    ),
  getCommonData: () => apiService.get('/enterprise/dashboard/common', {}, false),
  expireGift: giftId => apiService.post('/enterprise/gift-create/expire', { body: { giftId } }, true),
  cancelGift: giftId => apiService.post('/enterprise/gift-create/cancel', { body: { giftId } }, true),
  getCountries: () => apiService.get('/api/v1/countries', {}, true),
  getAvailableCountriesIds: () => apiService.get('/api/v1/available-countries', {}, true),
});
