import React from 'react';
import { shallow } from 'enzyme';
import { TableRow, TableBody } from '@mui/material';
import { TrackEvent } from '@alycecom/services';
import { Features } from '@alycecom/modules';

import { CampaignsBreakdownTableComponent } from '../CampaignsBreakdownTable';

jest.mock('@alycecom/modules', () => ({
  TableCellTooltip: 'TableCellTooltip',
  Features: {
    selectors: {
      hasFeatureFlag: jest.fn(),
    },
    FLAGS: {},
  },
}));
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(jest.fn),
  useSelector: jest.fn(fn => fn()),
}));
jest.mock('@alycecom/services', () => ({
  TrackEvent: {
    useTrackEvent: jest.fn(),
  },
}));
jest.mock('@alycecom/hooks', () => ({
  useRouting: jest.fn(),
  useReferrerUrl: jest.fn(),
}));

describe('CampaignsBreakdownTable', () => {
  beforeEach(() => {
    TrackEvent.useTrackEvent.mockReset().mockImplementation(() => ({
      trackEvent: jest.fn(),
    }));
    Features.selectors.hasFeatureFlag.mockReset().mockReturnValue(jest.fn(false));
  });

  it('Should render fake items if no items provided and loading is true', () => {
    const isLoading = true;
    const classes = {};
    const sort = '';
    const page = 0;
    const sortDirection = '';
    const items = [];
    const onSort = jest.fn();
    const renderToolbar = jest.fn();
    const onPageChange = jest.fn();
    const campaignLink = id => `campaigns/${id}`;

    const wrapper = shallow(
      <CampaignsBreakdownTableComponent
        isLoading={isLoading}
        classes={classes}
        sort={sort}
        sortDirection={sortDirection}
        onPageChange={onPageChange}
        items={items}
        page={page}
        onSort={onSort}
        renderToolbar={renderToolbar}
        campaignLink={campaignLink}
      />,
    );

    const bodyRows = wrapper.find(TableBody).first().find(TableRow);

    expect(bodyRows.length).toBe(10);
  });
});
