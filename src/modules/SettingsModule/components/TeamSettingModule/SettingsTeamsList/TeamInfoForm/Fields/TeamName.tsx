import React from 'react';
import { Control, useController } from 'react-hook-form';
import { TextField, TextFieldProps } from '@mui/material';

import { TeamField, TTeamFormParams } from '../../../../../store/teams/team/team.types';

export type TTeamNameProps = TextFieldProps & {
  control: Control<TTeamFormParams>;
};

const styles = {
  field: {
    width: 350,
  },
} as const;

const TeamName = ({ control }: TTeamNameProps): JSX.Element => {
  const name = TeamField.Name;

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
      label="Team Name *"
      variant="outlined"
      margin="normal"
      error={!!error?.message}
      helperText={error?.message}
      inputProps={{
        autoComplete: 'off',
        'data-testid': 'TeamInfoForm.Name',
      }}
    />
  );
};

export default TeamName;
