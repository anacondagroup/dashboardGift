import React, { useEffect } from 'react';
import { SelectFilter } from '@alycecom/ui';
import { Control, useController, useWatch } from 'react-hook-form';
import { EntityId } from '@alycecom/utils';
import { CampaignSettings } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import { Box, MenuItem } from '@mui/material';

import {
  SwagDetailsFormFields,
  TSwagDetails,
  TSwagDetailsFormValues,
} from '../../../store/swagCampaign/swagCampaign.types';
import { useSwag } from '../../../hooks';
import { getDetailsData } from '../../../store/swagCampaign/steps/details/details.selectors';

type TCampaignManagerProps = {
  data?: TSwagDetails;
  control: Control<TSwagDetailsFormValues>;
};

const CampaignManager = ({ data, control }: TCampaignManagerProps): JSX.Element => {
  const { campaignId } = useSwag();
  const { teamId: savedTeamId } = useSelector(getDetailsData) || {};
  const teamId = useWatch({ name: SwagDetailsFormFields.Team, control });
  const {
    useIds,
    useEntities,
    isPending: isTeamOwnersLoading,
    isFulfilled: isTeamOwnersLoaded,
  } = CampaignSettings.hooks.useTeamOwners(teamId);
  const teamOwnersIds = useIds();
  const teamOwnersMap = useEntities();

  const getTeamOwnerLabel = (id: EntityId) => teamOwnersMap[id]?.name ?? '';

  const {
    fieldState: { error },
    field: { value, onChange, onBlur },
  } = useController({
    control,
    name: SwagDetailsFormFields.OwnerId,
  });

  useEffect(() => {
    const isTeamOwnersControlReady = isTeamOwnersLoaded && teamOwnersIds[0];

    if (isTeamOwnersControlReady && !campaignId) {
      onChange(teamOwnersIds[0]);
      return;
    }
    if (campaignId && isTeamOwnersControlReady && savedTeamId !== teamId) {
      onChange(teamOwnersIds[0]);
    }
  }, [onChange, isTeamOwnersLoaded, teamOwnersIds, campaignId, teamId, savedTeamId, data]);

  return (
    <Box display="flex">
      <SelectFilter
        fullWidth
        name={SwagDetailsFormFields.OwnerId}
        label="Campaign Owner"
        value={value || ''}
        dataTestId="SwagDetailsForm.TeamOwnerSelect"
        selectProps={{
          onBlur,
        }}
        error={!!error}
        helperText={error?.message}
        disabled={isTeamOwnersLoading || !teamId}
        onFilterChange={v => onChange(v[SwagDetailsFormFields.OwnerId])}
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
