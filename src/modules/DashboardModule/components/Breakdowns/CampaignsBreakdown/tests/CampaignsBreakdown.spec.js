import React from 'react';
import { shallow } from 'enzyme';

import { CampaignsBreakdownComponent } from '../CampaignsBreakdown';
import CampaignsBreakdownTable from '../CampaignsBreakdownTable';
import EmptyDataset from '../../../../../../components/Shared/EmptyDataset';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => jest.fn()),
  useDispatch: jest.fn(),
  connect: jest.fn(() => jest.fn()),
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  // eslint-disable-next-line global-require
  makeStyles: require('../../../../../../libs/mocks').mockMakeStyles,
  withStyles: jest.fn(() => c => c),
}));

describe('CampaignsBreakdown', () => {
  describe('handleSort', () => {
    it('Should change render empty dataset if loaded and empty', () => {
      const sort = 'name';
      const sortDirection = 'asc';
      const classes = {};
      const breakdown = [];
      const onFilterChange = jest.fn();
      const campaignLink = jest.fn();
      const isLoaded = true;

      const wrapper = shallow(
        <CampaignsBreakdownComponent
          isLoaded={isLoaded}
          sort={sort}
          sortDirection={sortDirection}
          classes={classes}
          campaignLink={campaignLink}
          breakdown={breakdown}
          onFilterChange={onFilterChange}
        />,
      );

      expect(wrapper.find(CampaignsBreakdownTable).exists()).toBe(false);
      expect(wrapper.find(EmptyDataset).exists()).toBe(true);
    });

    it('Should show table if loaded and not empty', () => {
      const sort = 'date';
      const sortDirection = 'desc';
      const classes = {};
      const breakdown = [{}];
      const onFilterChange = jest.fn();
      const campaignLink = jest.fn();
      const isLoaded = true;

      const wrapper = shallow(
        <CampaignsBreakdownComponent
          isLoaded={isLoaded}
          sort={sort}
          sortDirection={sortDirection}
          classes={classes}
          breakdown={breakdown}
          campaignLink={campaignLink}
          onFilterChange={onFilterChange}
        />,
      );

      expect(wrapper.find(CampaignsBreakdownTable).exists()).toBe(true);
      expect(wrapper.find(EmptyDataset).exists()).toBe(false);
    });
  });
});
