import { SortDirection } from '@alycecom/utils';

export type TSorting<Column = string> = {
  column: Column;
  direction: SortDirection;
};
