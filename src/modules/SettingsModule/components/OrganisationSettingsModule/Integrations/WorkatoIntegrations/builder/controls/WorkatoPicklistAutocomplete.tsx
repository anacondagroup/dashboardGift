import React from 'react';
import { Box, TextField, Typography, Autocomplete as MuiAutocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Control, Path, useController } from 'react-hook-form';

import { useWorkatoPicklist } from '../../../../../../hooks/useWorkatoPicklist';
import { Picklists } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

const useStyles = makeStyles<AlyceTheme>(() => ({
  autocomplete: {
    width: '35%',
    marginLeft: '20px',
  },
  autocompleteInput: {
    height: 48,
  },
}));

interface IWorkatoAutocompleteProps<T> {
  description: string;
  name: Path<T>;
  control: Control<T>;
  placeholder: string;
  picklistName: Picklists;
  disabled: boolean;
  tooltip?: JSX.Element;
}

const WorkatoPicklistAutocomplete = <T,>({
  description,
  name,
  control,
  placeholder,
  disabled,
  picklistName,
  tooltip,
}: IWorkatoAutocompleteProps<T>): JSX.Element => {
  const classes = useStyles();
  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({ control, name });

  const picklist = useWorkatoPicklist(picklistName);

  const defineOptionLabel = (option: string): string =>
    !option ? '' : picklist.find(p => p.value === option)?.name ?? 'Loading ...';

  return (
    <Box mt={1}>
      <Typography>{description}</Typography>
      <Box mt={2} display="flex">
        <MuiAutocomplete<string, false>
          value={value as string}
          className={classes.autocomplete}
          options={picklist.map(p => p.value)}
          getOptionLabel={defineOptionLabel}
          disabled={disabled}
          onChange={(e, data) => {
            onChange(data);
          }}
          renderInput={params => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                className: classes.autocompleteInput,
              }}
              error={!!error}
              helperText={error && error.message}
              placeholder={placeholder}
              variant="outlined"
            />
          )}
        />
        {tooltip}
      </Box>
    </Box>
  );
};

export default WorkatoPicklistAutocomplete;
