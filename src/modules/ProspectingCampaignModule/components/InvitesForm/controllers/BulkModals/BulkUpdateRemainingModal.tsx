import React, { useEffect } from 'react';
import { Button } from '@alycecom/ui';
import { CircularProgress, Grid, TextField, Theme } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import ModalForm from '../../../ModalForm/ModalForm';
import {
  bulkUpdateRemainingFormDefaultValues,
  bulkUpdateRemainingFormResolver,
} from '../../../../store/prospectingCampaign/steps/giftLimits/schemas/bulkUpdateRemainingForm.schemas';
import {
  GiftLimitMemberField,
  TBulkUpdateRemainingForm,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { getIsGiftLimitsBulkPending } from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';

export interface IBulkUpdateRemainingModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (form: TBulkUpdateRemainingForm) => void;
}

const styles = {
  note: {
    color: ({ palette }: Theme) => palette.grey.main,
    fontSize: '0.875rem',
    lineHeight: '1.125rem',
  },
} as const;

const BulkUpdateRemainingModal = ({ onClose, open, onSave }: IBulkUpdateRemainingModalProps): JSX.Element => {
  const isPending = useSelector(getIsGiftLimitsBulkPending);

  const { control, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: bulkUpdateRemainingFormResolver,
    defaultValues: bulkUpdateRemainingFormDefaultValues,
  });

  useEffect(() => {
    if (!open) {
      reset(bulkUpdateRemainingFormDefaultValues);
    }
  }, [reset, open]);

  return (
    <ModalForm
      title="Bulk Edit Remaining Invites"
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
            name={GiftLimitMemberField.Remaining}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                autoFocus
                type="number"
                fullWidth
                variant="outlined"
                label="Total Remaining"
                error={!!error?.message}
                helperText={error?.message}
              />
            )}
          />
        </Grid>
        <Grid item xs={7} md={8} sx={styles.note}>
          Note: invites will reset to their normal limit with their next reset cycle.
        </Grid>
      </Grid>
    </ModalForm>
  );
};

export default BulkUpdateRemainingModal;
