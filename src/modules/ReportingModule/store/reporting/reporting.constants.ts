import moment from 'moment-timezone';
import { REQUEST_DATE_FORMAT } from '@alycecom/ui';

export enum GiftingInsights {
  performanceSummary = 'Performance Summary',
  teamUsage = 'Team Usage',
  giftingTrends = 'Gifting Trends',
}

export const GiftingInsightsAPICall = {
  [GiftingInsights.performanceSummary]: 'performance_summary',
  [GiftingInsights.teamUsage]: 'team_usage',
  [GiftingInsights.giftingTrends]: 'gifting_trends',
};

export enum ReportingSidebarStep {
  downloadPerformanceSummary,
  downloadTeamUsage,
  automatedPerformanceSummary,
  automatedTeamUsage,
  automatedGiftingTrends,
  editAutomatedReport,
  downloadGiftingTrends,
  createPerformanceSummaryReport,
  createGiftingTrendsReport,
  createNewTeamUsageReport,
  editGiftingTrendsReport,
  editPerformanceReport,
  editTeamUsageReport,
}

export const ReportingSidebarCategory = {
  [GiftingInsights.performanceSummary]: {
    automatedReport: ReportingSidebarStep.automatedPerformanceSummary,
    downloadReport: ReportingSidebarStep.downloadPerformanceSummary,
    createReport: ReportingSidebarStep.createPerformanceSummaryReport,
    editReport: ReportingSidebarStep.editPerformanceReport,
  },
  [GiftingInsights.teamUsage]: {
    automatedReport: ReportingSidebarStep.automatedTeamUsage,
    downloadReport: ReportingSidebarStep.downloadTeamUsage,
    createReport: ReportingSidebarStep.createNewTeamUsageReport,
    editReport: ReportingSidebarStep.editTeamUsageReport,
  },
  [GiftingInsights.giftingTrends]: {
    automatedReport: ReportingSidebarStep.automatedGiftingTrends,
    downloadReport: ReportingSidebarStep.downloadGiftingTrends,
    createReport: ReportingSidebarStep.createGiftingTrendsReport,
    editReport: ReportingSidebarStep.editGiftingTrendsReport,
  },
};

export const ReportingStepTitle = {
  [ReportingSidebarStep.downloadPerformanceSummary]: 'Generate Performance Summary Report',
  [ReportingSidebarStep.downloadTeamUsage]: 'Generate Team Usage Report',
  [ReportingSidebarStep.automatedPerformanceSummary]: 'Manage Your Automated Reporting',
  [ReportingSidebarStep.automatedTeamUsage]: 'Manage Your Automated Reporting',
  [ReportingSidebarStep.automatedGiftingTrends]: 'Manage Your Automated Reporting',
  [ReportingSidebarStep.createNewTeamUsageReport]: 'Create a New Automated Report',
  [ReportingSidebarStep.createPerformanceSummaryReport]: 'Create a New Automated Report',
  [ReportingSidebarStep.createGiftingTrendsReport]: 'Create a New Automated Report',
  [ReportingSidebarStep.editAutomatedReport]: 'Edit your Automated Report',
  [ReportingSidebarStep.downloadGiftingTrends]: 'Generate Gifting Trends Report',
  [ReportingSidebarStep.editGiftingTrendsReport]: 'Edit your Automated Report',
  [ReportingSidebarStep.editPerformanceReport]: 'Edit your Automated Report',
  [ReportingSidebarStep.editTeamUsageReport]: 'Edit your Automated Report',
};

export const AutomatedReportTitle = {
  [ReportingSidebarStep.automatedPerformanceSummary]: 'Performance Summary Report Automation',
  [ReportingSidebarStep.automatedTeamUsage]: 'Team Usage Report Automation',
  [ReportingSidebarStep.automatedGiftingTrends]: 'Gifting Trends Report Automation',
};

export const CreateReportTitle = {
  [ReportingSidebarStep.createPerformanceSummaryReport]: 'Performance Summary Report Automation',
  [ReportingSidebarStep.createNewTeamUsageReport]: 'Team Usage Report Automation',
  [ReportingSidebarStep.createGiftingTrendsReport]: 'Gifting Trends Report Automation',
};

export const performanceSummaryDetalils = [
  'Overall sending/claim activity',
  'Gifting funnel',
  'Top-performing campaigns',
  'Top-performing teams',
];

export const teamUsageDetails = ['Most successful senders', 'Who is not sending', 'All team member activity'];

export const giftingInsightsDetails = ['Most popular gifts send', 'Hightest-converting gifts', 'Most-exchanged gifts'];

export const maximumValidDate = moment().format(REQUEST_DATE_FORMAT);

export const reportingTimespan = [
  { key: 'last_week', value: 'Past week' },
  { key: 'last_month', value: 'Past month' },
  { key: 'last_quarter', value: 'Past quarter' },
  { key: 'last_year', value: 'Past year' },
  { key: '7', value: 'Prior 7 Days' },
  { key: '14', value: 'Prior 14 Days' },
  { key: '30', value: 'Prior 30 Days' },
  { key: '90', value: 'Prior 3 Months' },
  { key: '180', value: 'Prior 6 Months' },
  { key: '365', value: 'Prior Year' },
];

export const frequency = ['Monthly', 'Weekly', 'Daily'];
export const days = moment.weekdays();
export const monthDays = Array.from({ length: 31 }, (_, item) => moment({ day: item + 1 }).format('Do'));

const getDayHours = () => {
  const hours: string[] = Array.from({ length: 24 }, (value, item) => moment({ hour: item }).format('h:mm A'));
  return hours;
};

export const hoursList = getDayHours();
