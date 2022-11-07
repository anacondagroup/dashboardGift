import { IRowDataItem } from './CustomTable.types';

export const generateFakeItems = (defaultCount: number): IRowDataItem[] =>
  Array.from({ length: defaultCount }, (_, index) => ({ id: index }));

export const fakeItemsFactory = <Item>(
  items: Item[],
  isLoading: boolean,
  defaultCount: number,
): IRowDataItem[] | Item[] => (isLoading ? generateFakeItems(defaultCount) : items);
