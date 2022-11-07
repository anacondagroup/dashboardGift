import { TableCellProps, Theme } from '@mui/material';

export type TRoiColumn<RowItem> = {
  label: string;
  field: keyof RowItem;
  isSortable?: boolean;
  align?: TableCellProps['align'];
  tooltipText?: string;
  getFormattedValue?: (rowItem: RowItem, column: TRoiColumn<RowItem>) => string | number | null;
  styles?: Record<string, string | number | ((theme: Theme) => string | number)>;
};
