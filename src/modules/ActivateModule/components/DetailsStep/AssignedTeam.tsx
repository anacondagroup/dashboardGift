import React, { useEffect } from 'react';
import { MenuItem, TextFieldProps } from '@mui/material';
import { SelectFilter } from '@alycecom/ui';
import { Control, Controller, Path, UseFormSetValue } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
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
  const { ids: teamIds, isLoading, isLoaded, entities: teamsMap } = useTeams();
  const getTeamLabel = (id: EntityId) => teamsMap[id]?.name ?? '';

  useEffect(() => {
    if (isLoaded && teamIds[0] && !draftId) {
      // @ts-ignore
      setValue(name, teamIds[0]);
    }
  }, [setValue, isLoaded, teamIds, draftId, name]);

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
            teamIds.map(id => (
              <MenuItem key={id} value={id}>
                {getTeamLabel(id)}
              </MenuItem>
            ))
          }
        />
      )}
    />
  );
};

export default AssignedTeam;
