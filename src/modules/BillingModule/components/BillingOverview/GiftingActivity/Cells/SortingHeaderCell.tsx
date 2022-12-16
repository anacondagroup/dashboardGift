import React, { memo, ReactNode } from 'react';
import { TableCellProps, TableSortLabel } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { SortDirection } from '@alycecom/utils';

import { StyledHeaderCell } from '../../../styled/Styled';
import { getSorting } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { setSorting } from '../../../../store/ui/overviewFilters/overviewFilters.reducer';

export interface ISortingHeaderCellProps extends TableCellProps {
  name: string;
  children: ReactNode;
}

const SortingHeaderCell = ({ name, children, ...cellProps }: ISortingHeaderCellProps): JSX.Element => {
  const dispatch = useDispatch();

  const sorting = useSelector(getSorting);

  const handleSetSorting = () => {
    dispatch(
      setSorting({
        column: name,
        direction: sorting?.direction === SortDirection.asc ? SortDirection.desc : SortDirection.asc,
      }),
    );
  };

  return (
    <StyledHeaderCell {...cellProps}>
      <TableSortLabel direction={sorting?.direction} active={sorting?.column === name} onClick={handleSetSorting}>
        {children}
      </TableSortLabel>
    </StyledHeaderCell>
  );
};

export default memo(SortingHeaderCell);
