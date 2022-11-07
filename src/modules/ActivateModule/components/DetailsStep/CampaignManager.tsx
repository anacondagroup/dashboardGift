import React, { useEffect } from 'react';
import { AlyceTheme, SelectFilter } from '@alycecom/ui';
import { Box, FormControlProps, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Controller, useFormContext } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
import { User } from '@alycecom/modules';
import { useSelector } from 'react-redux';

import { useTeamOwners } from '../../hooks/useTeamOwners';
import InfoTooltip from '../InfoTooltip';
import { DetailsFormFields } from '../../store/steps/details/detailsForm.schemas';
import { getDetailsData } from '../../store/steps/details';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  exclamationMark: {
    marginLeft: spacing(2),
    marginTop: 11,
  },
}));

type TCampaignManagerProps = Omit<FormControlProps, 'error'> & {
  error?: string;
};

const CampaignManager = ({ error = '', ...otherProps }: TCampaignManagerProps): JSX.Element => {
  const classes = useStyles();
  const { setValue, control, watch } = useFormContext();

  const data = useSelector(getDetailsData);
  const teamId = data?.teamId;
  const ownerId = data?.ownerId;
  const selectedTeamId = watch(DetailsFormFields.Team) || teamId;

  const {
    ids: teamOwnersIds,
    isLoading: isTeamOwnersLoading,
    isLoaded: isTeamOwnersLoaded,
    entities: teamOwnersMap,
  } = useTeamOwners(selectedTeamId);
  const getTeamOwnerLabel = (id: EntityId) => teamOwnersMap[id]?.name ?? '';

  const user = useSelector(User.selectors.getUser);

  useEffect(() => {
    const isReadyToUpdate = isTeamOwnersLoaded && selectedTeamId;
    const isTeamTheSame = teamId === selectedTeamId;
    if (isReadyToUpdate && user.id && !isTeamTheSame) {
      setValue(DetailsFormFields.TeamOwner, user.id, { shouldValidate: true });
      return;
    }
    if (isReadyToUpdate && ownerId && isTeamTheSame) {
      setValue(DetailsFormFields.TeamOwner, ownerId, { shouldValidate: true });
    }
  }, [setValue, isTeamOwnersLoaded, user, selectedTeamId, teamId, ownerId]);

  return (
    <Box display="flex">
      <Controller
        control={control}
        name={DetailsFormFields.TeamOwner}
        render={({ field: { value, onChange, onBlur } }) => (
          <SelectFilter
            name={DetailsFormFields.TeamOwner}
            label="Campaign Manager"
            value={value && isTeamOwnersLoaded ? value : ''}
            dataTestId="CreateActivateCampaignStepper.TeamOwnerSelect"
            selectProps={{
              onBlur,
            }}
            error={!!error}
            helperText={error}
            disabled={isTeamOwnersLoading || !selectedTeamId}
            onFilterChange={v => onChange(v[DetailsFormFields.TeamOwner])}
            classes={otherProps.classes}
            renderItems={() =>
              teamOwnersIds.map(id => (
                <MenuItem key={id} value={id}>
                  {getTeamOwnerLabel(id)}
                </MenuItem>
              ))
            }
          />
        )}
      />

      <Box className={classes.exclamationMark}>
        <InfoTooltip title="Campaign Managers will become the default sender for any team member who is removed from the campaign, and will also be Alyce’s point of contact for this campaign." />
      </Box>
    </Box>
  );
};

export default CampaignManager;
