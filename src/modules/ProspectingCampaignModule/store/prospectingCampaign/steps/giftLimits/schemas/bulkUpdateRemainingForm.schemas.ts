import { number, object } from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { GiftLimitMemberField, TBulkUpdateRemainingForm } from '../giftLimits.types';

const remainingSchema = number()
  .label('Remaining invites')
  .nullable()
  .min(0)
  .default(null)
  .transform(value => (Number.isNaN(value) ? null : value))
  .required();

export const bulkUpdateRemainingFormSchema = object().shape({
  [GiftLimitMemberField.Remaining]: remainingSchema,
});
export const bulkUpdateRemainingFormResolver = yupResolver(bulkUpdateRemainingFormSchema);
export const bulkUpdateRemainingFormDefaultValues = bulkUpdateRemainingFormSchema.getDefault() as TBulkUpdateRemainingForm;
