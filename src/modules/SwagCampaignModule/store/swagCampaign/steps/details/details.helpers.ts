import { TSwagDetails, SwagDetailsFormFields, TSwagDetailsFormValues } from '../../swagCampaign.types';

export const detailsFormValuesToData = (values: TSwagDetailsFormValues): TSwagDetails => ({
  ...values,
  [SwagDetailsFormFields.CampaignName]: values[SwagDetailsFormFields.CampaignName],
  [SwagDetailsFormFields.Team]: values[SwagDetailsFormFields.Team] as number,
  [SwagDetailsFormFields.OwnerId]: values[SwagDetailsFormFields.OwnerId] as number,
});
