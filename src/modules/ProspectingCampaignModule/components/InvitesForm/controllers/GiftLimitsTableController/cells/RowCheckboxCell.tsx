import React, { memo } from 'react';
import { TableCellProps } from 'react-virtualized';
import { Checkbox } from '@mui/material';

import { TProspectingCampaignMember } from '../../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';

const styles = {
  checkbox: {
    padding: 0,
  },
} as const;

export interface IRowCheckboxCellProps extends TableCellProps {
  rowData: TProspectingCampaignMember | undefined;
  checked: boolean;
  onChange: (rowData: TProspectingCampaignMember, checked: boolean) => void;
}

const RowCheckboxCell = ({ rowData, checked, onChange }: IRowCheckboxCellProps): JSX.Element => (
  <Checkbox
    color="primary"
    onChange={(event, isChecked) => onChange(rowData as TProspectingCampaignMember, isChecked)}
    checked={checked}
    sx={styles.checkbox}
    disabled={!rowData?.userId}
    indeterminate={!rowData?.userId}
  />
);

export default memo(RowCheckboxCell);
