import React, { useEffect, useMemo } from 'react';
import { MenuItem, TextFieldProps } from '@mui/material';
import { SelectFilter } from '@alycecom/ui';
import { Control, Controller, Path, UseFormSetValue } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useTeams } from '../../hooks/useTeams';
import { DetailsFormFields, IDetailsFormValues } from '../../store/steps/details/detailsForm.schemas';
import { getActivateModuleParams } from '../../store/activate.selectors';
import { ActivateModes } from '../../routePaths';

type TAssignedTeamProps = Omit<TextFieldProps, 'error'> & {
  name: Path<IDetailsFormValues>;
  control: Control<IDetailsFormValues>;
  setValue: UseFormSetValue<IDetailsFormValues>;
  draftId: number | null;
  error?: string;
};

const AssignedTeam = ({
  name,
  draftId,
  control,
  error = '',
  setValue,
  ...otherProps
}: TAssignedTeamProps): JSX.Element => {
  const { mode } = useSelector(getActivateModuleParams);
  const { isLoading, isLoaded, entities: teamsMap } = useTeams();
  const teams = useMemo(
    () =>
      Object.keys(teamsMap)
        .map(teamKey => teamsMap[teamKey])
        .filter(team => team.archivedAt === null),
    [teamsMap],
  );

  useEffect(() => {
    if (isLoaded && teams[0] && !draftId) {
      // @ts-ignore
      setValue(name, teams[0].id);
    }
  }, [setValue, isLoaded, teams, draftId, name]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur } }) => (
        <SelectFilter
          name={name}
          value={value || ''}
          onFilterChange={v => {
            onChange(v[name]);
            setValue(DetailsFormFields.SendAsId, null);
          }}
          disabled={isLoading || mode === ActivateModes.Editor}
          label="Assigned Team"
          dataTestId="CreateActivateCampaignStepper.TeamSelect"
          selectProps={{
            onBlur,
          }}
          error={!!error}
          helperText={error}
          classes={otherProps.classes}
          renderItems={() =>
            teams.map(team => (
              <MenuItem key={team.id} value={team.id}>
                {team.name}
              </MenuItem>
            ))
          }
        />
      )}
    />
  );
};

export default AssignedTeam;
