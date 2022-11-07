export interface IActivateMessagingStep extends IActivateMessaging {
  landingPageContentType: LandingPageContents;
}

export interface IActivateMessaging {
  pageHeader: string;
  pageBody: string | null;
  postGiftAction: PostGiftActions;
  postGiftRedirect: string | null;
  showGiftRedemptionPopUp: boolean;
  redemptionPopUp: IRedemptionPopUp | null;
  videoData: IVideoData | null;
  expirePopUp: TExpirePopupData | null;
  recipientMeta: TRecipientMetaData | null;
}

export type TExpirePopupData = {
  header: null | string;
  message: null | string;
};

export type TRecipientMetaData = {
  header: null | string;
  description: null | string;
};

export enum PostGiftActions {
  NoCta = 'no-cta',
  Redirect = 'redirect',
}

export interface IRedemptionPopUp {
  header: string;
  message: string;
  buttonLabel: string;
}

export enum LandingPageContents {
  Text = 'text',
  Vidyard = 'vidyard',
  EmbedVideo = 'embed',
}

export interface IVideoData {
  url: string | null;
  type: VideoDataTypes;
  vidyardImage: string | null;
  vidyardVideo: string | null;
}

export enum VideoDataTypes {
  Embed = 'embed',
  Vidyard = 'vidyard',
}
