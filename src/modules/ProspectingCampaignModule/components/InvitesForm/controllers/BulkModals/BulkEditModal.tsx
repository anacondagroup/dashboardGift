import React, { useEffect } from 'react';
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
} from '@mui/material';
import { Button } from '@alycecom/ui';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { TBulkUpdateGiftLimitsForm } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { PERIOD_TO_LABEL } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.constants';
import { getIsGiftLimitsBulkPending } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';
import ModalForm from '../../../ModalForm/ModalForm';
import {
  bulkEditGiftLimitsFormDefaultValues,
  bulkEditGiftLimitsFormResolver,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.schemas';

export interface IBulkEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (arg0: TBulkUpdateGiftLimitsForm) => void;
}

const BulkEditModal = ({ open, onClose, onSave }: IBulkEditModalProps): JSX.Element => {
  const isPending = useSelector(getIsGiftLimitsBulkPending);
  const { control, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: bulkEditGiftLimitsFormResolver,
    defaultValues: bulkEditGiftLimitsFormDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      reset(bulkEditGiftLimitsFormDefaultValues);
    }
  }, [reset, open]);

  return (
    <ModalForm
      title="Bulk Edit Total Invites / Reset Rate"
      actions={
        <>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="submit"
            endIcon={isPending ? <CircularProgress size={19} color="inherit" /> : undefined}
          >
            Save Changes
          </Button>
        </>
      }
      onClose={onClose}
      open={open}
      onSubmit={handleSubmit(onSave)}
    >
      <Grid container spacing={2}>
        <Grid item xs={5} md={4}>
          <Controller
            control={control}
            name="limit"
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                type="number"
                fullWidth
                variant="outlined"
                label="Total Invites"
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item md={1}>
          <Box lineHeight="48px">that</Box>
        </Grid>
        <Grid item xs={6} md={5}>
          <Controller
            control={control}
            name="period"
            render={({ field, fieldState: { error } }) => (
              <FormControl variant="outlined" fullWidth error={!!error?.message}>
                <InputLabel id="ProspectingCampaign.InvitesStep.BulkEditModal.ResetRateSelect">Reset Rate</InputLabel>
                <Select
                  labelId="ProspectingCampaign.InvitesStep.BulkEditModal.ResetRateSelect"
                  label="Reset Rate"
                  value={field.value}
                  onChange={field.onChange}
                >
                  {Object.entries(PERIOD_TO_LABEL).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {!!error?.message && <FormHelperText>{error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        </Grid>
      </Grid>
    </ModalForm>
  );
};

export default BulkEditModal;
