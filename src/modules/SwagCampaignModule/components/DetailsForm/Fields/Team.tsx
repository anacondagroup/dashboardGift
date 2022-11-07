import React, { useEffect } from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
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
  const { useIds, useEntities, isPending, isFulfilled } = CampaignSettings.hooks.useTeams();
  const teamIds = useIds();
  const teamsMap = useEntities();
  const getTeamLabel = (id: EntityId) => teamsMap[id]?.name ?? '';

  const {
    fieldState: { error },
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name: SwagDetailsFormFields.Team,
  });

  useEffect(() => {
    if (isFulfilled && teamIds[0] && !campaignId) {
      onChange(teamIds[0]);
    }
  }, [onChange, isFulfilled, teamIds, campaignId]);

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
        teamIds.map(id => (
          <MenuItem key={id} value={id}>
            {getTeamLabel(id)}
          </MenuItem>
        ))
      }
    />
  );
};

export default Team;
