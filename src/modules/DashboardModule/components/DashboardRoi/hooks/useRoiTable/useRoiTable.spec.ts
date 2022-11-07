import { act, renderHook } from '@testing-library/react-hooks';
import { SortDirection } from '@alycecom/utils';
import { CampaignPurposes } from '@alycecom/services';
import { useSelector } from 'react-redux';
import { RowLimit } from '@alycecom/ui';
import { TUseRoiTableDefaultState, TUseRoiTableOptions, useRoiTable } from './useRoiTable';

const mockedUseSelector = useSelector as jest.Mock;

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

type TRoiTableItem = {
  id: number;
  name: string;
};

describe('useRoiTable', () => {
  const defaultGlobalFilters = {
    period: 90,
  };
  const defaultFilters = {
    offset: 0,
    limit: 10,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    mockedUseSelector.mockReset().mockReturnValue({ ...defaultGlobalFilters });
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });
  });

  const setup = (initialState?: TUseRoiTableDefaultState, options?: TUseRoiTableOptions) =>
    renderHook(filters => useRoiTable<TRoiTableItem>(filters, options), { initialProps: initialState });

  const runAllFakeTimers = () => {
    act(() => {
      jest.runAllTimers();
    });
  };

  it('should return correct values', () => {
    const { result } = setup();
    const {
      filters,
      setFilters,
      handleOffsetChange,
      handleRowsPerPageChange,
      handleSortChange,
      handleTableFiltersChange,
    } = result.current;

    expect(filters).toStrictEqual({ ...defaultGlobalFilters, ...defaultFilters });
    expect(setFilters).toBeDefined();
    expect(handleOffsetChange).toBeDefined();
    expect(handleRowsPerPageChange).toBeDefined();
    expect(handleSortChange).toBeDefined();
    expect(handleTableFiltersChange).toBeDefined();
  });

  it('should return filters based on passed initial state', () => {
    const { result } = setup({ limit: RowLimit.Limit50, offset: 10 });

    expect(result.current.filters).toHaveProperty('limit', RowLimit.Limit50);
    expect(result.current.filters).toHaveProperty('offset', 10);
  });

  it('should allow to change debounce value', () => {
    const { result } = setup(defaultFilters, { debounce: 1000 });

    act(() => {
      result.current.handleTableFiltersChange({ search: 'test' });
    });
    expect(result.current.filters).not.toHaveProperty('search');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(result.current.filters).toHaveProperty('search');
  });

  it('should update filters if global filters have been changed', () => {
    const { result, rerender } = setup();

    expect(result.current.filters).toHaveProperty('period', 90);

    mockedUseSelector.mockReturnValue({ period: 180 });
    rerender();
    expect(result.current.filters).toHaveProperty('period', 90);

    runAllFakeTimers();

    expect(result.current.filters).toHaveProperty('period', 180);
  });

  it('should return debounced field and direction', () => {
    const { result } = setup();

    act(() => {
      result.current.handleSortChange({ field: 'name', direction: SortDirection.asc });
    });

    expect(result.current.filters).toHaveProperty('field', undefined);
    expect(result.current.filters).toHaveProperty('direction', undefined);
    runAllFakeTimers();
    expect(result.current.filters).toHaveProperty('field', 'name');
    expect(result.current.filters).toHaveProperty('direction', SortDirection.asc);
  });

  it('should return debounced table filters', () => {
    const { result } = setup();

    act(() => {
      result.current.handleTableFiltersChange({ search: 'test', campaignPurposes: [CampaignPurposes.Hr] });
    });

    expect(result.current.filters).toHaveProperty('search', undefined);
    expect(result.current.filters).toHaveProperty('campaignPurposes', undefined);
    runAllFakeTimers();
    expect(result.current.filters).toHaveProperty('search', 'test');
    expect(result.current.filters).toHaveProperty('campaignPurposes', [CampaignPurposes.Hr]);
  });

  describe('offset', () => {
    it('should return debounced offset', () => {
      const { result } = setup();

      act(() => {
        result.current.handleOffsetChange(40);
      });

      expect(result.current.filters).toHaveProperty('offset', 0);
      runAllFakeTimers();
      expect(result.current.filters).toHaveProperty('offset', 40);
    });

    it('should reset offset if global filters have been changed', () => {
      const { result, rerender } = setup();

      act(() => {
        result.current.handleOffsetChange(20);
      });

      mockedUseSelector.mockReturnValue({ period: 180 });
      rerender();
      runAllFakeTimers();

      expect(result.current.filters).toStrictEqual({
        ...defaultGlobalFilters,
        ...defaultFilters,
        period: 180,
      });
    });

    it('should reset offset if limit has been changed', () => {
      const { result } = setup();

      act(() => {
        result.current.handleOffsetChange(20);
        result.current.handleRowsPerPageChange(RowLimit.Limit100);
      });

      runAllFakeTimers();

      expect(result.current.filters).toStrictEqual({
        ...defaultGlobalFilters,
        ...defaultFilters,
        limit: RowLimit.Limit100,
      });
    });

    it('should reset offset if table sort has been changed', () => {
      const { result } = setup();

      act(() => {
        result.current.handleOffsetChange(20);
        result.current.handleSortChange({ field: 'name', direction: SortDirection.asc });
      });

      runAllFakeTimers();

      expect(result.current.filters).toStrictEqual({
        ...defaultGlobalFilters,
        ...defaultFilters,
        field: 'name',
        direction: SortDirection.asc,
      });
    });

    it('should reset offset if table filters have been changed', () => {
      const { result } = setup();

      act(() => {
        result.current.handleOffsetChange(20);
        result.current.handleTableFiltersChange({ search: 'test', campaignPurposes: [CampaignPurposes.Hr] });
      });

      runAllFakeTimers();

      expect(result.current.filters).toStrictEqual({
        ...defaultGlobalFilters,
        ...defaultFilters,
        field: undefined,
        direction: undefined,
        search: 'test',
        campaignPurposes: [CampaignPurposes.Hr],
      });
    });
  });

  describe('limit', () => {
    it('should return debounced limit', () => {
      const { result } = setup();

      act(() => {
        result.current.handleRowsPerPageChange(RowLimit.Limit100);
      });

      expect(result.current.filters).toHaveProperty('limit', RowLimit.Limit10);
      runAllFakeTimers();
      expect(result.current.filters).toHaveProperty('limit', RowLimit.Limit100);
    });

    it('should not reset limit if offset has been changed', () => {
      const { result } = setup();

      act(() => {
        result.current.handleRowsPerPageChange(RowLimit.Limit100);
        result.current.handleOffsetChange(20);
        result.current.handleSortChange({ field: 'name', direction: SortDirection.asc });
        result.current.handleTableFiltersChange({ search: 'test ' });
      });

      mockedUseSelector.mockReturnValue({ period: 180 });

      runAllFakeTimers();

      expect(result.current.filters).toHaveProperty('limit', RowLimit.Limit100);
    });
  });
});
