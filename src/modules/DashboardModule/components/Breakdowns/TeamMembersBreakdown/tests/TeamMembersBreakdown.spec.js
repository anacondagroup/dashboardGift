import React from 'react';
import { shallow } from 'enzyme';

import { TeamMembersBreakdownComponent } from '../TeamMembersBreakdown';
import TeamMembersBreakdownTable from '../TeamMembersBreakdownTable';
import EmptyDataset from '../../../../../../components/Shared/EmptyDataset';
import { fullStateMock } from '../../../../../../mocks/fullState.mock';

describe('TeamMembersBreakdown', () => {
  describe('Loading state', () => {
    it('Should show empty state if loaded and empty', () => {
      const sort = 'first_name';
      const sortDirection = 'asc';
      const classes = {};
      const breakdown = [];
      const onFilterChange = jest.fn();
      const memberLink = () => 'link';
      const isLoaded = true;

      const wrapper = shallow(
        <TeamMembersBreakdownComponent
          isLoaded={isLoaded}
          sort={sort}
          sortDirection={sortDirection}
          classes={classes}
          breakdown={breakdown}
          onFilterChange={onFilterChange}
          memberLink={memberLink}
        />,
      );

      expect(wrapper.find(TeamMembersBreakdownTable).exists()).toBe(false);
      expect(wrapper.find(EmptyDataset).exists()).toBe(true);
    });

    it('Should show table if loaded and empty not', () => {
      const sort = 'first_name';
      const sortDirection = 'asc';
      const classes = {};
      const { breakdown } = fullStateMock.dashboard.breakdowns.teamMembers;
      const onFilterChange = jest.fn();
      const memberLink = () => 'link';
      const isLoaded = true;

      const wrapper = shallow(
        <TeamMembersBreakdownComponent
          isLoaded={isLoaded}
          sort={sort}
          sortDirection={sortDirection}
          classes={classes}
          breakdown={breakdown}
          onFilterChange={onFilterChange}
          memberLink={memberLink}
        />,
      );

      expect(wrapper.find(TeamMembersBreakdownTable).exists()).toBe(true);
      expect(wrapper.find(EmptyDataset).exists()).toBe(false);
    });

    it('Should show table if loading and empty', () => {
      const sort = 'first_name';
      const sortDirection = 'asc';
      const classes = {};
      const breakdown = [{ id: 1 }];
      const onFilterChange = jest.fn();
      const memberLink = () => 'link';
      const isLoaded = false;
      const isLoading = true;

      const wrapper = shallow(
        <TeamMembersBreakdownComponent
          isLoading={isLoading}
          isLoaded={isLoaded}
          sort={sort}
          sortDirection={sortDirection}
          classes={classes}
          breakdown={breakdown}
          onFilterChange={onFilterChange}
          memberLink={memberLink}
        />,
      );

      expect(wrapper.find(TeamMembersBreakdownTable).exists()).toBe(true);
      expect(wrapper.find(EmptyDataset).exists()).toBe(false);
    });
  });
});
