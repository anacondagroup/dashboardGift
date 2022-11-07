import React, { useCallback, useEffect, useRef } from 'react';
import { Box, CircularProgress, Collapse, MenuItem, outlinedInputClasses, Theme, Tooltip } from '@mui/material';
import { Icon, SelectFilter, Button } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings, Features, HasFeature } from '@alycecom/modules';
import { all, equals, pipe, map } from 'ramda';

import { GiftExchangeOptions } from '../../../constants/exchange.constants';
import MarketplaceSettings from '../MarketplaceSettings';
import {
  getExchangeMarketplaceSettings,
  getGiftExchangeOptions,
  getIsLoading,
  getSelectedCustomMarketplaceId,
  setGiftExchangeOption,
  updateGiftExchangeOptionsRequest,
  updateMarketplaceSettingsRequest,
} from '../../../store/steps/gift';
import SelectCustomMarketplace from '../SelectCustomMarketplace/SelectCustomMarketplace';
import { openMarketplaceSettingsSidebar } from '../../../store/ui/createPage/marketplaceSettingsSidebar';
import { getActivateModuleParams } from '../../../store/activate.selectors';
import AsteriskText from '../../AsteriskText';
import NoExchangeDonationPrice from '../NoExchangeDonationPrice/NoExchangeDonationPrice';
import FallbackGift from '../FallbackGift/FallbackGift';
import { fetchProductsCount } from '../../../store/productsCount/productsCount.actions';
import { getIsGiftTypesLoaded, getUnavailableTypes } from '../../../store/entities/giftTypes/giftTypes.selectors';
import { GiftTypes } from '../../../store/entities/giftTypes/giftTypes.types';
import { PHYSICAL_GIFT_TYPE_LIST } from '../../../constants/marketplaceSidebar.constants';
import {
  getIsGiftVendorsLoaded,
  getRestrictedByTeamBrandIds,
  getRestrictedByTeamMerchantIds,
} from '../../../store/entities/giftVendors/giftVendors.selectors';
import { getIsActivateFulfilled } from '../../../store/ui/status/status.selectors';

const styles = {
  section: {
    width: 650,
  },
  root: {
    [`& .${outlinedInputClasses.root}`]: {
      color: ({ palette }: Theme) => palette.primary.main,
    },
    [`& .${outlinedInputClasses.notchedOutline}`]: {
      borderWidth: 1,
      borderColor: ({ palette }: Theme) => palette.grey.chambray50,
    },
  },
} as const;

const DEFAULT_DONATION_MAX_BUDGET = 50;
const DEFAULT_GIFT_CARD_MAX_BUDGET = 50;
const MAX_BUDGET = 50;
const MIN_BUDGET = 5;

interface IGiftExchangeOptionsSectionProps {
  isMultiCountry?: boolean;
}

