export interface IRowDataItem {
  id: number;
}
export enum AlignColumnsValues {
  left = 'left',
  right = 'right',
}

export interface ICustomTableColumn<RowItem extends IRowDataItem> {
  name: string;
  field: string;
  isSortDisabled?: boolean;
  formatValue?: (value: unknown) => string;
  getValue?: (rowDataItem: RowItem) => string;
  align?: AlignColumnsValues;
  width?: string;
  maxWidth?: string;
  minWidth?: string;
}
