import React, { memo } from 'react';
import { Skeleton, Box, Checkbox } from '@mui/material';
import { Tooltip } from '@alycecom/ui';

export interface ICheckboxWithContentProps {
  title: string;
  description?: string;
  value: unknown;
  isLoading: boolean;
  checked?: boolean;
  onChange: (value: unknown) => void;
  disabled?: boolean;
  disabledTooltip?: string;
}

const CheckboxWithContent = ({
  title,
  description = '',
  value,
  isLoading,
  checked = false,
  onChange,
  disabled = false,
  disabledTooltip = '',
  ...checkboxProps
}: ICheckboxWithContentProps) => (
  <Box width={1} display="flex">
    <Box pr={2}>
      {isLoading ? (
        <Skeleton variant="rectangular" width={24} height={24} animation="wave" />
      ) : (
        <>
          {disabled ? (
            <Tooltip title={disabledTooltip} placement="top-end">
              <Checkbox style={{ padding: 0 }} color="primary" checked={false} disabled {...checkboxProps} />
            </Tooltip>
          ) : (
            <Checkbox
              style={{ padding: 0 }}
              color="primary"
              checked={checked}
              onChange={() => onChange(value)}
              disabled={disabled}
              {...checkboxProps}
            />
          )}
        </>
      )}
    </Box>
    <Box width={1}>
      <Box className={disabled ? 'H4-Light' : 'H4-Chambray'} width={1} mb={0.5}>
        {isLoading ? <Skeleton variant="rectangular" width="50%" height={24} animation="wave" /> : title}
      </Box>
      <Box className="Body-Small-Inactive" width={1}>
        {isLoading ? (
          <>
            <Box mt={1} />
            <Skeleton variant="rectangular" width="100%" height={12} animation="wave" />
            <Box mt={0.5} />
            <Skeleton variant="rectangular" width="75%" height={12} animation="wave" />
          </>
        ) : (
          description
        )}
      </Box>
    </Box>
  </Box>
);

export default memo(CheckboxWithContent);
