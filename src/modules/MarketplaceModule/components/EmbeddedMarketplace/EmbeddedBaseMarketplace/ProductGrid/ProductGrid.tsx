import React, { ReactNode, useCallback, useMemo } from 'react';
import { AutoSizer, CellMeasurerCache, Grid, InfiniteLoader } from 'react-virtualized';

import ProductCell from './ProductCell';

export interface IProductGridProps {
  loading?: boolean;
  productsLength: number;
  hasMore: boolean;
  onLoadMore: () => void;
  renderProduct: (index: number, measure: () => void) => ReactNode;
  renderEmpty?: () => ReactNode;
  scrollToRow?: number;
  columnsCount?: number;
  scrollTop?: number;
  autoHeight?: boolean;
  height?: number;
  registerGridWrapper?: (element?: React.ReactNode) => void;
}

const ProductGrid = ({
  loading = false,
  productsLength,
  hasMore,
  onLoadMore,
  renderEmpty = () => null,
  columnsCount = 3,
  renderProduct,
  autoHeight,
  height,
  scrollTop,
  scrollToRow,
  registerGridWrapper = () => {},
}: IProductGridProps): JSX.Element => {
  const measurerCache = useMemo(
    () =>
      new CellMeasurerCache({
        defaultHeight: 320,
        minHeight: 180,
        fixedWidth: true,
        keyMapper: (rowIndex, columnIndex) => `${rowIndex}.${columnIndex}`,
      }),
    [],
  );
  const realRowCount = Math.ceil(productsLength / columnsCount);
  const pendingRowCount = Math.ceil(20 / columnsCount);
  const rowCount = hasMore || loading ? realRowCount + pendingRowCount : realRowCount;

  const handleLoadMore = useCallback(() => {
    onLoadMore();
    return Promise.resolve();
  }, [onLoadMore]);

  return (
    <InfiniteLoader
      loadMoreRows={handleLoadMore}
      isRowLoaded={({ index }) => !hasMore || (index + 1) * columnsCount <= productsLength}
      minimumBatchSize={5}
      threshold={2}
      rowCount={rowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer disableHeight={!!height} style={{ width: '100%', height: '100%' }}>
          {({ width, height: autoSizerHeight }) => (
            <div ref={el => registerGridWrapper(el)}>
              <Grid
                ref={registerChild}
                cellRenderer={props => {
                  if (props.rowIndex * columnsCount + props.columnIndex > productsLength - 1 && !hasMore) {
                    return <></>;
                  }
                  return (
                    <ProductCell
                      {...props}
                      renderProduct={renderProduct}
                      columnsCount={columnsCount}
                      cache={measurerCache}
                    />
                  );
                }}
                rowCount={rowCount}
                rowHeight={measurerCache.rowHeight}
                width={width}
                height={height || autoSizerHeight}
                autoHeight={autoHeight}
                columnCount={columnsCount}
                columnWidth={width / columnsCount}
                noContentRenderer={renderEmpty}
                deferredMeasurementCache={measurerCache}
                onSectionRendered={({ rowStartIndex, rowStopIndex }) =>
                  onRowsRendered({ startIndex: rowStartIndex, stopIndex: rowStopIndex })
                }
                scrollTop={scrollTop}
                scrollToRow={scrollToRow}
              />
            </div>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
};

export default ProductGrid;