const GiftExchangeOptionsSection = ({ isMultiCountry }: IGiftExchangeOptionsSectionProps): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId, isBuilderMode, isEditorMode } = useSelector(getActivateModuleParams);
  const exchangeOption = useSelector(getGiftExchangeOptions);
  const marketplaceSettings = useSelector(getExchangeMarketplaceSettings);
  const customMarketplaceId = useSelector(getSelectedCustomMarketplaceId);
  const isLoading = useSelector(getIsLoading);
  const isCustomMarketplaceEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.CUSTOM_MARKETPLACES));
  const isAcceptOnlyEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ACCEPT_ONLY));
  const isGiftTypesLoaded = useSelector(getIsGiftTypesLoaded);
  const isVendorsLoaded = useSelector(getIsGiftVendorsLoaded);
  const unavailableTypes = useSelector(getUnavailableTypes);
  const restrictedByTeamBrandIds = useSelector(getRestrictedByTeamBrandIds);
  const restrictedByTeamMerchantIds = useSelector(getRestrictedByTeamMerchantIds);
  const isPhysicalGiftsUnavailable = pipe(
    map((value: GiftTypes) => unavailableTypes.includes(value)),
    all(equals(true)),
  )(PHYSICAL_GIFT_TYPE_LIST);
  const isFulfilled = useSelector(getIsActivateFulfilled);

  const canChangeExchangeSettings =
    isBuilderMode ||
    exchangeOption === GiftExchangeOptions.customMarketplace ||
    exchangeOption === GiftExchangeOptions.campaignBudget;
  const isNoExchangeOptionEnabled = exchangeOption === GiftExchangeOptions.noExchange || isBuilderMode;
  const isAcceptOnlyOptionEnabled = exchangeOption === GiftExchangeOptions.acceptOnly || isBuilderMode;
  const isMountRef = useRef(false);
  const isNeedFetchProductsCount = [GiftExchangeOptions.campaignBudget, GiftExchangeOptions.customMarketplace].includes(
    exchangeOption as GiftExchangeOptions,
  );

  const disabledTooltip = (
    <Box>
      Once gifting has potentially started (after campaign creation), this option is no longer able to be edited between
      “accept/exchange” and “accept-only” to minimize recipient confusion.
    </Box>
  );

  const disabledCustomMarketplaceTooltip = (
    <Box>
      Once gifting has potentially started (after campaign creation), this option is no longer able to be edited between
      “accept/exchange” and “accept-only” to minimize recipient confusion.
    </Box>
  );

  const exchangeOptions = [
    {
      label: 'Can accept, exchange, or donate gift in Alyce Marketplace (default)',
      value: GiftExchangeOptions.campaignBudget,
      disabled: !canChangeExchangeSettings,
      tooltip: disabledTooltip,
    },
    {
      label: 'Option to exchange their gift within a Custom Marketplace',
      value: GiftExchangeOptions.customMarketplace,
      disabled: !canChangeExchangeSettings,
      tooltip: disabledCustomMarketplaceTooltip,
      hidden: !isCustomMarketplaceEnabled,
    },
    {
      label: 'Can accept or donate the value of leading gift to a charity of choice',
      value: GiftExchangeOptions.noExchange,
      disabled: !isNoExchangeOptionEnabled,
      tooltip: disabledTooltip,
    },
    {
      label: 'Cannot exchange or donate their gift (accept-only)',
      value: GiftExchangeOptions.acceptOnly,
      disabled: !isAcceptOnlyOptionEnabled,
      tooltip: disabledTooltip,
      hidden: !isAcceptOnlyEnabled,
    },
  ];

  const handleOpenMarketplaceSettings = useCallback(() => dispatch(openMarketplaceSettingsSidebar()), [dispatch]);

  const handleSelectOption = useCallback(
    ({ giftExchangeOptions }: Record<string, GiftExchangeOptions | null>) => {
      if (!campaignId) {
        return;
      }
      if (isBuilderMode) {
        dispatch(updateGiftExchangeOptionsRequest({ giftExchangeOptions }));
      } else if (giftExchangeOptions) {
        dispatch(setGiftExchangeOption({ exchangeOption: giftExchangeOptions }));
      }
    },
    [dispatch, campaignId, isBuilderMode],
  );

  useEffect(() => {
    if (isNeedFetchProductsCount && !isMountRef.current) {
      dispatch(fetchProductsCount());
      isMountRef.current = true;
    }
  }, [isNeedFetchProductsCount, dispatch]);

  useEffect(() => {
    if (!campaignId || exchangeOption || !isFulfilled) {
      return;
    }
    if (isBuilderMode) {
      dispatch(updateGiftExchangeOptionsRequest({ giftExchangeOptions: GiftExchangeOptions.campaignBudget }));
    }
    if (isEditorMode) {
      dispatch(setGiftExchangeOption({ exchangeOption: GiftExchangeOptions.campaignBudget }));
    }
  }, [dispatch, campaignId, isBuilderMode, isEditorMode, isFulfilled, exchangeOption]);

  useEffect(() => {
    if (
      isGiftTypesLoaded &&
      isVendorsLoaded &&
      exchangeOption === GiftExchangeOptions.campaignBudget &&
      !marketplaceSettings &&
      isFulfilled
    ) {
      dispatch(
        updateMarketplaceSettingsRequest({
          donationMaxBudget: unavailableTypes.includes(GiftTypes.donation) ? null : DEFAULT_DONATION_MAX_BUDGET,
          giftCardMaxBudget: unavailableTypes.includes(GiftTypes.giftCard) ? null : DEFAULT_GIFT_CARD_MAX_BUDGET,
          maxBudgetAmount: isPhysicalGiftsUnavailable ? null : MAX_BUDGET,
          minBudgetAmount: isPhysicalGiftsUnavailable ? null : MIN_BUDGET,
          restrictedBrandIds: restrictedByTeamBrandIds,
          restrictedGiftTypeIds: unavailableTypes,
          restrictedMerchantIds: restrictedByTeamMerchantIds,
        }),
      );
    }
  }, [
    dispatch,
    exchangeOption,
    unavailableTypes,
    restrictedByTeamBrandIds,
    restrictedByTeamMerchantIds,
    isGiftTypesLoaded,
    isVendorsLoaded,
    marketplaceSettings,
    isPhysicalGiftsUnavailable,
    isFulfilled,
  ]);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Gift Exchange options
      </CampaignSettings.StyledSectionTitle>
      <Box sx={styles.section}>
        <Box mb={2} color="primary.light" fontSize={14}>
          Allow recipients to exchange for other gifts at a similar cost (specify gift types, budget, and any vendor
          restrictions)
        </Box>

        <Box width={530}>
          <SelectFilter
            sx={styles.root}
            label=""
            name="giftExchangeOptions"
            value={exchangeOption}
            onFilterChange={handleSelectOption}
            fullWidth
            dataTestId="1Many.GifExchangeOptions"
            renderItems={() =>
              exchangeOptions
                .filter(({ hidden }) => !hidden)
                .map(option =>
                  option.disabled ? (
                    <Tooltip title={option.tooltip} placement="top-end">
                      <Box>
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          data-testid={option.value}
                          className="Body-Regular-Center-Chambray"
                        >
                          {option.label}
                        </MenuItem>
                      </Box>
                    </Tooltip>
                  ) : (
                    <MenuItem
                      key={option.value}
                      value={option.value}
                      data-testid={option.value}
                      className="Body-Regular-Center-Chambray"
                    >
                      {option.label}
                    </MenuItem>
                  ),
                )
            }
          />
        </Box>

        <Collapse in={exchangeOption === GiftExchangeOptions.campaignBudget} unmountOnExit mountOnEnter>
          {marketplaceSettings ? (
            <Box display="flex">
              <Box mt={2}>
                <MarketplaceSettings data={marketplaceSettings} />
              </Box>
              <Box mt={2} ml={2}>
                <Button
                  onClick={handleOpenMarketplaceSettings}
                  color="secondary"
                  disabled={isLoading}
                  endIcon={<Icon icon="pencil" />}
                >
                  Edit
                </Button>
              </Box>
            </Box>
          ) : (
            <Box width={530} height={40} display="flex" justifyContent="center" alignItems="center" my={2}>
              <CircularProgress />
            </Box>
          )}
        </Collapse>

        <HasFeature featureKey={Features.FLAGS.CUSTOM_MARKETPLACES}>
          <Collapse in={exchangeOption === GiftExchangeOptions.customMarketplace} unmountOnExit mountOnEnter>
            <Box my={2}>
              <SelectCustomMarketplace />
              <AsteriskText mt={1} invalid={!customMarketplaceId}>
                * You must select a marketplace to continue
              </AsteriskText>
            </Box>
          </Collapse>
        </HasFeature>

        <Collapse in={exchangeOption === GiftExchangeOptions.noExchange} unmountOnExit mountOnEnter>
          <Box my={2}>
            <NoExchangeDonationPrice />
          </Box>
        </Collapse>

        <HasFeature featureKey={Features.FLAGS.ACCEPT_ONLY}>
          {!isMultiCountry && (
            <Collapse in={exchangeOption === GiftExchangeOptions.acceptOnly} mountOnEnter unmountOnExit>
              <FallbackGift mt={2} />
            </Collapse>
          )}
        </HasFeature>
      </Box>
    </>
  );
};

export default GiftExchangeOptionsSection;
