import React, { memo } from 'react';
import { TableCellProps } from 'react-virtualized';
import { Control, Controller } from 'react-hook-form';
import { FormControl, MenuItem, Select, Skeleton } from '@mui/material';

import {
  GiftLimitMemberField,
  GiftLimitsStepField,
  TGiftLimitsForm,
  TProspectingCampaignMember,
} from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';
import { PERIOD_TO_LABEL } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.constants';
import ErrorTooltip from '../../../../../../../components/Shared/ErrorTooltip/ErrorTooltip';

export interface IPeriodFieldCellProps extends TableCellProps {
  rowData: TProspectingCampaignMember | undefined;
  columnData?: {
    control: Control<TGiftLimitsForm>;
  };
}

const PeriodFieldCell = ({ columnData, rowData }: IPeriodFieldCellProps): JSX.Element =>
  rowData?.userId ? (
    <Controller
      name={`${GiftLimitsStepField.GiftLimits}.${rowData.userId}.${GiftLimitMemberField.Period}` as const}
      control={columnData?.control}
      render={({ field, fieldState: { error } }) => (
        <FormControl fullWidth error={!!error?.message}>
          <ErrorTooltip title={error?.message ?? ''} open={!!error?.message} placement="bottom-start" arrow>
            <Select
              fullWidth
              variant="outlined"
              value={field.value || ''}
              onChange={event => field.onChange(event.target.value ?? null)}
            >
              {Object.entries(PERIOD_TO_LABEL).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </ErrorTooltip>
        </FormControl>
      )}
    />
  ) : (
    <Skeleton variant="rectangular" width="100%" height="100%" />
  );

export default memo(PeriodFieldCell);
