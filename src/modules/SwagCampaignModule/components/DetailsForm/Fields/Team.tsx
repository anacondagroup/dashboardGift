import React, { useEffect, useMemo } from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';
import { MenuItem, TextFieldProps } from '@mui/material';

import { useSwag } from '../../../hooks';
import { SwagDetailsFormFields, TSwagDetailsFormValues } from '../../../store/swagCampaign/swagCampaign.types';

export interface IAssignedTeamProps extends Omit<TextFieldProps, 'error'> {
  control: Control<TSwagDetailsFormValues>;
  draft?: boolean;
}

const Team = ({ control, ...otherProps }: IAssignedTeamProps): JSX.Element => {
  const { campaignId } = useSwag();
  const { useEntities, isPending, isFulfilled } = CampaignSettings.hooks.useTeams();
  const teamsMap = useEntities();
  const teams = useMemo(
    () =>
      Object.keys(teamsMap)
        .map(teamKey => teamsMap[teamKey])
        .filter(team => team?.archivedAt === null),
    [teamsMap],
  );

  const {
    fieldState: { error },
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name: SwagDetailsFormFields.Team,
  });

  useEffect(() => {
    if (isFulfilled && teams[0].id && !campaignId) {
      onChange(teams[0].id);
    }
  }, [onChange, isFulfilled, teams, campaignId]);

  return (
    <SelectFilter
      fullWidth
      name={SwagDetailsFormFields.Team}
      value={value || ''}
      onFilterChange={v => {
        onChange(v[SwagDetailsFormFields.Team]);
      }}
      disabled={isPending}
      label="Team"
      dataTestId="SwagDetailsForm.Team"
      selectProps={{
        onBlur,
      }}
      error={!!error?.message}
      helperText={error?.message}
      classes={otherProps.classes}
      renderItems={() =>
        teams.map(team => (
          <MenuItem key={team.id} value={team.id}>
            {team.name}
          </MenuItem>
        ))
      }
    />
  );
};

export default Team;
