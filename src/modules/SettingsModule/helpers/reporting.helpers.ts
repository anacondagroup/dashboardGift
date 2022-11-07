import { TAutomatedReportForm } from '../../ReportingModule/store/reporting/reporting.schemas';
import { ReportingFrequencyEnum } from '../constants/reporting.constants';

export const formattedSendDay = (form: TAutomatedReportForm): string | number => {
  if (form.frequency.toLowerCase() === ReportingFrequencyEnum.monthly) {
    return +form.days.replace(/[a-z][A-Z]/gi, '');
  }
  if (form.frequency.toLowerCase() === ReportingFrequencyEnum.weekly) {
    return form.days.slice(0, 3).toLowerCase();
  }

  return '';
};
