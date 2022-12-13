import { TTransactionType } from '@alycecom/services';

export const getTransactionTypeNamesMap = (types: TTransactionType[]): Record<string, string> => {
  const childrenTypes = types.reduce((acc: TTransactionType[], item) => [...acc, ...(item?.children || [])], []);
  return childrenTypes.reduce<Record<string, string>>(
    (map, type) => ({
      ...map,
      [type.id]: type.name,
    }),
    {},
  );
};
