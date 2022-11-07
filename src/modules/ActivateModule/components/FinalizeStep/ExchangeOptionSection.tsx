import React, { useCallback, useEffect, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Icon } from '@alycecom/ui';
import { CampaignSettings, Features } from '@alycecom/modules';

import { GiftExchangeOptions } from '../../constants/exchange.constants';
import MarketplaceSettings from '../GiftStep/MarketplaceSettings';
import {
  getExchangeMarketplaceSettings,
  getGiftExchangeOptions,
  getSelectedCustomMarketplaceId,
} from '../../store/steps/gift';
import {
  getCustomMarketplaceById,
  getIsIdle,
} from '../../store/entities/customMarketplaces/customMarketplaces.selectors';
import { fetchCustomMarketplaces } from '../../store/entities/customMarketplaces/customMarketplaces.actions';
import { MARKETPLACE_ROUTES } from '../../../MarketplaceModule/routePaths';

const ExchangeOptionSection = (): JSX.Element => {
  const dispatch = useDispatch();
  const exchangeOption = useSelector(getGiftExchangeOptions);
  const marketplaceSetting = useSelector(getExchangeMarketplaceSettings);
  const marketplaceId = useSelector(getSelectedCustomMarketplaceId);
  const isCustomMarketplaceIdle = useSelector(getIsIdle);
  const customMarketplace = useSelector(
    useMemo(() => (marketplaceId ? getCustomMarketplaceById(marketplaceId) : () => null), [marketplaceId]),
  );
  const isCustomMarketplaceEnabled = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.CUSTOM_MARKETPLACES), []),
  );

  useEffect(() => {
    if (isCustomMarketplaceIdle && isCustomMarketplaceEnabled) {
      dispatch(fetchCustomMarketplaces());
    }
  }, [isCustomMarketplaceIdle, isCustomMarketplaceEnabled, dispatch]);

  const handlePreviewCustomMarketplace = useCallback(() => {
    if (marketplaceId) {
      window.open(MARKETPLACE_ROUTES.buildCustomPath(marketplaceId));
    }
  }, [marketplaceId]);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Gift Exchange Options
      </CampaignSettings.StyledSectionTitle>
      <Box mb={9} maxWidth={650}>
        {exchangeOption === GiftExchangeOptions.campaignBudget && marketplaceSetting && (
          <MarketplaceSettings data={marketplaceSetting} />
        )}
        {exchangeOption === GiftExchangeOptions.customMarketplace && (
          <Box display="flex" alignItems="center">
            <Typography>Custom marketplace:</Typography>
            <Button onClick={handlePreviewCustomMarketplace} endIcon={<Icon icon="eye" />} variant="text">
              {customMarketplace?.name}
            </Button>
          </Box>
        )}
        {exchangeOption === GiftExchangeOptions.acceptOnly && (
          <Typography>Do not allow recipients to exchange gifts (accept-only)</Typography>
        )}
        {exchangeOption === GiftExchangeOptions.noExchange && (
          <Typography>Send a single leading gift, but allow recipients to donate their gift</Typography>
        )}
      </Box>
    </>
  );
};

export default ExchangeOptionSection;
