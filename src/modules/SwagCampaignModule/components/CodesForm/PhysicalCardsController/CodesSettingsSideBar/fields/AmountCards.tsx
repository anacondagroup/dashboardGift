import React from 'react';
import { Control, useController } from 'react-hook-form';
import { Box, MenuItem } from '@mui/material';
import { HtmlTip, SelectFilter } from '@alycecom/ui';

import { physicalCodesAmount } from '../../../../../store/swagCampaign/steps/codes/codes.constants';
import {
  TPhysicalCardsFormValues,
  CodesSettingsDataFields,
  CodesSettingsLabels,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';

export interface IAmountCardsProps {
  control: Control<TPhysicalCardsFormValues>;
}

const AmountCards = ({ control }: IAmountCardsProps): JSX.Element => {
  const name = CodesSettingsDataFields.CodesAmount;

  const {
    field: { onBlur, onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <>
      <Box mb={1}>How many cards should be printed?</Box>
      <SelectFilter
        label={CodesSettingsLabels.AmountCards}
        name={name}
        value={value}
        error={!!error?.message}
        fullWidth
        required
        onFilterChange={currentValue => {
          onChange(currentValue[CodesSettingsDataFields.CodesAmount]);
        }}
        selectProps={{
          onBlur,
        }}
        data-testid="SwagBuilder.CodesStep.PhysicalCodes.TotalCodes"
      >
        {physicalCodesAmount.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </SelectFilter>
      <Box mt={2}>
        <HtmlTip>
          <>Please note: A minimum of {physicalCodesAmount[0]} cards is required for printing.</>
        </HtmlTip>
      </Box>
    </>
  );
};

export default AmountCards;
