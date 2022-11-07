import React from 'react';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';
import { TrackEvent } from '@alycecom/services';

import { TeamsBreakdownTableComponent } from '../TeamsBreakdownTable';
import { usePagination } from '../../../../../../hooks/usePagination';

jest.mock('@mui/material/Table', () => 'Table');
jest.mock('@mui/material/TableBody', () => 'TableBody');
jest.mock('@mui/material/TableCell', () => 'TableCell');
jest.mock('@mui/material/TableHead', () => 'TableHead');
jest.mock('@mui/material/TableRow', () => 'TableRow');
jest.mock('@mui/material/TableSortLabel', () => 'TableSortLabel');
jest.mock('@mui/material/TableFooter', () => 'TableFooter');
jest.mock('@mui/material/TablePagination', () => 'TablePagination');
jest.mock('react-router-dom', () => ({ Link: 'RouterLick' }));
jest.mock('../../../../../../hooks/usePagination');
jest.mock('@alycecom/modules', () => ({
  TableCellTooltip: 'TableCellTooltip',
  TrackEvent: {
    useTrackEvent: jest.fn(() => ({
      trackEvent: jest.fn(),
    })),
  },
}));
jest.mock('@alycecom/services', () => ({
  TableCellTooltip: 'TableCellTooltip',
  TrackEvent: {
    useTrackEvent: jest.fn(),
  },
}));
jest.mock('@alycecom/hooks', () => ({
  useRouting: jest.fn(),
  useReferrerUrl: jest.fn(),
}));

describe('TeamsBreakdownTable', () => {
  let props;
  beforeEach(() => {
    props = {
      isLoading: true,
      renderToolbar: () => <div data-toolbar="" />,
      onSort: () => {},
      dir: 'asc',
      sort: '',
      linkQueryParams: 'param=123',
      items: [],
      page: 0,
      onPageChange: jest.fn(),
    };
    TrackEvent.useTrackEvent.mockReset().mockImplementation(() => ({
      trackEvent: jest.fn(),
    }));
    usePagination.mockReset();
  });

  test('render while items are loading', () => {
    usePagination.mockReturnValue([[], false, 10, true]);

    const tree = create(shallow(<TeamsBreakdownTableComponent {...props} />));
    expect(usePagination).toBeCalledWith(0, 10, [], true);
    expect(tree).toMatchSnapshot();
  });

  test('render with teams', () => {
    const teams = Array.from({ length: 10 }, (_, id) => ({
      giftsSent: `giftsSent${id}`,
      giftsViewed: `giftsViewed${id}`,
      giftsAccepted: `giftsAccepted${id}`,
      meetingsBooked: `meetingsBooked${id}`,
      id,
    }));
    props.isLoading = false;
    usePagination.mockReturnValue([teams, true, 10, false]);

    const tree = create(shallow(<TeamsBreakdownTableComponent {...props} />));
    expect(usePagination).toBeCalledWith(0, 10, [], false);
    expect(tree).toMatchSnapshot();
  });
});
