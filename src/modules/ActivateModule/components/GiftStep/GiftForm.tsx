import React, { memo, useCallback, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { Icon } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { loadGiftTypesRequest } from '../../store/entities/giftTypes/giftTypes.actions';
import { loadGiftVendorsRequest } from '../../store/entities/giftVendors/giftVendors.actions';
import ActivateMarketplaceSidebar from '../ActivateMarketplaceSidebar/ActivateMarketplaceSidebar';
import { GiftFormFields } from '../../store/steps/gift/giftForm.schemas';
import ActionButton from '../ActionButton';
import { useActivate } from '../../hooks/useActivate';
import { getDefaultGift, updateDefaultGiftRequest } from '../../store/steps/gift';
import {
  closeMarketplaceSettingsSidebar,
  getIsMarketplaceSettingsSidebarOpened,
} from '../../store/ui/createPage/marketplaceSettingsSidebar';
import {
  closeMarketplaceSidebar,
  getIsMarketplaceSidebarOpened,
  openMarketplaceSidebar,
} from '../../store/ui/createPage/marketplaceSidebar';
import InfoTooltip from '../InfoTooltip';
import AsteriskText from '../AsteriskText';
import { loadDefaultGiftProductsRequest } from '../../store/entities/defaultGiftProducts/defaultGiftProducts.actions';
import { getDefaultGiftProducts } from '../../store/entities/defaultGiftProducts/defaultGiftProducts.selectors';
import { TProduct } from '../../store/entities/defaultGiftProducts/defaultGiftProducts.types';
import { getCountryIds } from '../../store/steps/details';

import SelectGiftSidebar from './SelectGiftSidebar/SelectGiftSidebar';
import RecipientActionsSection from './RecipientActionsSection/RecipientActionsSection';
import GiftExchangeOptionsSection from './GiftExchangeOptionsSection/GiftExchangeOptionsSection';
import MultiCountryDefaultGifts from './MultiCountryDefaultGifts/MultiCountryDefaultGifts';

const GiftForm = (): JSX.Element => {
  const dispatch = useDispatch();

  const { campaignId } = useActivate();

  const defaultGift = useSelector(getDefaultGift);
  const defaultGiftProducts = useSelector(getDefaultGiftProducts);
  const isMarketplaceSettingsSidebarOpen = useSelector(getIsMarketplaceSettingsSidebarOpened);
  const isMarketplaceSidebarOpen = useSelector(getIsMarketplaceSidebarOpened);

  const campaignCountries = useSelector(getCountryIds);
  const isMultiCountry = campaignCountries && campaignCountries?.length > 1;

  const handleCloseMarketplaceSettings = useCallback(() => dispatch(closeMarketplaceSettingsSidebar()), [dispatch]);

  const handleOpenMarketplace = useCallback(() => dispatch(openMarketplaceSidebar()), [dispatch]);
  const handleCloseMarketplace = useCallback(() => dispatch(closeMarketplaceSidebar()), [dispatch]);

  const handleSelectGift = useCallback(
    (countryId: number) => {
      dispatch(openMarketplaceSidebar([countryId]));
    },
    [dispatch],
  );

  useEffect(() => {
    if (campaignId) {
      dispatch(loadGiftTypesRequest({ campaignId }));
      dispatch(loadGiftVendorsRequest({ campaignId }));
    }
  }, [dispatch, campaignId]);

  useEffect(() => {
    if (campaignId && defaultGift) {
      dispatch(loadDefaultGiftProductsRequest({ campaignId }));
    }
  }, [dispatch, campaignId, defaultGift]);

  const onSelectDefaultGift = useCallback(
    (selected: TProduct[]) => {
      dispatch(
        updateDefaultGiftRequest({
          products: selected.map(product => ({ productId: product.id, denomination: product.denomination?.price })),
        }),
      );
    },
    [dispatch],
  );

  return (
    <>
      <Box>
        <Box mt={2} display="flex">
          <Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography className="Body-Regular-Left-Static-Bold">
                Leading Gift <span>*</span>
              </Typography>
              <InfoTooltip
                title="The leading gift is the gift that all of your recipients will see when they land on this campaign’s Gift Redemption Page."
                ml={1}
                display="inline-flex"
              />
            </Box>
            <ActionButton
              variant="outlined"
              onClick={handleOpenMarketplace}
              endIcon={<Icon icon="gift" />}
              data-testid="SelectGift.Btn"
            >
              {defaultGiftProducts.length === 0 ? 'Select Gift' : 'Change Gift'}
              {isMultiCountry ? 's' : ''}
            </ActionButton>
            <AsteriskText mt={1} invalid={!defaultGift} width={300}>
              * You must select a leading gift and a gift exchange option below
            </AsteriskText>
          </Box>
          <MultiCountryDefaultGifts products={defaultGiftProducts} onSelectGift={handleSelectGift} />
        </Box>
      </Box>

      <Box mt={9}>
        <GiftExchangeOptionsSection isMultiCountry={isMultiCountry} />
      </Box>

      <Box mt={9}>
        <RecipientActionsSection formField={GiftFormFields.recipientActions} />
      </Box>

      <ActivateMarketplaceSidebar isOpen={isMarketplaceSettingsSidebarOpen} onClose={handleCloseMarketplaceSettings} />
      <SelectGiftSidebar
        onSelect={onSelectDefaultGift}
        isOpen={isMarketplaceSidebarOpen}
        onClose={handleCloseMarketplace}
        initialSelectedProducts={defaultGiftProducts}
      />
    </>
  );
};

export default memo(GiftForm);
