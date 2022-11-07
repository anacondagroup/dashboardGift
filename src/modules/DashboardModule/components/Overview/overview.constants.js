import { CAMPAIGN_TYPES } from '../../../../constants/campaignSettings.constants';

export const getStandardCampaignKPI = kpi => [
  {
    'data-testid': 'kpi-wrapper-meetings',
    title: 'Meetings',
    icon: 'calendar-alt',
    color: 'green',
    kpis: {
      ...kpi.meetings,
    },
  },
  {
    'data-testid': 'kpi-wrapper-invites',
    title: 'Gift invites',
    icon: 'gift',
    kpis: {
      ...kpi.invites,
    },
  },
  {
    'data-testid': 'kpi-wrapper-conversion',
    title: 'Average conversion',
    icon: 'filter',
    color: 'secondary',
    kpis: {
      ...kpi.conversion,
    },
    divider: 'v-line',
    prefix: '%',
  },
];

export const getSwagDigitalKPI = kpi => [
  {
    'data-testid': 'kpi-wrapper-meetings',
    title: 'Meetings',
    icon: 'calendar-alt',
    color: 'green',
    kpis: {
      ...kpi.meetings,
    },
  },
  {
    'data-testid': 'kpi-wrapper-codes',
    title: 'Codes',
    icon: 'gift',
    color: 'green',
    kpis: {
      ...kpi.codes,
    },
  },
  {
    'data-testid': 'kpi-wrapper-conversion',
    title: 'Average conversion',
    icon: 'filter',
    color: 'secondary',
    kpis: {
      ...kpi.conversion,
    },
    divider: 'v-line',
    prefix: '%',
  },
];

export const getActivateKPI = kpi => [
  {
    'data-at': 'kpi-wrapper-codes',
    title: 'Codes',
    icon: 'gift',
    color: 'green',
    kpis: {
      ...kpi.invites,
    },
  },
  {
    'data-at': 'kpi-wrapper-conversion',
    title: 'Average conversion',
    icon: 'filter',
    color: 'secondary',
    kpis: {
      ...kpi.conversion,
    },
    divider: 'v-line',
    prefix: '%',
  },
];

export const campaignKPIs = {
  standard: getStandardCampaignKPI,
  [CAMPAIGN_TYPES.PROSPECTING]: getStandardCampaignKPI,
  international: getStandardCampaignKPI,
  activate: getActivateKPI,
  'swag digital': getSwagDigitalKPI,
  'swag physical': getSwagDigitalKPI,
};

export const fakeKPIs = {
  meetings: {
    booked: 0,
  },
  invites: {
    created: 0,
    sent: 0,
    delivered: 0,
    viewed: 0,
    accepted: 0,
  },
  conversion: {
    sent_to_view: 0,
    sent_to_booked: 0,
    view_to_booked: 0,
  },
};
