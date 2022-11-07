import { CellMeasurer, CellMeasurerCache, GridCellRenderer } from 'react-virtualized';
import React, { memo, ReactNode } from 'react';
import { Box } from '@mui/material';

type TGridCellProps = Parameters<GridCellRenderer>[0];
interface IProductCellProps extends TGridCellProps {
  renderProduct: (index: number, measure: () => void) => ReactNode;
  columnsCount: number;
  cache: CellMeasurerCache;
}

const ProductCell = ({
  columnIndex,
  rowIndex,
  columnsCount,
  style,
  parent,
  renderProduct,
  cache,
}: IProductCellProps): JSX.Element => {
  const index = rowIndex * columnsCount + columnIndex;

  return (
    <CellMeasurer cache={cache} parent={parent} columnIndex={columnIndex} rowIndex={rowIndex}>
      {({ measure, registerChild }) => (
        <Box data-testid={`ProductGrid.Cell.${index}`} ref={registerChild} style={style}>
          {renderProduct(index, measure)}
        </Box>
      )}
    </CellMeasurer>
  );
};

export default memo(ProductCell);
