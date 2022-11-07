import { yupResolver } from '@hookform/resolvers/yup';
import { number, object, string } from 'yup';

import { TBulkUpdateGiftLimitsForm } from '../giftLimits.types';
import { PERIOD_TO_LABEL } from '../giftLimits.constants';

const bulkLimitFieldSchema = number()
  .label('Total Invites')
  .min(0)
  .max(999)
  .nullable()
  .default(null)
  .transform(value => (Number.isNaN(value) ? null : value))
  .required();
const bulkResetRateFieldSchema = string()
  .label('Reset Rate')
  .oneOf([null, ...Object.keys(PERIOD_TO_LABEL)])
  .nullable()
  .default(null)
  .required();
export const bulkEditGiftLimitsFormSchema = object().shape({
  limit: bulkLimitFieldSchema,
  period: bulkResetRateFieldSchema,
});
export const bulkEditGiftLimitsFormResolver = yupResolver(bulkEditGiftLimitsFormSchema);
export const bulkEditGiftLimitsFormDefaultValues = bulkEditGiftLimitsFormSchema.getDefault() as TBulkUpdateGiftLimitsForm;
