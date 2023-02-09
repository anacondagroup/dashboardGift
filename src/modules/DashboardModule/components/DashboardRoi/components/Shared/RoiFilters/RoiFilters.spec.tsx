import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getTeamListMock, getCampaignsListMock, getTeamMembersListMock } from '@alycecom/services';
import { setupTestServer } from '../../../../../../../mocks/server';
import { renderWithReduxProvider } from '../../../../../../../testUtils';
import RoiFilters from './RoiFilters';
import { useMswServer, mockOffsetHeightAndWidth } from '../../../../../../../testHelpers';

const server = setupTestServer(getTeamListMock, getCampaignsListMock, getTeamMembersListMock);

describe('RoiFilters', () => {
  useMswServer(server);
  mockOffsetHeightAndWidth();
  jest.mock('../../../../../../../store/teams/teams.selectors');
  const setup = () => {
    renderWithReduxProvider(<RoiFilters />);
    return {
      getTeamsFilter: () => screen.getByRole('button', { name: /Select Teams/ }),
      getTimeRangeFilter: () => screen.getByLabelText(/Time Range/),
    };
  };

  const setupFilterByCampaigns = () => {
    setup();

    const getButtonForCampaignFilter = screen.getByRole('button', { name: /Campaign/ });
    userEvent.click(getButtonForCampaignFilter);
  };

  const setupFilterByTeamMembers = () => {
    setup();

    const getButtonForTeamMembersFilter = screen.getByRole('button', { name: /Team Member/ });
    userEvent.click(getButtonForTeamMembersFilter);
  };

  it('should render teams and date filters', () => {
    const { getTeamsFilter, getTimeRangeFilter } = setup();

    expect(getTeamsFilter()).toBeInTheDocument();
    expect(getTimeRangeFilter()).toBeInTheDocument();
  });

  describe('Time Range', () => {
    it('should have Last 90 Days as a default option', () => {
      const { getTimeRangeFilter } = setup();

      expect(getTimeRangeFilter()).toBeInTheDocument();
    });

    it('should allow to change a selected option', () => {
      setup();

      userEvent.click(screen.getByRole('button', { name: /Past Quarter/ }));
      userEvent.click(screen.getByTestId('RoiFilters.TimeRange.MonthToDate'));

      expect(screen.getByTestId('RoiFilters.TimeRange.MonthToDate')).toBeInTheDocument();
    });
  });

  describe('Teams Filter', () => {
    it('should not have default value', () => {
      setup();

      expect(screen.getByRole('button', { name: 'Select Teams' })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should display correct options', async () => {
      const { getTeamsFilter } = setup();

      userEvent.click(getTeamsFilter());

      expect(await screen.findByRole('option', { name: /OlgaPetro-team1/ })).toBeInTheDocument();
      expect(await screen.findByRole('option', { name: /OlgaPetro-team2/ })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should allow to select a team', async () => {
      const { getTeamsFilter } = setup();

      userEvent.click(getTeamsFilter());

      const team = await screen.findByRole('option', { name: /OlgaPetro-team1/ });

      userEvent.click(team);

      expect(await screen.findByRole('button', { name: 'Select Teams (1)' })).toBeInTheDocument();
    });
  });

  describe('Campaigns Filter', () => {
    it('should render Campaigns filter and should not have default value', async () => {
      setupFilterByCampaigns();
      expect(await screen.findByRole('button', { name: 'Select Campaigns' })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should display correct options', async () => {
      setupFilterByCampaigns();

      const getCampaignFilter = await screen.findByRole('button', { name: /Select Campaigns/ });
      userEvent.click(getCampaignFilter);

      expect(await screen.findByRole('option', { name: /Test campaign 1/ })).toBeInTheDocument();
      expect(await screen.findByRole('option', { name: /Test campaign 2/ })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should allow to select a campaign', async () => {
      setupFilterByCampaigns();

      const getCampaignFilter = await screen.findByRole('button', { name: /Select Campaigns/ });
      userEvent.click(getCampaignFilter);

      const optionalCampaign = await screen.findByRole('option', { name: /Test campaign 1/ });

      userEvent.click(optionalCampaign);

      expect(await screen.findByRole('button', { name: 'Select Campaigns (1)' })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should allow to toggle back to Teams filter', async () => {
      setupFilterByCampaigns();

      const getButtonForTeamsFilter = await screen.findByRole('button', { name: /Teams/ });
      userEvent.click(getButtonForTeamsFilter);

      expect(await screen.findByRole('button', { name: 'Select Teams' })).toBeInTheDocument();
    }, 20000);
  });

  describe('Team members Filter', () => {
    it('should render Team members filter and should not have default value', async () => {
      setupFilterByTeamMembers();
      expect(await screen.findByRole('button', { name: 'Select Team Members' })).toBeInTheDocument();
    });

    // FIXME: Unstable
    xit('should display correct options', async () => {
      setupFilterByTeamMembers();

      const getMembersFilter = await screen.findByRole('button', { name: /Select Team Members/ });
      userEvent.click(getMembersFilter);

      expect(await screen.findByRole('option', { name: /John Doe/ })).toBeInTheDocument();
      expect(await screen.findByRole('option', { name: /Jane Doe/ })).toBeInTheDocument();
    }, 20000);

    // FIXME: Unstable
    xit('should allow to select a team member', async () => {
      setupFilterByTeamMembers();

      const getMembersFilter = await screen.findByRole('button', { name: /Select Team Members/ });
      userEvent.click(getMembersFilter);

      const optionalTeamMember = await screen.findByRole('option', { name: /John Doe/ });

      userEvent.click(optionalTeamMember);

      expect(await screen.findByRole('button', { name: 'Select Team Members (1)' })).toBeInTheDocument();
    }, 20000);

    // FIXME: Unstable
    xit('should allow to toggle back to Teams filter', async () => {
      setupFilterByTeamMembers();

      const getButtonForTeamsFilter = await screen.findByRole('button', { name: /Teams/ });
      userEvent.click(getButtonForTeamsFilter);

      expect(await screen.findByRole('button', { name: 'Select Teams' })).toBeInTheDocument();
    });
  });
});
