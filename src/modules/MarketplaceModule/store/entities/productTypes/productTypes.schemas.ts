import { array, object } from 'yup';
import { EntityId } from '@alycecom/utils';

export const typesSchema = array()
  .default([])
  .transform((items: EntityId[]) => items.map(item => Number(item)))
  .ensure();

export const productTypesSchema = object().shape({
  types: typesSchema,
});
