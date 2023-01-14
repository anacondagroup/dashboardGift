import React from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';
import { CampaignSettings } from '@alycecom/modules';
import { Box, MenuItem, TextFieldProps } from '@mui/material';

import {
  TDetailsFormValues,
  DetailsFormFields,
} from '../../../store/prospectingCampaign/steps/details/details.schemas';
import { useProspecting } from '../../../hooks';
import { SFormLabel } from '../../styled/Styled';

export interface IAssignedTeamProps extends Omit<TextFieldProps, 'error'> {
  control: Control<TDetailsFormValues>;
  draft?: boolean;
  onTeamChange: () => void;
}

const Team = ({ control, onTeamChange, ...otherProps }: IAssignedTeamProps): JSX.Element => {
  const { isEditor } = useProspecting();
  const { useEntities, isPending } = CampaignSettings.hooks.useTeams();
  const teamsMap = useEntities();
  const teams = Object.keys(teamsMap)
    .map(teamKey => teamsMap[teamKey])
    .filter(team => team?.archivedAt === null);

  const {
    fieldState: { error },
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name: DetailsFormFields.Team,
  });

  if (isEditor) {
    return (
      <>
        <SFormLabel sx={{ pb: 1 }}>Team</SFormLabel>
        <Box color="primary.main">{teams.find(team => team.id === value)?.name}</Box>
      </>
    );
  }

  return (
    <SelectFilter
      fullWidth
      name={DetailsFormFields.Team}
      value={value || ''}
      onFilterChange={v => {
        onChange(v[DetailsFormFields.Team]);
        onTeamChange();
      }}
      disabled={isPending}
      label="Team"
      dataTestId="ProspectingDetailsForm.Team"
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
