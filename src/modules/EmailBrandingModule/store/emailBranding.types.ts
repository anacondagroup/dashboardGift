export interface IBrandingSettings {
  companyLogoUrl: string;
  companyLogoId: number;
  companyLogoWidth: number;
  buttonColor: string;
  buttonTextColor: string;
  buttonBorderColor: string;
  footerLinkColor: string;
  outreachEmail: string;
  footerCopyrightInscription: string;
  privacyPolicyUrl: string;
  headerBackgroundColor: string;
  headerItemsColor: string;
  headerItemsOpacity: number;
}

export enum EmailBrandingFields {
  companyLogoUrl = 'companyLogoUrl',
  companyLogoId = 'companyLogoId',
  companyLogoWidth = 'companyLogoWidth',
  headerBackgroundColor = 'headerBackgroundColor',
  headerItemsColor = 'headerItemsColor',
  headerItemsOpacity = 'headerItemsOpacity',
  buttonColor = 'buttonColor',
  buttonTextColor = 'buttonTextColor',
  buttonBorderColor = 'buttonBorderColor',
  privacyPolicyUrl = 'privacyPolicyUrl',
  footerCopyrightInscription = 'footerCopyrightInscription',
}

export interface IUploadImageParams {
  name: TImageName;
  file: File;
}

export enum EmailBrandingImageName {
  logo = 'logo',
}
export type TImageName = EmailBrandingImageName.logo;
export type TImage = { id: number; url: string };

export interface IChangeImageParams {
  name: TImageName;
  image: TImage;
}

export enum BgOptions {
  empty = 'empty',
  solid = 'solid',
  alycePattern = 'alycePattern',
}

export type TBrandingSettingsErrors = Partial<Record<EmailBrandingFields | string, string[]>>;
