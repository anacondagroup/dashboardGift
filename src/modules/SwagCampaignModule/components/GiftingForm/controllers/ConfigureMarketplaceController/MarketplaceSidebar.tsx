import React, { memo, useCallback } from 'react';
import { Control, UseFormTrigger } from 'react-hook-form';
import { Box, Collapse, Grid, Theme } from '@mui/material';
import { Button, Divider, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';
import { getDetailsData } from '../../../../store/swagCampaign/steps/details/details.selectors';
import GiftCardsMarketplaceLink from '../../../../../MarketplaceModule/components/Shared/GiftCardsMarketplaceLink';

import RestrictPhysicalProductTypes from './fields/RestrictPhysicalProductTypes';
import PhysicalPrice from './fields/PhysicalPrice';
import DigitalProductTypeBudget from './fields/DigitalProductTypeBudget';
import RestrictVendors from './fields/RestrictVendors';

export interface IMarketplaceSidebarProps {
  control: Control<TSwagCampaignGiftingForm>;
  trigger: UseFormTrigger<TSwagCampaignGiftingForm>;
  open?: boolean;
  isDonationEnabled?: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const styles = {
  footer: {
    width: 550,
    height: 78,
    position: 'fixed',
    bottom: 0,
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: ({ palette }: Theme) => palette.primary.light,
    padding: ({ spacing }: Theme) => spacing(2),
    zIndex: ({ zIndex }: Theme) => zIndex.appBar,
  },
} as const;

const MarketplaceSidebar = ({
  control,
  trigger,
  onClose,
  onCancel,
  onSave,
  open = false,
  isDonationEnabled = true,
}: IMarketplaceSidebarProps): JSX.Element => {
  const { countryIds } = useSelector(getDetailsData) || {};

  const onMinPriceChanged = useCallback(() => {
    trigger(`${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.MaxBudgetAmount}` as const);
  }, [trigger]);

  const onMaxPriceChanged = useCallback(() => {
    trigger(`${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.MinBudgetAmount}` as const);
  }, [trigger]);

  return (
    <ProductSidebar isOpen={open} onClose={onClose} width={550}>
      <Box display="flex" flexDirection="column" bgcolor="common.white" height="max(100%, 100vh)">
        <ProductSidebarHeader onClose={onClose} height="83px">
          <Box ml={2} fontSize="20px">
            Marketplace Editor
          </Box>
        </ProductSidebarHeader>
        <Box p={3} flex="1 1 auto">
          <RestrictPhysicalProductTypes control={control} />
          <Box mt={8}>
            <Grid container spacing={4}>
              <Grid item xs={4}>
                <PhysicalPrice
                  control={control}
                  onChanged={onMinPriceChanged}
                  name={MarketplaceDataFields.MinBudgetAmount}
                  label="Min Price"
                />
              </Grid>
              <Grid item xs={4}>
                <PhysicalPrice
                  control={control}
                  onChanged={onMaxPriceChanged}
                  name={MarketplaceDataFields.MaxBudgetAmount}
                  label="Max Price"
                />
              </Grid>
            </Grid>
          </Box>
          <Divider my={3} />
          <DigitalProductTypeBudget
            control={control}
            name={MarketplaceDataFields.GiftCardMaxBudget}
            label="Gift Cards"
            fieldLabel="Max Price"
            converter
          >
            {({ enabled, value }) => (
              <>
                <Collapse in={enabled && value !== null && !!countryIds} mountOnEnter unmountOnExit>
                  <Box mt={1}>
                    <GiftCardsMarketplaceLink giftCardPrice={value ?? 0} countryIds={countryIds ?? []} />
                  </Box>
                </Collapse>
              </>
            )}
          </DigitalProductTypeBudget>
          <Divider my={3} />
          {isDonationEnabled && (
            <DigitalProductTypeBudget
              control={control}
              name={MarketplaceDataFields.DonationMaxBudget}
              label="Donations"
              fieldLabel="Amount"
            />
          )}
          <Box mt={3}>
            <RestrictVendors control={control} />
          </Box>
        </Box>
        <Box flex="0 0 94px" position="relative">
          <Box sx={styles.footer}>
            <Button type="button" borderColor="divider" color="default" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="button" color="primary" onClick={onSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </ProductSidebar>
  );
};

export default memo(MarketplaceSidebar);
