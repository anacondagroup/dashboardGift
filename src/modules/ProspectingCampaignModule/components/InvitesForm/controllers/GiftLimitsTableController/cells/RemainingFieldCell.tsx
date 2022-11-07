import React, { useEffect, useState } from 'react';
import { TableCellProps } from 'react-virtualized';
import { useController, useForm } from 'react-hook-form';
import { Skeleton, TextField, outlinedInputClasses, Box, Theme } from '@mui/material';
import { Button } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import {
  GiftLimitMemberField,
  TProspectingCampaignMember,
  TUpdateRemainingGiftLimitsRequest,
} from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { transformNullableNumberValue } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.helpers';
import {
  bulkUpdateRemainingFormDefaultValues,
  bulkUpdateRemainingFormResolver,
} from '../../../../../store/prospectingCampaign/steps/giftLimits/schemas/bulkUpdateRemainingForm.schemas';
import ErrorTooltip from '../../../../../../../components/Shared/ErrorTooltip/ErrorTooltip';
import { getIsGiftLimitsBulkPending } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';

export interface IRemainingFieldCellProps extends TableCellProps {
  rowData: TProspectingCampaignMember | undefined;
  onSave: (form: TUpdateRemainingGiftLimitsRequest) => void;
}

const styles = {
  readOnly: {
    background: 'transparent',
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderColor: 'transparent !important',
    },
  },
  editButton: {
    p: 0.5,
  },
  cancelButton: {
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

const RemainingFieldCell = ({ rowData, onSave }: IRemainingFieldCellProps): JSX.Element => {
  const isPending = useSelector(getIsGiftLimitsBulkPending);
  const [isEdit, setIsEdit] = useState(false);

  const defaultValue = rowData?.remaining ?? null;
  const isEditAvailable = !!rowData?.limit && !!rowData?.period;

  const { control, handleSubmit, reset } = useForm({
    mode: 'onSubmit',
    resolver: bulkUpdateRemainingFormResolver,
    defaultValues: bulkUpdateRemainingFormDefaultValues,
  });
  const {
    field,
    fieldState: { error, isDirty },
  } = useController({
    control,
    name: GiftLimitMemberField.Remaining,
  });

  const onClickEdit = () => {
    setIsEdit(true);
  };

  const onClickSave = () => {
    if (rowData?.userId) {
      handleSubmit(data => {
        onSave({
          userIds: [rowData.userId],
          remaining: data.remaining as number,
        });
      })();
    }
  };

  const onClickCancel = () => {
    setIsEdit(false);
    field.onChange(rowData?.remaining ?? null);
  };

  useEffect(() => {
    reset({
      [GiftLimitMemberField.Remaining]: defaultValue,
    });
    setIsEdit(false);
  }, [defaultValue, reset]);

  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box maxWidth={90}>
        {rowData?.userId ? (
          <ErrorTooltip title={error?.message ?? ''} open={!!error?.message} placement="bottom-start" arrow>
            <TextField
              type="number"
              fullWidth
              variant="outlined"
              {...field}
              onChange={event => field.onChange(transformNullableNumberValue.input(event.target.value))}
              value={transformNullableNumberValue.output(field.value)}
              error={!!error?.message}
              InputProps={{ readOnly: !isEdit }}
              sx={[!isEdit && styles.readOnly]}
            />
          </ErrorTooltip>
        ) : (
          <Box display="flex" alignItems="center" pl={1.75}>
            <Skeleton variant="text" width={30} height="100%" />
          </Box>
        )}
      </Box>
      <Box display="flex">
        {!isEdit && isEditAvailable && (
          <Button variant="text" disabled={!rowData?.userId} onClick={onClickEdit}>
            Edit Remaining Invites
          </Button>
        )}
        {isEdit && (
          <Box ml={2.5}>
            <Button sx={styles.editButton} disabled={!isDirty || isPending} variant="text" onClick={onClickSave}>
              Save Change
            </Button>
            <Button sx={[styles.editButton, styles.cancelButton]} variant="text" onClick={onClickCancel}>
              Cancel
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default RemainingFieldCell;
