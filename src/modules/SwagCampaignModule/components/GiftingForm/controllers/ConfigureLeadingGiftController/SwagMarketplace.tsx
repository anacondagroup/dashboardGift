import React, { memo, useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import EmbeddedBaseMarketplace, {
  IEmbeddedBaseMarketplaceProps,
} from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/EmbeddedBaseMarketplace';
import { IFiltersPanelProps } from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/FiltersPanel';
import AdvancedFiltersPanel from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/AdvancedFiltersPanel/AdvancedFiltersPanel';
import { getDetailsData } from '../../../../store/swagCampaign/steps/details/details.selectors';
import {
  GiftingStepFields,
  TSwagCampaignGiftingForm,
} from '../../../../store/swagCampaign/steps/gifting/gifting.types';

import { useLoadSwagMarketplace } from './hooks/useLoadSwagMarketplace';

export interface ISwagMarketplaceProps {
  control: Control<TSwagCampaignGiftingForm>;
  onClickProduct: IEmbeddedBaseMarketplaceProps['onClickProduct'];
}

const SwagMarketplace = ({ control, onClickProduct }: ISwagMarketplaceProps): JSX.Element => {
  const marketplaceData = useWatch({
    control,
    name: GiftingStepFields.ExchangeMarketplaceSettings,
  });
  const { isLoaded, permittedTypeIds } = useLoadSwagMarketplace(marketplaceData);

  const { countryIds } = useSelector(getDetailsData) || {};

  const renderFiltersPanel = useCallback(
    (props: IFiltersPanelProps) => (
      <AdvancedFiltersPanel {...props} permittedTypeIds={permittedTypeIds} countryIds={countryIds || []} />
    ),
    [countryIds, permittedTypeIds],
  );

  return (
    <EmbeddedBaseMarketplace
      isReady={isLoaded}
      disableBudget
      renderFiltersPanel={renderFiltersPanel}
      columnsCount={4}
      showCountry
      syncBudget
      onClickProduct={onClickProduct}
    />
  );
};

export default memo(SwagMarketplace);
