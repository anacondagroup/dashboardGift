import React from 'react';
import { useScrollTop, useUrlQuery } from '@alycecom/hooks';

import '../Breakdowns/GiftInvitationReportButton/GiftInvitationReportButton';
import { render } from '../../../../testUtils';
import { useTrackPage } from '../../../../hooks/useTrackPage';

import DashboardTeam from './DashboardTeam';

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
jest.mock('../../hoc/BreakdownLoaders/OverviewLoader', () => ({ render: renderContent, ...props }) => (
  <overview-loader {...props}>
    {renderContent({ kpi: '#kpi#', statuses: '#statuses#', isLoading: false, total: '#total#' })}
  </overview-loader>
));
jest.mock('../../../../components/Dashboard/Shared/DashboardSection', () => ({ children, ...props }) => (
  <dashboard-section {...props}>
    <div>DashboardSection</div>
    {children}
  </dashboard-section>
));
jest.mock('../Breakdowns/TeamMembersBreakdown/TeamMembersBreakdown', () => () => 'TeamMembersBreakdown');
jest.mock('../../hoc/BreakdownLoaders/TeamMembersBreakdownLoader', () => ({ render: renderContent, ...props }) => (
  <team-breakdown-loader {...props}>
    {renderContent({ breakdown: ['team member item'], isLoading: false })}
  </team-breakdown-loader>
));
jest.mock('../Header/TeamFilters', () => () => 'TeamFilters');
jest.mock('../../hoc/BreakdownLoaders/CampaignsBreakdownLoader', () => ({ render: renderContent, ...props }) => (
  <campaigns-breakdown-loader {...props}>
    {renderContent({ breakdown: ['campaign item'], isLoading: false })}
  </campaigns-breakdown-loader>
));
jest.mock('../Breakdowns/CampaignsBreakdown/CampaignsBreakdown', () => () => 'CampaignsBreakdown');
jest.mock('../Header/DashboardStickyHeader', () => ({ renderFilter, ...props }) => (
  <dashboard-sticky-header {...props}>{renderFilter()}</dashboard-sticky-header>
));
jest.mock('../Sections/GiftBreakdownSection/GiftBreakdownSection', () => () => 'GiftBreakdownSection');
jest.mock('../../../../hooks/useTrackPage');
jest.mock('@alycecom/modules/dist/services/url.service');
jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
  useScrollTop: jest.fn(),
}));

describe('DashboardTeam', () => {
  const team = {
    id: 10,
    name: 'Team Name',
    settings: {
      currency_id: 1,
      enterprise_mode_enabled: true,
      country_id: 1,
    },
  };
  const campaign = { id: 11 };
  const defaultInitialState = {
    dashboard: {
      overview: {
        isReportLoading: false,
      },
      members: {
        members: [],
        isLoading: false,
        error: null,
      },
    },
    user: {
      isLoading: false,
    },
    teams: {
      teams: [team],
      isLoading: false,
      error: null,
    },
    campaigns: {
      campaigns: [campaign],
      isLoading: false,
    },
  };

  beforeEach(() => {
    useTrackPage.mockReset();
    useScrollTop.mockReset();

    useUrlQuery.mockReset().mockReturnValue({
      contactId: '12',
      dateRangeFrom: '2011-11-11',
      dateRangeTo: '2012-12-12',
      teamMembersSearch: 'q',
      teamMembersSort: 'members',
      teamMembersPage: '1',
      teamMembersDirection: 'asc',
      giftSort: 'type',
      giftDirection: 'desc',
      giftSearch: 'qq',
      giftPage: '2',
      campaignsSearch: 'qqq',
      campaignsSort: 'campaign',
      campaignsDirection: 'asc',
      campaignsPage: '3',
    });
  });

  const setup = (props, initialState = defaultInitialState) => render(<DashboardTeam teamId={10} />, { initialState });

  it('Should render correctly when team loaded', () => {
    const { container } = setup();
    expect(container.querySelector(`[header="How's ${team.name} doing?"]`)).toBeTruthy();
  });

  it('Should render correctly while team loading', () => {
    const state = {
      ...defaultInitialState,
      dashboard: {
        ...defaultInitialState.dashboard,
      },
      teams: {
        ...defaultInitialState.teams,
        teams: [],
        isLoading: true,
      },
      campaigns: {
        ...defaultInitialState.campaigns,
        campaigns: [],
        isLoading: true,
      },
    };
    const { container } = setup(undefined, state);
    expect(container.querySelector(`[header="How's ${team.name} doing?"]`)).toBeNull();
  });

  it('Should move scroll to top', () => {
    setup();
    expect(useScrollTop).toBeCalled();
  });

  it('Should fire track event', () => {
    setup();
    expect(useTrackPage).toBeCalledWith('Enterprise Dashboard — visit team members page', { team_id: 10 });
  });
});
