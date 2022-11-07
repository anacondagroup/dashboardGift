import * as R from 'ramda';

import { calculatePagination } from '../usePagination';

describe('calculatePagination', () => {
  it('Should hide pagination if items not enough', () => {
    const [itemsToShow, showPagination, emptyRows, showEmptyRows] = calculatePagination(0, 10, R.range(0, 9), false);

    expect(itemsToShow.length).toBe(9);
    expect(showPagination).toBe(false);
    expect(emptyRows).toBe(1);
    expect(showEmptyRows).toBe(false);
  });

  it('Should show pagination if items enough', () => {
    const [itemsToShow, showPagination, emptyRows, showEmptyRows] = calculatePagination(0, 10, R.range(0, 20), false);

    expect(itemsToShow.length).toBe(10);
    expect(showPagination).toBe(true);
    expect(emptyRows).toBe(0);
    expect(showEmptyRows).toBe(false);
  });

  it('Should show empty rows on last page', () => {
    const [itemsToShow, showPagination, emptyRows, showEmptyRows] = calculatePagination(1, 10, R.range(0, 15), false);

    expect(itemsToShow.length).toBe(5);
    expect(showPagination).toBe(true);
    expect(emptyRows).toBe(5);
    expect(showEmptyRows).toBe(true);
  });
});
