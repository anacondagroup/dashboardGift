import React, { HTMLAttributes, memo, ReactNode } from 'react';
import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
  AutocompleteGetTagProps,
  AutocompleteRenderOptionState,
} from '@mui/material';
import { useGetUserTeamsExcludeArchivedQuery, usersTeamsAdapter } from '@alycecom/services';
import { makeStyles } from '@mui/styles';
import { Controller } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
import { useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';

import { CustomMarketplaceField } from '../../../store/customMarketplace/customMarketplace.types';

import { IFieldProps } from './Field';

const useStyles = makeStyles<AlyceTheme>(() => ({
  option: {
    maxHeight: 36,
  },
}));

const MarketplaceTeam = ({ error, control }: IFieldProps<never, false>): JSX.Element => {
  const classes = useStyles();
  const { selectEntities, selectIds } = useGetUserTeamsExcludeArchivedQuery(undefined, {
    selectFromResult: result => ({
      ...result,
      ...usersTeamsAdapter.getSelectors(() => result?.data ?? usersTeamsAdapter.getInitialState()),
    }),
  });
  const teamsMap = useSelector(selectEntities);
  const teamIds = useSelector(selectIds);

  const getOptionLabel = (teamId: EntityId) => teamsMap[teamId]?.name ?? '';

  const renderValue = (selected: EntityId[], getTagProps: AutocompleteGetTagProps): ReactNode =>
    selected.map((id, index) => <Chip {...getTagProps({ index })} label={getOptionLabel(id)} />);

  const renderOption = (
    props: HTMLAttributes<HTMLLIElement>,
    teamId: EntityId,
    { selected }: AutocompleteRenderOptionState,
  ) => (
    <li {...props}>
      <Checkbox color="primary" checked={selected} />
      {getOptionLabel(teamId)}
    </li>
  );

  return (
    <FormControl error={!!error} variant="outlined" fullWidth>
      <Controller
        control={control}
        name={CustomMarketplaceField.TeamIds}
        render={({ field: { onChange, value } }) => (
          <Autocomplete<EntityId, true>
            multiple
            disableCloseOnSelect
            value={value}
            size="small"
            onChange={(_, selected) => onChange(selected)}
            renderInput={props => <TextField {...props} variant="outlined" label="Select Team" />}
            options={teamIds}
            getOptionLabel={getOptionLabel}
            renderTags={renderValue}
            renderOption={(props, option, state) => renderOption(props, option, state)}
            classes={{
              option: classes.option,
            }}
          />
        )}
      />
      {!!error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default memo(MarketplaceTeam);
