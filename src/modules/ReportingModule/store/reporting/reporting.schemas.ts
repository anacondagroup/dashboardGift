import { array, object, string } from 'yup';
import moment from 'moment-timezone';

import { ITeam } from '../../../UsersManagement/store/usersManagement.types';

import { monthDays, frequency, hoursList, reportingTimespan, maximumValidDate } from './reporting.constants';

export interface IDownloadPerformance {
  teams: ITeam[];
  reportingTimeframe: {
    preset: string;
    to: string;
    from: string;
  };
}

export interface TAutomatedReportForm {
  teams: ITeam[];
  reportingTimespan: { key: string; value: string };
  frequency: string;
  days: string;
  time: string;
  timezone: string;
}

export const calendarValidation = object().shape({
  reportingTimeframe: object().shape({
    preset: string().required(),
    to: string()
      .required('Finish date is a required field')
      .default(undefined)
      .test('max', 'Finish date should be less than today', value => {
        if (!value) {
          return true;
        }
        return !moment(value).isAfter(moment(maximumValidDate));
      }),
    from: string()
      .required('Start date is a required field')
      .default(undefined)
      .test('max', 'Start date should be less than today', value => {
        if (!value) {
          return true;
        }
        return !moment(value).isAfter(moment(maximumValidDate));
      }),
  }),
});

export interface TDownloadReportForm {
  reportingTimeframe?: {
    preset: string;
    to: string;
    from: string;
  };
  orgId: number;
  teams?: ITeam[];
  startDate: string;
  endDate: string;
  name: string;
  runOnce: boolean;
}
export const DownloadReportFormSchema = object().shape({
  teams: array().required().min(1, 'Teams is a required field'),
  reportingTimespan: object()
    .default(reportingTimespan[0])
    .shape({ key: string().required(), value: string().required() })
    .required(),
});

export const AutomatedReportFormSchema = object().shape({
  teams: array().required().min(1, 'Teams is a required field'),
  reportingTimespan: object()
    .default(reportingTimespan[2])
    .shape({ key: string().required(), value: string().required() })
    .required(),
  frequency: string().default(frequency[0]).required(),
  days: string().default(monthDays[0]).required(),
  time: string().default(hoursList[17]).required(),
  timezone: string().default(moment().tz(moment.tz.guess()).format('z')),
});

export const formDefaultValues = AutomatedReportFormSchema.getDefault() as TAutomatedReportForm;
