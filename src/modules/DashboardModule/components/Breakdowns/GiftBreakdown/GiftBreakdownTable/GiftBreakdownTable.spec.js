import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ThemeProvider, StyledEngineProvider } from '@mui/material';
import { useUrlQuery, useSetUrlQuery } from '@alycecom/hooks';

import { theme } from '../../../../../../styles/alyce-theme';

import GiftBreakdownTable from './GiftBreakdownTable';

const breakdownMock = [
  {
    id: 1,
    acceptedGift: 'Product 1',
    batchName: 'Batch 1',
    giftStatus: 'accepted',
    recipient: {
      id: 2,
      email: 'test1@test.com',
      fullName: 'Full Name 1',
    },
  },
  {
    id: 2,
    acceptedGift: 'Product 2',
    batchName: 'Batch 2',
    giftStatus: 'declined',
    recipient: {
      id: 3,
      email: 'test2@test.com',
      fullName: 'Full Name 2',
    },
  },
];
const columns = [
  {
    name: 'Column 1',
    field: 'acceptedGift',
  },
  {
    name: 'Column 2',
    field: 'batchName',
  },
  {
    name: 'Column 3',
    field: 'giftStatus',
    isSortDisabled: true,
  },
  {
    name: 'Column 4',
    field: 'recipient.fullName',
  },
];

jest.mock('react-redux', () => ({
  connect: jest.fn(() => jest.fn()),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('@alycecom/hooks', () => ({
  useUrlQuery: jest.fn(),
  useSetUrlQuery: jest.fn(),
}));

describe('GiftBreakdownTable', () => {
  let updateUrlFuncMock;

  const setup = (props, mockedUrlParams = {}) => {
    const pagination = {
      current_page: 1,
      per_page: 10,
      total: 4,
      total_pages: 1,
    };

    updateUrlFuncMock = jest.fn();
    useUrlQuery.mockReturnValue(mockedUrlParams);
    useSetUrlQuery.mockImplementation(() => updateUrlFuncMock);

    return render(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <GiftBreakdownTable
            placeholder="Placeholder"
            isLoading={false}
            breakdown={breakdownMock}
            columns={columns}
            pagination={pagination}
            {...props}
          />
        </ThemeProvider>
      </StyledEngineProvider>,
    );
  };

  beforeEach(() => {
    useUrlQuery.mockReset();
  });

  it('Should render empty table if breakdown array is empty', () => {
    const { queryAllByTestId } = setup({ breakdown: [] });
    expect(queryAllByTestId('Breakdown.Row').length).toBe(0);
  });

  it('Should render empty table if breakdown array is empty', () => {
    const { getByTestId } = setup();
    expect(getByTestId('Breakdown.Row-empty')).toBeInTheDocument();
  });

  it('Should execute updateUrlFunc while typing in search field', () => {
    const placeholder = 'Search gifts';
    const { getByPlaceholderText } = setup({ placeholder });
    const searchField = getByPlaceholderText(placeholder);
    const typedString = 'a';

    fireEvent.change(searchField, { target: { value: typedString } });

    expect(updateUrlFuncMock).toHaveBeenCalledWith({ giftSearch: typedString, giftPage: 1 });
  });

  it('Should render 10 rows in loading state if isLoading prop equals true', () => {
    const props = { breakdown: [], isLoading: true };
    const { getAllByTestId } = setup(props);
    expect(getAllByTestId('Breakdown.Row').length).toBe(10);
  });

  describe('props:placeholder', () => {
    it('Should pass placeholder to search field', () => {
      const placeholder = 'Field placeholder';
      const { getByPlaceholderText } = setup({ placeholder });
      const searchField = getByPlaceholderText(placeholder);
      expect(searchField).toBeInTheDocument();
    });

    it('Should set default placeholder if placeholder prop is not specified', () => {
      const placeholder = 'Search gifts';
      const { getByPlaceholderText } = setup({ placeholder });
      const searchField = getByPlaceholderText(placeholder);
      expect(searchField).toBeInTheDocument();
    });
  });

  describe('props:renderToolbar', () => {
    it('Should render default search field if toolbar is not defined', () => {
      const { getByPlaceholderText } = setup();
      const searchField = getByPlaceholderText('Placeholder');
      expect(searchField).toBeInTheDocument();
    });

    it('Should render passed toolbar if it is provided', () => {
      const CustomToolbar = () => 'Custom Toolbar';
      const props = { renderToolbar: () => <CustomToolbar /> };
      const { getByText } = setup(props);
      const toolbar = getByText('Custom Toolbar');

      expect(toolbar).toBeInTheDocument();
    });
  });

  describe('props:columns', () => {
    it('Should render passed columns', () => {
      const { getByText } = setup();
      columns.forEach(({ name }) => getByText(name));
    });

    it('Should execute updateUrlFunc by clicking on column name', () => {
      const { getByText } = setup();
      const firstColumn = getByText(columns[0].name);

      useUrlQuery.mockReturnValue({ giftDirection: 'desc', giftSort: columns[0].field });
      fireEvent.click(firstColumn);

      expect(updateUrlFuncMock).toHaveBeenCalledWith({
        giftSort: columns[0].field,
        giftDirection: 'desc',
        giftPage: 1,
      });
    });

    it('Should change sort direction to opposite if the same column is selected', () => {
      const mockedUrlParams = { giftDirection: 'desc', giftSort: columns[0].field };
      const { getByText } = setup(undefined, mockedUrlParams);
      const firstColumn = getByText(columns[0].name);

      fireEvent.click(firstColumn);

      expect(updateUrlFuncMock).toHaveBeenCalledWith({
        giftSort: columns[0].field,
        giftDirection: 'asc',
        giftPage: 1,
      });
    });

    it('Should not execute updateUrlFunc if sorting of clicked column is disabled', () => {
      const { getByText } = setup();
      const disabledSortingColumn = getByText(columns[2].name);

      fireEvent.click(disabledSortingColumn);
      expect(updateUrlFuncMock).not.toHaveBeenCalled();
    });
  });

  describe('props:renderRow', () => {
    it('Should render default row component', () => {
      const { getAllByTestId } = setup();
      expect(getAllByTestId('Breakdown.Row').length).toBe(breakdownMock.length);
    });

    it('Should render rows by using passed renderRow function', () => {
      const CustomRow = () => <div>Custom Row</div>;
      const { getAllByText } = setup({ renderRow: () => <CustomRow /> });
      expect(getAllByText('Custom Row').length).toBe(breakdownMock.length);
    });
  });

  describe('props:pagination', () => {
    it('Should display pagination only if item number bigger than number item on a page', () => {
      const pagination = {
        current_page: 1,
        per_page: 2,
        total: 4,
        total_pages: 2,
      };
      const { getByTestId } = setup({ pagination });
      expect(getByTestId('Breakdown.Pagination')).toBeInTheDocument();
    });

    it('Should not display pagination widget if item number is low than number item on a page', () => {
      const { queryByTestId } = setup();
      expect(queryByTestId('Breakdown.Pagination')).not.toBeInTheDocument();
    });
  });
});
