import { AnySchema, array, ArraySchema, object } from 'yup';

import { ProductVendorsTypes, TProductVendor } from './productVendors.types';

export const vendorsSchema = array().default([]).strip(false);

export const merchantsWhenVendorsSchema = array()
  .default([])
  .when('vendors', (vendors: TProductVendor[] = [], schema: ArraySchema<AnySchema>) =>
    schema.transform(() =>
      vendors.reduce((ids: number[], vendor) => {
        if (vendor.type === ProductVendorsTypes.Merchant) {
          ids.push(vendor.id);
        }

        return ids;
      }, []),
    ),
  )
  .strip(false);

export const brandsWhenVendorsSchema = array()
  .default([])
  .when('vendors', (vendors: TProductVendor[] = [], schema: ArraySchema<AnySchema>) =>
    schema.transform(() =>
      vendors.reduce((ids: number[], vendor) => {
        if (vendor.type === ProductVendorsTypes.Brand) {
          ids.push(vendor.id);
        }

        return ids;
      }, []),
    ),
  )
  .strip(false);

export const productVendorsSchema = object().shape({
  vendors: vendorsSchema,
  brands: brandsWhenVendorsSchema,
  merchants: merchantsWhenVendorsSchema,
});
