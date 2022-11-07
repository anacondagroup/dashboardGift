import React, { useEffect } from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController, useWatch } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
import { CampaignSettings, User } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import { Box, MenuItem } from '@mui/material';

import {
  DetailsFormFields,
  TDetailsFormValues,
} from '../../../store/prospectingCampaign/steps/details/details.schemas';
import { useProspecting } from '../../../hooks';
import { getDetailsData } from '../../../store/prospectingCampaign/steps/details/details.selectors';

type TCampaignManagerProps = {
  control: Control<TDetailsFormValues>;
};

const CampaignManager = ({ control }: TCampaignManagerProps): JSX.Element => {
  const { campaignId } = useProspecting();
  const { teamId: savedTeamId } = useSelector(getDetailsData) || {};
  const teamId = useWatch({ name: DetailsFormFields.Team, control });
  const {
    useIds,
    useEntities,
    isPending: isTeamOwnersLoading,
    isFulfilled: isTeamOwnersLoaded,
  } = CampaignSettings.hooks.useTeamOwners(teamId);
  const teamOwnersIds = useIds();
  const teamOwnersMap = useEntities();
  const user = useSelector(User.selectors.getUser);

  const getTeamOwnerLabel = (id: EntityId) => teamOwnersMap[id]?.name ?? '';

  const {
    fieldState: { error },
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name: DetailsFormFields.OwnerId,
  });

  useEffect(() => {
    const isTeamOwnersControlReady = isTeamOwnersLoaded && user.id;

    if (isTeamOwnersControlReady && !campaignId) {
      onChange(user.id);
      return;
    }
    if (campaignId && isTeamOwnersControlReady && savedTeamId !== teamId) {
      onChange(user.id);
    }
  }, [onChange, isTeamOwnersLoaded, user, campaignId, teamId, savedTeamId]);

  return (
    <Box display="flex">
      <SelectFilter
        fullWidth
        name={DetailsFormFields.OwnerId}
        label="Campaign Owner"
        value={value || ''}
        dataTestId="ProspectingDetailsForm.TeamOwnerSelect"
        selectProps={{
          onBlur,
        }}
        error={!!error}
        helperText={error?.message}
        disabled={isTeamOwnersLoading || !teamId}
        onFilterChange={v => onChange(v[DetailsFormFields.OwnerId])}
        renderItems={() =>
          teamOwnersIds.map(id => (
            <MenuItem key={id} value={id}>
              {getTeamOwnerLabel(id)}
            </MenuItem>
          ))
        }
      />
    </Box>
  );
};

export default CampaignManager;
