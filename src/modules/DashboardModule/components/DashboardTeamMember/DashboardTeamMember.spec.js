import React from 'react';
import { useUrlQuery } from '@alycecom/hooks';

import { render } from '../../../../testUtils';

import DashboardTeamMember from './DashboardTeamMember';

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
  <div>{renderContent({ kpi: '#kpi#', statuses: '#statuses#', isLoading: false, total: '#total#' })}</div>
));
jest.mock('../../../../components/Dashboard/Shared/DashboardSection', () => ({ children }) => <div>{children}</div>);
jest.mock('../../hoc/BreakdownLoaders/CampaignsBreakdownLoader', () => ({ render: renderContent }) => (
  <div>{renderContent({ breakdown: [{ id: 1 }], isLoading: false })}</div>
));
jest.mock('../Breakdowns/CampaignsBreakdown/CampaignsBreakdown', () => () => 'CampaignsBreakdown');
jest.mock('../Header/MemberFilter', () => () => 'MemberFilter');
jest.mock('../Header/DashboardStickyHeader', () => ({ renderFilter }) => <div>{renderFilter()}</div>);
jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
  useScrollTop: jest.fn(),
  useRouting: jest.fn(),
}));

describe('DashboardTeamMember', () => {
  const member = {
    id: 10,
    fullName: 'Member Full Name',
  };
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
      campaigns: {
        isLoading: false,
      },
      user: {
        isLoading: false,
      },
    },
  };

  beforeEach(() => {
    useUrlQuery.mockReset().mockReturnValue({
      contactId: 'CONTACT_ID',
      dateRangeFrom: 'DATE_RANGE_FROM',
      dateRangeTo: 'DATE_RANGE_TO',
      giftSort: 'GIFT_SORT',
      giftDirection: 'desc',
      giftSearch: 'GIFT_SEARCH',
      campaignsSearch: 'CAMP_SEARCH',
      campaignsSort: 'CAMP_SORT',
      campaignsDirection: 'CAMP_DIR',
      campaignsPage: 'CAMP_PAGE',
      giftPage: 'GIFT_PAGE',
    });
  });

  const setup = (props, initialState = defaultInitialState) =>
    render(<DashboardTeamMember memberId={member.id} teamId={11} {...props} />, { initialState });

  it('Should render correctly when member loaded', () => {
    const { container } = setup();
    expect(container.querySelector(`[header="Let's see how ${member.fullName} is doing."]`)).toBeTruthy();
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
    const { container } = setup(undefined, state);
    expect(container.querySelector(`[header="Let's see how ${member.fullName} is doing."]`)).toBeNull();
  });
});
