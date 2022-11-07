import React, { useState } from 'react';
import { Box } from '@mui/material';
import { GiftingFlow } from '@alycecom/modules';
import { WindowScroller } from 'react-virtualized';

import { EmbeddedCampaignMarketplace } from '../../../MarketplaceModule/components/EmbeddedMarketplace';
import { ProductFilter } from '../../../MarketplaceModule/store/products/products.types';

const styles = {
  scrollArea: {
    height: '100%',
    overflowY: 'scroll',
    overflowX: 'hidden',
    mx: -2,
    px: 2,
  },
  filtersPanel: {
    position: 'sticky',
    top: 0,
    p: 1,
    mx: 2,
    zIndex: 'appBar',
    backgroundColor: 'common.white',
  },
} as const;

const SelectGiftStep = (): JSX.Element => {
  const [scrollableElement, setScrollableElement] = useState<HTMLElement | undefined>();

  return (
    <Box ref={el => setScrollableElement(el as HTMLElement)} sx={styles.scrollArea}>
      <GiftingFlow.SelectProduct
        renderMarketplace={({ onSelect, campaignId, value, defaultProductIds }) => (
          <WindowScroller scrollElement={scrollableElement}>
            {({ scrollTop, height, registerChild }) => (
              <Box mx={-3}>
                <EmbeddedCampaignMarketplace
                  initialFilters={{
                    [ProductFilter.HiddenProductIds]: defaultProductIds,
                  }}
                  filtersPanelWrapperProps={{
                    sx: styles.filtersPanel,
                  }}
                  gridProps={{
                    scrollTop,
                    height,
                    registerGridWrapper: registerChild,
                    autoHeight: true,
                  }}
                  campaignId={campaignId}
                  getIsProductSelected={product => !!value && product.id === value.id}
                  onClickProduct={product =>
                    onSelect({
                      id: product.id,
                      denomination: product?.denomination?.price,
                    })
                  }
                />
              </Box>
            )}
          </WindowScroller>
        )}
      />
    </Box>
  );
};

export default SelectGiftStep;
