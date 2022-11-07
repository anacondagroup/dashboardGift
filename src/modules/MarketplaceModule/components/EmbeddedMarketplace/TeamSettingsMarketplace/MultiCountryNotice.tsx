import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { MarketplaceNotice, Tooltip } from '@alycecom/ui';
import { Box, Typography } from '@mui/material';
import { CommonData } from '@alycecom/modules';

export interface IMultiCountryNoticeProps {
  productsCount: number;
  filtersCount: number;
  countryIds: number[];
  selectedProductsCountryIds: number[];
}

const MultiCountryNotice = ({
  productsCount,
  filtersCount,
  countryIds,
  selectedProductsCountryIds,
}: IMultiCountryNoticeProps) => {
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(selectedProductsCountryIds), [selectedProductsCountryIds]),
  );
  const selectedCountryNames = useMemo(() => countries.map(country => <Box key={country.id}>{country.name}</Box>), [
    countries,
  ]);

  return (
    <Box>
      {countryIds.length > 1 && (
        <Typography className="Body-Medium-Static">
          You selected gifts:&nbsp;
          <span className="Body-Medium-Link">
            {selectedCountryNames.length > 0 ? (
              <Tooltip title={selectedCountryNames} placement="top" component="span" arrow>
                <>
                  {selectedProductsCountryIds.length} of {countryIds.length} countries
                </>
              </Tooltip>
            ) : (
              <>
                {selectedProductsCountryIds.length} of {countryIds.length} countries
              </>
            )}
          </span>
        </Typography>
      )}
      <MarketplaceNotice productsCount={productsCount} filtersCount={filtersCount} />
    </Box>
  );
};

export default memo(MultiCountryNotice);
