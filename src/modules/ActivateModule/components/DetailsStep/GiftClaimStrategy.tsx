import React, { ChangeEvent } from 'react';
import { Control, useController } from 'react-hook-form';
import {
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Collapse,
  TextField,
  FormControl,
  radioClasses,
  formControlLabelClasses,
  Box,
} from '@mui/material';

import { DetailsFormFields, IDetailsFormValues } from '../../store/steps/details/detailsForm.schemas';
import { ClaimType } from '../../store';

export interface IGiftClaimStrategyProps {
  control: Control<IDetailsFormValues>;
}

const styles = {
  root: {
    background: 'transparent',
    mt: 6,
  },
  formLabel: {
    color: 'text.primary',
    fontWeight: 700,
  },
  radioGroup: {
    [`& .${radioClasses.root}`]: {
      alignItems: 'start',
      py: 0,
      alignSelf: 'flex-start',
    },
    [`& .${formControlLabelClasses.root}`]: {
      py: 1,
    },
  },
  radioTextField: {
    mt: 2,
    ml: 4,
  },
} as const;

const GiftClaimStrategy = ({ control }: IGiftClaimStrategyProps): JSX.Element => {
  const { field: claimTypeField } = useController({
    control,
    name: DetailsFormFields.ClaimType,
  });

  const {
    field: freeClaimsField,
    fieldState: { error: freeClaimsError },
  } = useController({
    control,
    name: DetailsFormFields.FreeClaims,
  });

  const isFreeClaimsFieldVisible = claimTypeField.value === ClaimType.FreeClaim;

  const handleChangeClaimType = (_: unknown, value: string) => {
    claimTypeField.onChange(value as ClaimType);
    if (value === ClaimType.PreApproved) {
      freeClaimsField.onChange(null);
    }
  };

  const handleChangeFreeClaims = (event: ChangeEvent<HTMLInputElement>) => {
    freeClaimsField.onChange(event.currentTarget.value === '' ? null : event.currentTarget.value);
  };

  return (
    <FormControl sx={styles.root}>
      <FormLabel sx={styles.formLabel} id="OneToMany.DetailsStep.GiftClaimStrategy">
        How do you want to manage recipients for this campaign?
      </FormLabel>
      <RadioGroup
        sx={styles.radioGroup}
        aria-labelledby="OneToMany.DetailsStep.GiftClaimStrategy"
        onChange={handleChangeClaimType}
        value={claimTypeField.value}
      >
        <FormControlLabel
          value={ClaimType.PreApproved}
          control={<Radio />}
          label={
            <>
              Only allow <b>pre-approved recipients</b> to claim gifts
              <Box fontSize="14px" color="grey.main">
                Only recipients you specify are able to claim gifts. You will be able to add recipients manually or
                through integrations.
              </Box>
            </>
          }
        />
        <FormControlLabel
          value={ClaimType.FreeClaim}
          control={<Radio />}
          label={
            <>
              Allow <b>unknown recipients</b> to claim gifts
              <Box fontSize="14px" color="grey.main">
                Anyone will be able to claim a gift on this campaign. You will be required to set a limit for claims on
                this gift link.
              </Box>
            </>
          }
        />
        <Collapse in={isFreeClaimsFieldVisible} unmountOnExit mountOnEnter>
          <TextField
            sx={styles.radioTextField}
            variant="outlined"
            value={freeClaimsField.value || ''}
            onChange={handleChangeFreeClaims}
            error={!!freeClaimsError?.message}
            helperText={freeClaimsError?.message}
            placeholder="max 100"
            label="Total Claims"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Collapse>
      </RadioGroup>
    </FormControl>
  );
};

export default GiftClaimStrategy;
