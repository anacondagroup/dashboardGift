import React, { Key, memo, useCallback, useEffect, useMemo } from 'react';
import { AutocompleteRenderGroupParams, Box, ListSubheader, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, MultiAutocomplete } from '@alycecom/ui';
import { useHistory } from 'react-router-dom';

import {
  getCampaignId,
  getIsLoading as getCampaignsLoading,
} from '../../store/campaignSettings/campaignSettings.selectors';
import { getIsLoading as getCustomMarketplacesLoading } from '../../store/entities/customMarketplaces/customMarketplaces.selectors';
import { resetProductsState, setPage } from '../../store/products/products.actions';
import { resetCampaignSettings } from '../../store/campaignSettings/campaignSettings.actions';
import { fetchCustomMarketplaces } from '../../store/entities/customMarketplaces/customMarketplaces.actions';
import { ProductFilter } from '../../store/products/products.types';
import { MarketplacesListOptionType } from '../../types';
import { getMarketplacesOptions } from '../../store/marketplace.selectors';
import { MARKETPLACE_DEFAULT_OPTION } from '../../store/marketplace.constants';
import { useCustomMarketplace } from '../../hooks/useCustomMarketplace';
import { MARKETPLACE_ROUTES } from '../../routePaths';

import { IOption } from './option';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  campaignSelect: {
    width: 350,
  },
  popper: {
    minWidth: 380,
  },
  valueLabel: {
    fontSize: '15px !important',
  },
  groupHeaderContainer: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '24px',
    height: '100%',
    paddingTop: spacing(3),
  },
  groupHeader: {
    display: 'flex',
    flexGrow: 1,
    textTransform: 'uppercase',
    lineHeight: 'unset',
    fontWeight: 700,
  },
  groupSubheader: {
    display: 'flex',
    borderBottom: `1px solid ${palette.grey.timberWolf}`,
    fontSize: 14,
    color: palette.grey.main,
    lineHeight: '24px',
  },
  optionContainer: {
    display: 'flex',
    width: '100%',
    paddingTop: 0,
    overflow: 'hidden',
  },
  optionProductsCount: {
    marginLeft: 'auto',
    fontSize: 14,
    color: palette.grey.main,
  },
}));

const SUBHEADERS_MAP = {
  [MarketplacesListOptionType.Empty]: '',
  [MarketplacesListOptionType.Campaigns]: 'Curated by you or someone on your team',
  [MarketplacesListOptionType.CustomMarketplaces]: 'Curated by you or someone on your team',
};

const MarketplacesList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { marketplaceId } = useCustomMarketplace();
  const campaignId = useSelector(getCampaignId);
  const campaignsLoading = useSelector(getCampaignsLoading);
  const customMarketplacesLoading = useSelector(getCustomMarketplacesLoading);
  const options = useSelector(getMarketplacesOptions);
  const isLoading = campaignsLoading || customMarketplacesLoading;

  useEffect(() => {
    dispatch(fetchCustomMarketplaces());
  }, [dispatch]);

  const handleChange = useCallback(
    newValue => {
      if (!newValue) {
        return;
      }

      dispatch(resetProductsState());
      dispatch(resetCampaignSettings());
      dispatch(setPage(1));

      if (newValue.type === MarketplacesListOptionType.CustomMarketplaces) {
        push(MARKETPLACE_ROUTES.buildCustomPath(newValue.id));
      } else {
        push(MARKETPLACE_ROUTES.buildCampaignPath(newValue?.id));
      }
    },
    [dispatch, push],
  );

  const value = useMemo<IOption>(() => {
    const optionType = marketplaceId
      ? MarketplacesListOptionType.CustomMarketplaces
      : MarketplacesListOptionType.Campaigns;
    const optionId = marketplaceId || campaignId;
    return options.find(({ id, type }) => id === optionId && type === optionType) || MARKETPLACE_DEFAULT_OPTION;
  }, [options, campaignId, marketplaceId]);
  const getOptionLabel = (option: IOption | null) => option?.label ?? '';

  return (
    <MultiAutocomplete<IOption, false>
      label="Select Marketplace"
      name={ProductFilter.CampaignsCustomMarketplaces}
      value={value}
      options={options}
      loading={isLoading}
      onChange={handleChange}
      classes={classes}
      listboxProps={{ rowHeight: 32, maxVisibleRows: 10 }}
      getOptionLabel={getOptionLabel}
      getOptionSelected={(option, optionValue) => option.id === optionValue.id && option.type === optionValue.type}
      groupBy={({ type }) => type}
      renderValue={val => <span data-value={val?.id ?? ''}>{getOptionLabel(val)}</span>}
      renderGroup={({ children, key, group }: AutocompleteRenderGroupParams) => {
        const result = [children];

        if (group) {
          const subheader = SUBHEADERS_MAP[group as MarketplacesListOptionType];

          result.unshift(
            <ListSubheader key={key} component="div" data-height={75}>
              <div className={classes.groupHeaderContainer}>
                <Typography className={classes.groupHeader}>{group}</Typography>
                <Typography className={classes.groupSubheader}>{subheader}</Typography>
              </div>
            </ListSubheader>,
          );
        }

        return result;
      }}
      renderOption={(props, option: IOption) => (
        <li {...props} key={option.id as Key}>
          <Box
            pt="6px"
            data-testid={`AlyceUI.MarketplacesList.${option.type}.${option.id}`}
            className={classes.optionContainer}
          >
            <Box whiteSpace="nowrap" textOverflow="ellipsis" maxWidth={280} overflow="hidden">
              {option.label}
            </Box>
            {!!option.productsCount && (
              <Typography className={classes.optionProductsCount}>{option.productsCount} gifts</Typography>
            )}
          </Box>
        </li>
      )}
      multiple={false}
    />
  );
};

export default memo(MarketplacesList);
