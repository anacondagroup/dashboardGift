import React, { ReactNode } from 'react';
import { SortDirection, TableHeaderProps } from 'react-virtualized';
import { Icon, IIconProps } from '@alycecom/ui';
import { Box } from '@mui/material';

export const AMOUNT_ICON_SET = {
  [SortDirection.ASC]: 'sort-amount-down-alt',
  [SortDirection.DESC]: 'sort-amount-down',
  none: 'sort-alt',
} as const;

export const NUMERIC_ICON_SET = {
  [SortDirection.ASC]: 'sort-numeric-down',
  [SortDirection.DESC]: 'sort-numeric-down-alt',
  none: 'sort-alt',
} as const;

export const ALPHA_ICON_SET = {
  [SortDirection.ASC]: 'sort-alpha-down',
  [SortDirection.DESC]: 'sort-alpha-down-alt',
  none: 'sort-alt',
} as const;

export interface IRowSortableHeaderProps extends TableHeaderProps {
  iconSet?: {
    [SortDirection.ASC]: IIconProps['icon'];
    [SortDirection.DESC]: IIconProps['icon'];
    none: IIconProps['icon'];
  };
  label?: ReactNode;
}

const RowSortableHeader = ({
  iconSet = AMOUNT_ICON_SET,
  sortDirection,
  sortBy,
  dataKey,
  label,
  disableSort,
}: IRowSortableHeaderProps): JSX.Element => {
  const isSorted = sortBy === dataKey && !!sortDirection;
  const sortIcon = iconSet[sortBy === dataKey ? sortDirection ?? 'none' : 'none'];
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      {label}
      {!disableSort && (
        <Box ml={1}>
          <Icon icon={sortIcon} color={isSorted ? 'grey.timberWolfDark' : 'grey.timberWolf'} />
        </Box>
      )}
    </Box>
  );
};

export default RowSortableHeader;
