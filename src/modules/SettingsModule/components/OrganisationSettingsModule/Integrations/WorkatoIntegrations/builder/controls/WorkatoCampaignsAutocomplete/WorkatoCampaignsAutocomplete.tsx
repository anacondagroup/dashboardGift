import React, { useEffect, useState } from 'react';
import { Autocomplete as MuiAutocomplete, Box, TextField, Typography } from '@mui/material';
import { Control, Path, useController } from 'react-hook-form';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { useDispatch } from 'react-redux';

import {
  clearWorkatoActiveOneToManyCampaigns,
  loadWorkatoActiveOneToManyCampaigns,
} from '../../../../../../../store/organisation/integrations/workato/activeOneToManyCampaigns/activeOneToManyCampaigns.actions';

import { TWorkatoAutocompleteOption } from './types';
import { useWorkatoAutocompleteOptions } from './useWorkatoAutocompleteOptions';

const useStyles = makeStyles<AlyceTheme>(() => ({
  autocomplete: {
    width: '35%',
    marginLeft: '20px',
  },
  autocompleteInput: {
    height: 48,
  },
}));

interface IWorkatoCampaignsAutocompleteProps<T> {
  name: Path<T>;
  control: Control<T>;
  description: string;
  autocompleteIdentifier: string;
  placeholder: string;
  disabled: boolean;
  tooltip?: JSX.Element;
}

export const WorkatoCampaignsAutocomplete = <T,>({
  description,
  name,
  control,
  autocompleteIdentifier,
  placeholder,
  disabled,
  tooltip,
}: IWorkatoCampaignsAutocompleteProps<T>): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [search, setSearch] = useState('');

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({ control, name });

  const { options, isLoadingOptions, selectedValue, setSelectedValue } = useWorkatoAutocompleteOptions(
    value as string,
    autocompleteIdentifier,
  );

  useEffect(() => {
    dispatch(loadWorkatoActiveOneToManyCampaigns({ quantity: 100, search, autocompleteIdentifier }));
    // todo move cleanup function to common config page
    return () => {
      dispatch(clearWorkatoActiveOneToManyCampaigns({ autocompleteIdentifier }));
    };
  }, [autocompleteIdentifier, dispatch, search]);

  return (
    <Box mt={1}>
      <Typography>{description}</Typography>
      <Box mt={2} display="flex">
        <MuiAutocomplete<TWorkatoAutocompleteOption, false>
          value={selectedValue}
          inputValue={search}
          className={classes.autocomplete}
          loading={isLoadingOptions}
          loadingText="Loading..."
          options={options}
          getOptionLabel={option => option.name}
          disabled={disabled}
          onChange={(e, data) => {
            onChange(data?.id);
            setSelectedValue(data);
          }}
          onInputChange={(_, v) => setSearch(v)}
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
