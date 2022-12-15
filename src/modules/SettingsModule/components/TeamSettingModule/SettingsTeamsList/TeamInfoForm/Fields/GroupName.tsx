import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

import { TeamField, TTeamFormParams } from '../../../../../store/teams/team/team.types';

export type TGroupNameProps = TextFieldProps & {
  control: Control<TTeamFormParams>;
};

const styles = {
  field: {
    mt: 4,
    width: 350,
  },
} as const;

const GroupName = ({ control }: TGroupNameProps): JSX.Element => {
  const name = TeamField.GroupName;

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
  });

  return (
    <TextField
      sx={styles.field}
      {...field}
      fullWidth
      label="Group Name *"
      variant="outlined"
      margin="normal"
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{
        autoComplete: 'off',
        'data-testid': 'TeamInfoForm.GroupName',
      }}
    />
  );
};

export default GroupName;
