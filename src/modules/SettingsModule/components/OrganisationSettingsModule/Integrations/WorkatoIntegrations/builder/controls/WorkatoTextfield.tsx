import React from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { Control, Path, useController } from 'react-hook-form';

interface IWorkatoTextField<T> {
  name: Path<T>;
  control: Control<T>;
  tooltip?: JSX.Element;
  disabled: boolean;
  description: string;
  placeholder: string;
}

const WorkatoTextField = <T,>({
  description,
  placeholder,
  tooltip,
  disabled,
  name,
  control,
}: IWorkatoTextField<T>): JSX.Element => {
  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({ control, name });

  return (
    <Box mt={1}>
      <Typography>{description}</Typography>
      <Box mt={2} display="flex">
        <TextField
          style={{ width: '35%', marginLeft: '20px' }}
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          error={!!error}
          helperText={error && error.message}
        />
        {tooltip}
      </Box>
    </Box>
  );
};

export default WorkatoTextField;
