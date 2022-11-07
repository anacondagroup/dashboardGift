import React from 'react';
import { useUrlQuery } from '@alycecom/hooks';

import { render, cleanup } from '../../../../testUtils';

import DashboardCampaignMember from './DashboardCampaignMember';

jest.mock('../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton', () => () =>
  'GiftInvitationReportButton',
);
jest.mock('../../../../components/Dashboard/Header/DashboardHeader', () => ({ controls, ...props }) => (
  <dashboard-header {...props}>
    <div>DashboardHeader</div>
    {controls}
  </dashboard-header>
));
jest.mock('../Overview/DashboardKpi', () => () => 'DashboardKPI');
jest.mock('../Overview/DashboardGiftStatuses', () => () => 'DashboardGiftStatuses');
jest.mock('../../hoc/BreakdownLoaders/OverviewLoader', () => ({ render: renderContent }) => (
  <div>{renderContent({ kpi: '#kpi#', statuses: '#statuses#', isLoading: false, total: '#total' })}</div>
));
jest.mock('../../../../components/Dashboard/Shared/DashboardSection', () => ({ children, ...props }) => (
  <dashboard-section {...props}>{children}</dashboard-section>
));
jest.mock('../Header/MemberFilter', () => () => 'MemberFilter');
jest.mock('../Header/DashboardStickyHeader', () => ({ renderFilter, ...props }) => (
  <dashboard-sticky-header {...props}>{renderFilter()}</dashboard-sticky-header>
));
jest.mock('../Sections/GiftBreakdownSection/GiftBreakdownSection', () => () => 'GiftBreakdownSection');
jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
  useScrollTop: jest.fn(),
  useRouting: jest.fn(),
}));

describe('DashboardCampaignMember', () => {
  const member = { id: 10 };
  const campaign = { id: 11 };
  const defaultInitialState = {
    dashboard: {
      overview: {
        isReportLoading: false,
      },
      members: {
        members: [member],
        isLoading: false,
        error: null,
      },
    },
  };

  beforeEach(() => {
    useUrlQuery.mockReset().mockReturnValue({
      contactId: 'CONTACT_ID',
      dateRangeFrom: 'DATE_RANGE_FROM',
      dateRangeTo: 'DATE_RANGE_TO',
      giftSort: 'GIFT_SORT',
      giftDirection: 'asc',
      giftSearch: 'GIFT_SEARCH',
      giftPage: 'GIFT_PAGE',
    });
  });

  afterEach(cleanup);

  const setup = (props, initialState = defaultInitialState) =>
    render(<DashboardCampaignMember campaignId={campaign.id} memberId={member.id} />, {
      initialState,
    });

  it('Should render correctly when member loaded', () => {
    const { asFragment } = setup();
    expect(asFragment()).toMatchSnapshot();
  });

  it('Should render correctly while members loading', () => {
    const state = {
      ...defaultInitialState,
      dashboard: {
        ...defaultInitialState.dashboard,
        members: {
          ...defaultInitialState.dashboard.members,
          members: [],
          isLoading: true,
        },
      },
    };
    const { asFragment } = setup(undefined, state);
    expect(asFragment()).toMatchSnapshot();
  });
});
