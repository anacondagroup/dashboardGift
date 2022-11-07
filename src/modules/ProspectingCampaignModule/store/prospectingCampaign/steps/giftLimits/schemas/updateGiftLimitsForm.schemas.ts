import { lazy, number, NumberSchema, object, string, StringSchema } from 'yup';
import { mapObjIndexed } from 'ramda';
import { yupResolver } from '@hookform/resolvers/yup';

import { GiftLimitMemberField, GiftLimitPeriod, GiftLimitsStepField, TGiftLimitsForm } from '../giftLimits.types';

const userIdSchema = number();
const limitSchema = number()
  .label('Gift invites')
  .nullable()
  .min(0)
  .default(null)
  .transform(value => (Number.isNaN(value) ? null : value))
  .when(GiftLimitMemberField.Period, (value: GiftLimitPeriod | null, schema: NumberSchema<number | null>) =>
    value ? schema.required() : schema,
  );
const periodSchema = string()
  .label('Reset rate')
  .oneOf([...Object.values(GiftLimitPeriod), null])
  .nullable()
  .default(null)
  .transform(value => value || null)
  .when(GiftLimitMemberField.Limit, (value: number | null, schema: StringSchema<string | null>) =>
    value ? schema.required() : schema,
  );
const giftLimitsSchema = lazy(giftLimits =>
  object(
    mapObjIndexed(
      () =>
        object()
          .shape(
            {
              [GiftLimitMemberField.UserId]: userIdSchema,
              [GiftLimitMemberField.Period]: periodSchema,
              [GiftLimitMemberField.Limit]: limitSchema,
            },
            [[GiftLimitMemberField.Period, GiftLimitMemberField.Limit]],
          )
          .default({}),
      giftLimits,
    ),
  )
    .nullable()
    .default(null)
    .required(),
);
export const giftLimitsForm = object().shape({
  [GiftLimitsStepField.GiftLimits]: giftLimitsSchema,
});
export const giftLimitsFormResolver = yupResolver(giftLimitsForm);
export const giftLimitsFormDefaultValues: TGiftLimitsForm = {
  [GiftLimitsStepField.GiftLimits]: {},
};
