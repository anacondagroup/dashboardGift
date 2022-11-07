import { IApiService } from '@alycecom/services';
import { Observable } from 'rxjs';
import { AjaxResponse } from 'rxjs/ajax';

interface IGetIntegrationServiceParams {
  service: string;
  script: string;
  path: string;
  scopes?: {
    email: boolean;
    calendar: boolean;
  };
}

interface ISetPasswordParams {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirmation: string;
}

interface ISetMeetingPreferencesParams {
  meetingLimits: {
    startIn: number;
    finishIn: number;
  };
  hideBusyCalendarPeriods: boolean;
  meetingFrequency: number;
  meetingDuration: number;
  autoSendMeetingInviteToRecipient: boolean;
  bufferTimeInMinutes: number;
  meetingPlace: { place: string; additionalInfo: string };
  calendarTimezone: string;
}

interface IDayAvailability {
  day: number;
  from: string;
  till: string;
}

interface ISetFanFactsParams {
  funFacts: string;
  showFunFacts: boolean;
}

interface ITemplate {
  name: string;
  subject: string;
  message: string;
}

export interface IPersonalSettingsService {
  getActiveEmailIntegration: () => Observable<AjaxResponse>;
  getEmailIntegrationServices: (path: string) => Observable<AjaxResponse>;
  disconnectFromIntegration: () => Observable<AjaxResponse>;
  getIntegrationService: (params: IGetIntegrationServiceParams) => Observable<AjaxResponse>;
  getGeneralSettings: () => Observable<AjaxResponse>;
  setRole: (role: string) => Observable<AjaxResponse>;
  setPhone: (phone: string) => Observable<AjaxResponse>;
  setName: ({ firstName, lastName }: { firstName: string; lastName: string }) => Observable<AjaxResponse>;
  deleteAvatar: () => Observable<AjaxResponse>;
  setAvatar: (file: File) => Observable<AjaxResponse>;
  getProfileSettings: () => Observable<AjaxResponse>;
  setPassword: (params: ISetPasswordParams) => Observable<AjaxResponse>;
  resetPassword: () => Observable<AjaxResponse>;
  setCurrency: (currencyId: number) => Observable<AjaxResponse>;
  setCountry: (countryId: number) => Observable<AjaxResponse>;
  unsubscribe: () => Observable<AjaxResponse>;
  setMeetingPreferences: (settings: ISetMeetingPreferencesParams) => Observable<AjaxResponse>;
  setCalendarPeriod: (periods: IDayAvailability[]) => Observable<AjaxResponse>;
  setFunFacts: (params: ISetFanFactsParams) => Observable<AjaxResponse>;
  getTemplates: () => Observable<AjaxResponse>;
  createTemplate: (template: ITemplate) => Observable<AjaxResponse>;
  updateTemplate: (template: ITemplate & { id: number }) => Observable<AjaxResponse>;
  deleteTemplate: (id: number) => Observable<AjaxResponse>;
}

