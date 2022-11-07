import React, { useCallback, useEffect, useMemo } from 'react';
import { EntityId } from '@alycecom/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceTheme, Tooltip } from '@alycecom/ui';
import { Link } from 'react-router-dom';
import { Box, TextField, Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  getCustomMarketplacesMap,
  getIsLoading,
  makeGetMarketplacesIdsByTeamId,
} from '../../../store/entities/customMarketplaces/customMarketplaces.selectors';
import { fetchCustomMarketplaces } from '../../../store/entities/customMarketplaces/customMarketplaces.actions';
import { MARKETPLACE_ROUTES } from '../../../routePaths';

const useStyles = makeStyles<AlyceTheme>(() => ({
  option: {
    maxHeight: 36,
  },
}));

export interface ICustomMarketplaceSelectProps {
  value: EntityId | null | undefined;
  teamId: number;
  onChange: (value: number | null) => void;
  disableEmptyMarketplaces?: boolean;
  disableClearable?: boolean;
  permittedCountryIds?: number[];
}

const getIsOptionAllowedByCountries = ({
  marketplaceCountryIds,
  permittedCountryIds,
}: {
  marketplaceCountryIds: number[];
  permittedCountryIds: number[];
}): boolean => permittedCountryIds.some(permittedCountryId => marketplaceCountryIds.includes(permittedCountryId));

const CustomMarketplaceSelect = ({
  value: marketplaceId,
  teamId,
  onChange,
  disableEmptyMarketplaces = false,
  disableClearable = true,
  permittedCountryIds = [],
}: ICustomMarketplaceSelectProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const marketplaceIds = useSelector(useMemo(() => makeGetMarketplacesIdsByTeamId(teamId), [teamId]));
  const marketplacesMap = useSelector(getCustomMarketplacesMap);
  const isLoading = useSelector(getIsLoading);

  const getOptionLabel = (option: EntityId) => marketplacesMap[option]?.name || '';

  const handleChangeMarketplaceId = useCallback(
    (event: unknown, id: EntityId | null) => {
      onChange(id as number);
    },
    [onChange],
  );

  useEffect(() => {
    dispatch(fetchCustomMarketplaces());
  }, [dispatch]);

  return (
    <>
      <Box display="flex" alignItems="center">
        <Autocomplete<EntityId, false, true>
          value={isLoading ? '' : marketplaceId || ''}
          size="small"
          fullWidth
          onChange={handleChangeMarketplaceId}
          renderInput={props => <TextField {...props} variant="outlined" label="Select Marketplace" />}
          options={marketplaceIds}
          getOptionLabel={getOptionLabel}
          getOptionDisabled={option =>
            (disableEmptyMarketplaces && marketplacesMap[option]?.productsCount === 0) ||
            !getIsOptionAllowedByCountries({
              marketplaceCountryIds: marketplacesMap[option]?.countryIds ?? [],
              permittedCountryIds,
            })
          }
          renderOption={(props, option) => (
            <Tooltip
              arrow
              placement="right"
              title={
                getIsOptionAllowedByCountries({
                  marketplaceCountryIds: marketplacesMap[option]?.countryIds ?? [],
                  permittedCountryIds,
                })
                  ? ''
                  : 'Products from this marketplace are not available for the country specified for this campaign'
              }
            >
              <li {...props}>
                <Box width={1} display="flex" justifyContent="space-between">
                  <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                    {getOptionLabel(option)}
                  </Box>
                  <Box pl={1} flex="0 0 auto" color="grey.main">
                    {marketplacesMap[option]?.productsCount} Gifts
                  </Box>
                </Box>
              </li>
            </Tooltip>
          )}
          loading={isLoading}
          disableClearable={disableClearable ? true : undefined}
          classes={{
            option: classes.option,
          }}
        />
        {marketplaceId && marketplacesMap[marketplaceId] && (
          <Box display="flex" flex="0 0 auto" ml={5} color="text.primary">
            <Link target="_blank" to={MARKETPLACE_ROUTES.buildCustomPath(marketplaceId)}>
              Preview Marketplace
            </Link>
          </Box>
        )}
      </Box>
      {!isLoading && marketplaceIds.length === 0 && (
        <Box color="grey.main" mt={1} fontSize="0.875rem">
          Your team does not appear to have any Custom Marketplaces available, but you may create a new one in the&nbsp;
          <Link target="_blank" to={MARKETPLACE_ROUTES.buildCampaignPath()}>
            Marketplace
          </Link>{' '}
          tab and add it to this campaign later.
        </Box>
      )}
    </>
  );
};

export default CustomMarketplaceSelect;
