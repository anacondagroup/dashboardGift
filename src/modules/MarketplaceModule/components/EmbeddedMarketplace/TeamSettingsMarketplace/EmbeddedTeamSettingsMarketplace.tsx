import React, { memo, useCallback } from 'react';
import { IProduct } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import { useLoadTeamSettingsMarketplace } from '../hooks/useLoadTeamSettingsMarketplace';
import EmbeddedBaseMarketplace, {
  IEmbeddedBaseMarketplaceProps,
} from '../EmbeddedBaseMarketplace/EmbeddedBaseMarketplace';
import { IFiltersPanelProps } from '../EmbeddedBaseMarketplace/FiltersPanel';
import { INoticeProps } from '../EmbeddedBaseMarketplace/Notice';
import { getRestrictedTypeIds } from '../../../store/teamSettings/teamSettings.selectors';
import AdvancedFiltersPanel from '../EmbeddedBaseMarketplace/AdvancedFiltersPanel/AdvancedFiltersPanel';
import CountryChips from '../EmbeddedBaseMarketplace/AdvancedFiltersPanel/CountryChips';

import MultiCountryNotice from './MultiCountryNotice';

export interface IEmbeddedTeamSettingsMarketplaceProps extends Omit<IEmbeddedBaseMarketplaceProps, 'isReady'> {
  teamId: number;
  countryIds: number[];
  selectableCountyIds?: number[];
  checkIsProductSelected: (product: IProduct) => boolean;
  selectedProductsCountryIds: number[];
}

export const EmbeddedTeamSettingsMarketplace = ({
  teamId,
  countryIds,
  checkIsProductSelected,
  selectedProductsCountryIds,
  selectableCountyIds,
  ...simpleMarketplaceProps
}: IEmbeddedTeamSettingsMarketplaceProps): JSX.Element => {
  const { isLoaded } = useLoadTeamSettingsMarketplace({
    teamId,
    countryIds,
    selectableCountyIds,
  });
  const restrictedTypeIds = useSelector(getRestrictedTypeIds);

  const renderFiltersPanel = useCallback(
    (props: IFiltersPanelProps) => (
      <AdvancedFiltersPanel {...props} restrictedTypeIds={restrictedTypeIds} countryIds={countryIds} />
    ),
    [countryIds, restrictedTypeIds],
  );

  const renderFiltersChips = useCallback(
    props =>
      countryIds.length > 1 ? (
        <CountryChips {...props} selectedProductsCountryIds={selectedProductsCountryIds} />
      ) : null,
    [selectedProductsCountryIds, countryIds],
  );

  const renderNotice = useCallback(
    (props: INoticeProps) => (
      <MultiCountryNotice {...props} countryIds={countryIds} selectedProductsCountryIds={selectedProductsCountryIds} />
    ),
    [countryIds, selectedProductsCountryIds],
  );

  return (
    <EmbeddedBaseMarketplace
      {...simpleMarketplaceProps}
      isReady={isLoaded}
      renderFiltersPanel={renderFiltersPanel}
      renderFiltersChips={renderFiltersChips}
      renderNotice={renderNotice}
      getIsProductSelected={product => checkIsProductSelected(product)}
    />
  );
};

export default memo(EmbeddedTeamSettingsMarketplace);
