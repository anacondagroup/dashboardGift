export interface INotificationSettings {
  /* eslint-disable camelcase */
  notify_owner: boolean;
  notify_sender: boolean;
  notify_send_as_person: boolean;
  /* eslint-enable camelcase */
}

export interface ICampaignNotifications {
  [key: string]: INotificationSettings;
}

export interface IGeneralCampaignSettings {
  id: number;
  name: string;
  type: string;
  notifications: ICampaignNotifications;
  countryIds: number[];
}