export const createPersonalSettingsService = (apiService: IApiService): IPersonalSettingsService => ({
  /* Email Integration */
  getActiveEmailIntegration: () => apiService.get('/enterprise/dashboard/settings/integration/active', {}, false),
  getEmailIntegrationServices: (path = '') =>
    apiService.get(
      `/enterprise/dashboard/settings/integration/services${path && `?path=${encodeURIComponent(path)}`}`,
      {},
      false,
    ),
  disconnectFromIntegration: () => apiService.get(`/enterprise/dashboard/settings/integration/disconnect`, {}, false),
  getIntegrationService: ({ service, script = '', path = '', scopes = { email: false, calendar: false } }) => {
    const params = new URLSearchParams();
    if (script) {
      params.set('script', script);
    }
    if (path) {
      params.set('path', path);
    }
    if (Object.keys(scopes).length) {
      Object.keys(scopes).forEach(key => {
        if (key === 'email' || key === 'calendar') {
          params.set(key, scopes[key].toString());
        }
      });
    }

    return apiService.get(`/enterprise/dashboard/settings/integration/connect/${service}?${params}`, {}, false);
  },
  /* General Settings */
  getGeneralSettings: () => apiService.get('/enterprise/dashboard/settings/general', {}, false),
  setRole: role =>
    apiService.post(
      '/enterprise/dashboard/settings/update/employment',
      {
        body: { employment: role },
      },
      false,
    ),
  setPhone: phone =>
    apiService.post(
      '/enterprise/dashboard/settings/update/phone',
      {
        body: { phone_number: phone },
      },
      false,
    ),
  setName: ({ firstName, lastName }) =>
    apiService.post(
      '/enterprise/dashboard/settings/update/name',
      {
        body: { first_name: firstName, last_name: lastName },
      },
      false,
    ),
  deleteAvatar: () => apiService.get('/enterprise/dashboard/settings/remove/image', {}, false),
  setAvatar: file => {
    const formData = new FormData();
    formData.append('image', file, file.name);
    return apiService.postFile(
      '/enterprise/dashboard/settings/update/image',
      {
        body: formData,
      },
      false,
    );
  },
  /* Personal Settings */
  getProfileSettings: () => apiService.get('/enterprise/dashboard/settings/personal', {}, false),
  setPassword: ({ currentPassword, newPassword, newPasswordConfirmation }) =>
    apiService.post(
      '/enterprise/dashboard/settings/update/password',
      {
        body: {
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        },
      },
      false,
    ),
  resetPassword: () => apiService.get('/enterprise/dashboard/settings/reset-password', {}, false),
  setCurrency: currencyId =>
    apiService.post(
      '/enterprise/dashboard/settings/update/currency',
      {
        body: {
          currency_id: currencyId,
        },
      },
      false,
    ),
  setCountry: countryId =>
    apiService.post(
      '/enterprise/dashboard/settings/update/country',
      {
        body: {
          country_id: countryId,
        },
      },
      false,
    ),
  unsubscribe: () => apiService.post('/enterprise/dashboard/settings/update/subscription', {}, false),
  setMeetingPreferences: ({
    meetingLimits: { startIn, finishIn },
    hideBusyCalendarPeriods,
    meetingFrequency,
    meetingDuration,
    autoSendMeetingInviteToRecipient,
    bufferTimeInMinutes,
    meetingPlace: { place, additionalInfo },
    calendarTimezone,
  }) =>
    apiService.post(
      '/enterprise/dashboard/settings/update/meeting-configs',
      {
        body: {
          meeting_limits: {
            start_in: startIn,
            finish_in: finishIn,
          },
          hide_busy_calendar_periods: hideBusyCalendarPeriods,
          buffer_time_in_minutes: bufferTimeInMinutes,
          meeting_config: {
            duration: meetingDuration,
            frequency: meetingFrequency,
            auto_send_meeting_invite_to_recipient: autoSendMeetingInviteToRecipient,
          },
          place: {
            place,
            additional_info: additionalInfo,
          },
          timezone: calendarTimezone,
        },
      },
      false,
    ),
  setCalendarPeriod: availabilityPeriods =>
    apiService.post(
      '/enterprise/dashboard/settings/update/availability-periods',
      {
        body: {
          availability_periods: availabilityPeriods,
        },
      },
      false,
    ),
  setFunFacts: ({ funFacts, showFunFacts }) =>
    apiService.post(
      '/enterprise/dashboard/settings/update/fun-facts',
      {
        body: {
          fun_facts: funFacts,
          show_fun_facts: showFunFacts,
        },
      },
      false,
    ),
  getTemplates: () => apiService.get('/api/v1/messaging/gift-invitation-templates/user', {}, true),
  createTemplate: template =>
    apiService.post(
      '/api/v1/messaging/gift-invitation-templates/user',
      {
        body: template,
      },
      true,
    ),
  updateTemplate: ({ id, ...template }) =>
    apiService.patch(
      `/api/v1/messaging/gift-invitation-templates/user/${id}`,
      {
        body: template,
      },
      true,
    ),
  deleteTemplate: id => apiService.delete(`/api/v1/messaging/gift-invitation-templates/user/${id}`, {}, true),
});
