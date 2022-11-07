import { TProspectingDetails } from '../../prospectingCampaign.types';

import { DetailsFormFields, TDetailsFormValues } from './details.schemas';

export const detailsFormValuesToData = (values: TDetailsFormValues): TProspectingDetails => ({
  ...values,
  [DetailsFormFields.Team]: values[DetailsFormFields.Team] as number,
  [DetailsFormFields.OwnerId]: values[DetailsFormFields.OwnerId] as number,
});
