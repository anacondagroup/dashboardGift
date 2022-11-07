import React, { memo, useCallback } from 'react';
import { Control, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';

import EmbeddedBaseMarketplace, {
  IEmbeddedBaseMarketplaceProps,
} from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/EmbeddedBaseMarketplace';
import { IFiltersPanelProps } from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/FiltersPanel';
import AdvancedFiltersPanel from '../../../../../MarketplaceModule/components/EmbeddedMarketplace/EmbeddedBaseMarketplace/AdvancedFiltersPanel/AdvancedFiltersPanel';
import { getDetailsData } from '../../../../store/prospectingCampaign/steps/details/details.selectors';
import {
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../../../store/prospectingCampaign/steps/gifting/gifting.types';

import { useLoadProspectingMarketplace } from './hooks/useLoadProspectingMarketplace';

export interface IProspectingMarketplaceProps {
  control: Control<TProspectingGiftingForm>;
  onClickProduct: IEmbeddedBaseMarketplaceProps['onClickProduct'];
}

const ProspectingMarketplace = ({ control, onClickProduct }: IProspectingMarketplaceProps): JSX.Element => {
  const marketplaceData = useWatch({
    control,
    name: GiftingStepFields.MarketplaceData,
  });
  const { isLoaded, permittedTypeIds } = useLoadProspectingMarketplace(marketplaceData);

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
      renderFiltersPanel={renderFiltersPanel}
      disableBudget
      columnsCount={4}
      showCountry
      syncBudget
      onClickProduct={onClickProduct}
    />
  );
};

export default memo(ProspectingMarketplace);
