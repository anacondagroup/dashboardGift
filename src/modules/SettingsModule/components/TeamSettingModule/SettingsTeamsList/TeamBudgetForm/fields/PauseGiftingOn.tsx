import React, { memo } from 'react';
import { Box, FormControl, FormHelperText, MenuItem, Select, Theme } from '@mui/material';
import { Control, Controller } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { BudgetCreateField, PauseGiftingOnOption, TBudgetCreateParams } from '@alycecom/services';

const styles = {
  select: {
    '& .MuiSelect-select.Mui-disabled': {
      backgroundColor: ({ palette }: Theme) => palette.common.white,
      WebkitTextFillColor: ({ palette }: Theme) => palette.grey.main,
    },
  },
  emphasized: {
    display: 'inline',
    fontWeight: 'bold',
  },
} as const;

interface IPauseGiftingOnSelectorProps {
  control: Control<TBudgetCreateParams>;
  error?: string;
}

const getRenderValue = (pauseOption: PauseGiftingOnOption): JSX.Element => (
  <Box flex={1}>
    Total cost of <Box sx={styles.emphasized}>{pauseOption} gifts</Box> meets gift budget
  </Box>
);

const PauseGiftingOnSelector = ({ control, error }: IPauseGiftingOnSelectorProps): JSX.Element => (
  <Controller
    name={BudgetCreateField.PauseOption}
    control={control}
    render={({ field: { onChange } }) => (
      <FormControl fullWidth variant="outlined" error={!!error}>
        <Select
          labelId="PauseGiftingOn.Select.Label"
          id="PauseGiftingOn.Select.Label"
          value={PauseGiftingOnOption.Claimed}
          renderValue={getRenderValue}
          disabled
          onChange={onChange}
          data-testid="PauseGiftingOn.Select"
          IconComponent={ExpandMoreIcon}
          sx={styles.select}
        >
          {Object.values(PauseGiftingOnOption).map(pauseOption => (
            <MenuItem key={pauseOption} data-testid={`PauseGiftingOnOption.${pauseOption}`} value={pauseOption}>
              Total cost of {pauseOption} gifts meet gift budget
            </MenuItem>
          ))}
        </Select>
        {!!error && <FormHelperText>{error}</FormHelperText>}
      </FormControl>
    )}
  />
);
export default memo(PauseGiftingOnSelector);
