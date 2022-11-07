import React, { useCallback, useEffect } from 'react';
import { EntityId } from '@alycecom/utils';
import { TextField, Box, Autocomplete, Skeleton, Theme, outlinedInputClasses, formLabelClasses } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceTheme } from '@alycecom/ui';
import { Link } from 'react-router-dom';

import {
  getCustomMarketplacesMap,
  getIsLoading,
} from '../../../store/entities/customMarketplaces/customMarketplaces.selectors';
import { fetchCustomMarketplaces } from '../../../store/entities/customMarketplaces/customMarketplaces.actions';
import { getSelectedCustomMarketplaceId, updateCustomMarketplaceSetting } from '../../../store/steps/gift';
import { getCountryIds, getTeamId } from '../../../store/steps/details';
import { useGetMarketplaceIdsByTeamId } from '../../../hooks/useGetMarketplaceIdsByTeamId';
import { MARKETPLACE_ROUTES } from '../../../../MarketplaceModule/routePaths';
import {
  getIsFulfilled as getIsProductsCountFulfilled,
  getProductsCount,
} from '../../../store/productsCount/productsCount.selectors';

const useStyles = makeStyles<AlyceTheme>(() => ({
  option: {
    maxHeight: 36,
  },
  previewLink: {
    fontWeight: 'normal',
  },
}));

const styles = {
  root: {
    [`& .${outlinedInputClasses.root}`]: {
      color: ({ palette }: Theme) => palette.primary.main,
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderWidth: 1,
      borderColor: ({ palette }: Theme) => palette.grey.chambray50,
    },
    [`& .${formLabelClasses.root}`]: {
      color: ({ palette }: Theme) => palette.primary.main,
    },
  },
} as const;

const SelectCustomMarketplace = (): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const marketplaceId = useSelector(getSelectedCustomMarketplaceId);
  const teamId = useSelector(getTeamId);
  const countryIds = useSelector(getCountryIds);
  const marketplaceIds = useGetMarketplaceIdsByTeamId({ teamId, countryIds });
  const marketplacesMap = useSelector(getCustomMarketplacesMap);
  const isLoading = useSelector(getIsLoading);
  const productsCount = useSelector(getProductsCount);
  const isProductsCountFulfilled = useSelector(getIsProductsCountFulfilled);

  const getOptionLabel = (option: EntityId) => marketplacesMap[option]?.name || '';

  const handleChangeMarketplaceId = useCallback(
    (event: unknown, id: EntityId | null) => {
      dispatch(updateCustomMarketplaceSetting({ id }));
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(fetchCustomMarketplaces());
  }, [dispatch]);

  return (
    <>
      <Box display="flex" alignItems="center" width={530}>
        <Autocomplete<EntityId, false, true>
          sx={styles.root}
          value={isLoading ? '' : marketplaceId || ''}
          size="small"
          fullWidth
          onChange={handleChangeMarketplaceId}
          renderInput={props => <TextField {...props} variant="outlined" label="Select Marketplace" />}
          options={marketplaceIds}
          getOptionLabel={getOptionLabel}
          renderOption={(props, option) => (
            <li {...props}>
              <Box whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                {getOptionLabel(option)}
              </Box>
            </li>
          )}
          loading={isLoading}
          disableClearable
          classes={{
            option: classes.option,
          }}
        />
        {marketplaceId && marketplacesMap[marketplaceId] && (
          <Box display="flex" flex="0 0 auto" ml={5} color="text.primary">
            {isProductsCountFulfilled ? productsCount : <Skeleton variant="text" width={20} />}
            &nbsp;Gifts |&nbsp;
            <Link
              target="_blank"
              to={MARKETPLACE_ROUTES.buildCustomPath(marketplaceId)}
              className={classes.previewLink}
            >
              Preview Marketplace
            </Link>
          </Box>
        )}
      </Box>
      {!isLoading && marketplaceIds.length === 0 && (
        <Box color="grey.main" mt={1} fontSize="0.875rem">
          Your team does not appear to have any Custom Marketplaces available, but you may create a new one in the&nbsp;
          <Link target="_blank" to={MARKETPLACE_ROUTES.buildCampaignPath()} className={classes.previewLink}>
            Marketplace
          </Link>{' '}
          tab and add it to this campaign later.
        </Box>
      )}
    </>
  );
};

export default SelectCustomMarketplace;
