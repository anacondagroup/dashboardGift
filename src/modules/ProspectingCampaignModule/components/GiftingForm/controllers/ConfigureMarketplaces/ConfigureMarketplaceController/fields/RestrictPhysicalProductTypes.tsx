import React, { useEffect, useMemo, memo } from 'react';
import { useSelector } from 'react-redux';
import { FormControl, FormGroup, FormControlLabel, Checkbox, Grid, Box, Skeleton } from '@mui/material';
import { Icon, Divider, Tooltip } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';
import { without } from 'ramda';
import { CommonData, CampaignSettings } from '@alycecom/modules';

import { useTeamProductTypes } from '../../../../../../../MarketplaceModule/hooks/useTeamProductTypes';
import { getDetailsData } from '../../../../../../store/prospectingCampaign/steps/details/details.selectors';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TProspectingGiftingForm,
} from '../../../../../../store/prospectingCampaign/steps/gifting/gifting.types';

export interface IRestrictPhysicalProductTypesProps {
  control: Control<TProspectingGiftingForm>;
}

const RestrictPhysicalProductTypes = ({ control }: IRestrictPhysicalProductTypesProps): JSX.Element => {
  const name = `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.RestrictedTypeIds}` as const;

  const { teamId, countryIds = [] } = useSelector(getDetailsData) || {};
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesMapByIds(countryIds || []), [countryIds]),
  );

  const { usePhysicalProductTypes, useRestrictedIds, useNotAvailableByCountryIds, isFulfilled } = useTeamProductTypes({
    teamId,
    fetch: false,
  });
  const types = usePhysicalProductTypes();
  const restrictedIds = useRestrictedIds();
  const notAvailableProductTypeIds = useNotAvailableByCountryIds(countryIds);

  const {
    field: { onChange: setIsPhysicalEnabledValue },
  } = useController({
    control,
    name: `${GiftingStepFields.MarketplaceData}.${MarketplaceDataFields.IsPhysicalEnabled}` as const,
  });
  const {
    fieldState: { error },
    field: { onChange, value, onBlur },
  } = useController({
    control,
    name,
  });
  const isPhysicalEnabled = useMemo(() => types.some(type => !value?.includes(type.id)), [types, value]);

  const mustBeRestrictedIds = useMemo(() => notAvailableProductTypeIds.filter(typeId => !value?.includes(typeId)), [
    notAvailableProductTypeIds,
    value,
  ]);

  useEffect(() => {
    if (mustBeRestrictedIds.length) {
      onChange([...(value ?? []), ...mustBeRestrictedIds]);
    }
  }, [mustBeRestrictedIds, onChange, value]);

  useEffect(() => {
    setIsPhysicalEnabledValue(isPhysicalEnabled);
  }, [setIsPhysicalEnabledValue, isPhysicalEnabled]);

  return (
    <FormControl error={!!error?.message} fullWidth>
      <CampaignSettings.StyledFormLabel>Gift Types</CampaignSettings.StyledFormLabel>
      <Box mt={4} fontWeight="bold">
        <Grid container flexDirection="row" justifyContent="space-between" alignItems="center">
          <Grid>Name</Grid>
          <Grid xs={3}>Country</Grid>
        </Grid>
      </Box>
      <Divider mt={1.5} mb={2} />
      <FormGroup>
        {!isFulfilled &&
          Array.from({ length: 4 }, (_, idx) => (
            <FormControlLabel
              key={idx}
              disabled
              control={<Checkbox checked={false} color="primary" />}
              label={<Skeleton variant="text" width={150} />}
            />
          ))}
        {types.map(type => {
          const availableCountryCodes =
            type.countryIds?.map(countryId => countries[countryId]?.code).filter(Boolean) ?? [];
          const isRestricted = restrictedIds.includes(type.id);
          const isAvailable = !!availableCountryCodes?.length;
          const isDisabled = isRestricted || !isAvailable;

          const handleChange = (event: unknown, isChecked: boolean) => {
            if (isChecked) {
              onChange(without([type.id], value));
            } else {
              onChange([...value, type.id]);
            }
            onBlur();
          };

          return (
            <Grid key={type.id} container flexDirection="row" justifyContent="space-between" alignItems="center">
              <Grid item>
                <FormControlLabel
                  disabled={isDisabled}
                  control={
                    <Tooltip
                      arrow
                      placement="top-start"
                      open={isDisabled ? undefined : false}
                      title={
                        isRestricted
                          ? 'This type restricted on your team-level settings'
                          : 'The gift type is not available for your selected countries yet. Check back soon.'
                      }
                    >
                      <div>
                        <Checkbox
                          onChange={handleChange}
                          disabled={isDisabled}
                          checked={!isRestricted && !value?.includes(type.id)}
                          icon={isRestricted ? <Icon width={24} icon="lock" /> : undefined}
                          color="primary"
                        />
                      </div>
                    </Tooltip>
                  }
                  label={type.label}
                />
              </Grid>
              <Grid item xs={3}>
                <Box fontSize="0.875rem">{availableCountryCodes.join(', ')}</Box>
              </Grid>
            </Grid>
          );
        })}
      </FormGroup>
    </FormControl>
  );
};

export default memo(RestrictPhysicalProductTypes);
