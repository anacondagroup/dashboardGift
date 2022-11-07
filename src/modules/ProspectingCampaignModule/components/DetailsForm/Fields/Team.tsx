import React from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
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
  const { useIds, useEntities, isPending } = CampaignSettings.hooks.useTeams();
  const teamIds = useIds();
  const teamsMap = useEntities();
  const getTeamLabel = (id: EntityId) => teamsMap[id]?.name ?? '';

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
        <Box color="primary.main">{teamsMap[value]?.name}</Box>
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
