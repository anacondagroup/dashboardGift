import React, { memo } from 'react';
import { Control, Controller, UseFormTrigger } from 'react-hook-form';
import { TextField, Skeleton } from '@mui/material';
import { TableCellProps } from 'react-virtualized';

import {
  GiftLimitMemberField,
  GiftLimitsStepField,
  TGiftLimitsForm,
  TProspectingCampaignMember,
} from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { transformNullableNumberValue } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.helpers';
import ErrorTooltip from '../../../../../../../components/Shared/ErrorTooltip/ErrorTooltip';

export interface ILimitFieldCellProps extends TableCellProps {
  rowData: TProspectingCampaignMember | undefined;
  columnData?: {
    control: Control<TGiftLimitsForm>;
    trigger: UseFormTrigger<TGiftLimitsForm>;
  };
}

const LimitFieldCell = ({ columnData, rowData }: ILimitFieldCellProps): JSX.Element =>
  rowData?.userId ? (
    <Controller
      control={columnData?.control}
      render={({ field, fieldState: { error } }) => (
        <ErrorTooltip title={error?.message ?? ''} open={!!error?.message} placement="bottom-start" arrow>
          <TextField
            type="number"
            fullWidth
            variant="outlined"
            {...field}
            onChange={event => {
              field.onChange(transformNullableNumberValue.input(event.target.value));
              if (event.target.value === '') {
                columnData?.trigger(
                  `${GiftLimitsStepField.GiftLimits}.${rowData.userId}.${GiftLimitMemberField.Period}` as const,
                );
              }
            }}
            value={transformNullableNumberValue.output(field.value)}
            error={!!error?.message}
          />
        </ErrorTooltip>
      )}
      name={`${GiftLimitsStepField.GiftLimits}.${rowData.userId}.${GiftLimitMemberField.Limit}` as const}
    />
  ) : (
    <Skeleton variant="rectangular" width="100%" height="100%" />
  );

export default memo(LimitFieldCell);
