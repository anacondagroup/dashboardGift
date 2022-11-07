import React, { useEffect } from 'react';
import { Control, useController } from 'react-hook-form';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Icon, Tooltip } from '@alycecom/ui';

import {
  GiftActionsDataFields,
  GiftingStepFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export interface IGiftCheckboxActionProps {
  control: Control<TSwagCampaignGiftingForm>;
  name: GiftActionsDataFields.Accept | GiftActionsDataFields.Exchange | GiftActionsDataFields.Donate;
  label: string;
  disabled?: boolean;
  checked?: boolean;
  lock?: boolean;
  disabledTooltip?: string;
}

const GiftCheckboxAction = ({
  name,
  control,
  label,
  disabled = false,
  lock = false,
  checked = undefined,
  disabledTooltip,
}: IGiftCheckboxActionProps): JSX.Element => {
  const {
    field: { value, onChange },
  } = useController({
    control,
    name: `${GiftingStepFields.GiftActionsData}.${name}` as const,
  });

  useEffect(() => {
    if (typeof checked === 'boolean') {
      onChange(checked);
    }
  }, [onChange, checked]);

  return (
    <FormControlLabel
      disabled={disabled}
      control={
        <Tooltip
          arrow
          placement="top-start"
          title={disabledTooltip ?? ''}
          open={disabledTooltip && disabled ? undefined : false}
        >
          <div>
            <Checkbox
              disabled={disabled}
              color="primary"
              icon={lock ? <Icon width={24} icon="lock" /> : undefined}
              checkedIcon={lock ? <Icon width={24} icon="lock" /> : undefined}
              onChange={(event, isChecked) => {
                onChange(isChecked);
              }}
              checked={value}
            />
          </div>
        </Tooltip>
      }
      label={label}
    />
  );
};

export default GiftCheckboxAction;
