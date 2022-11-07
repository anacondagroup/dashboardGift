import React, { ReactNode } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Checkbox, FormControlLabel, Theme, Typography } from '@mui/material';

import {
  GiftingStepFields,
  RecipientActionsDataFields,
  RecipientActionsFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export interface ICaptureActionProps {
  control: Control<TSwagCampaignGiftingForm>;
  label: string;
  name: RecipientActionsFields.CapturePhone | RecipientActionsFields.CaptureEmail | RecipientActionsFields.CaptureDate;
  description?: ReactNode;
}

const styles = {
  description: {
    color: ({ palette }: Theme) => palette.grey.main,
    marginLeft: ({ spacing }: Theme) => spacing(3.5),
    maxWidth: 615,
  },
} as const;

const CaptureAction = ({ control, label, name, description }: ICaptureActionProps): JSX.Element => (
  <>
    <Controller
      control={control}
      name={`${GiftingStepFields.RecipientActionsData}.${RecipientActionsDataFields.RecipientActions}.${name}` as const}
      render={({ field: { value, onChange } }) => (
        <FormControlLabel
          checked={value}
          onChange={(_, checked) => onChange(checked)}
          control={<Checkbox color="primary" />}
          label={label}
        />
      )}
    />
    {description && (
      <Typography variant="body2" sx={styles.description}>
        {description}
      </Typography>
    )}
  </>
);

export default CaptureAction;
