import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, TextField } from '@mui/material';
import { Icon, Tooltip } from '@alycecom/ui';

import {
  DetailsFormFields,
  TDetailsFormValues,
} from '../../../store/prospectingCampaign/steps/details/details.schemas';
import { SFormLabel } from '../../styled/Styled';

export interface ICampaignInstructionsProps {
  control: Control<TDetailsFormValues>;
}

const CampaignInstructions = ({ control }: ICampaignInstructionsProps): JSX.Element => {
  const {
    field: { value, onChange, onBlur },
    fieldState: { error },
  } = useController({
    control,
    name: DetailsFormFields.CampaignInstruction,
  });

  return (
    <>
      <Box display="flex" alignItems="center ">
        <SFormLabel>Campaign Instructions</SFormLabel>
        &nbsp;
        <Tooltip
          placement="top-start"
          arrow
          title="These instructions will be visible to team members when they are selecting a campaign for sending their gift(s)."
        >
          <Box display="inline-block" height={20}>
            <Icon icon="info-circle" color="grey" />
          </Box>
        </Tooltip>
      </Box>
      <Box mt={1}>
        <TextField
          error={!!error?.message}
          helperText={error?.message}
          multiline
          fullWidth
          variant="outlined"
          rows={4}
          value={value ?? ''}
          onChange={event => onChange(event.target.value.trimLeft())}
          onBlur={onBlur}
        />
      </Box>
    </>
  );
};

export default CampaignInstructions;
