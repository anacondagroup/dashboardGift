export type TEmailNotificationsSettingsResponse = IEmailNotificationsSettings;
export interface IActiveIntegrationsResponse {
  service: {
    email: string;
    name: string;
  } | null;
  // eslint-disable-next-line camelcase
  using_dkim: boolean;
  success: boolean;
}

export interface IEmailNotificationsSettings {
  assist: boolean;
}

export type TEmailNotificationsSettingsBody = IEmailNotificationsSettings;
