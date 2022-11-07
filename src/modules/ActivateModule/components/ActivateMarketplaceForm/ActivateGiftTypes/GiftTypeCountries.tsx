import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { CommonData } from '@alycecom/modules';
import { Tooltip } from '@alycecom/ui';

import { IGiftType } from '../../../store/entities/giftTypes/giftTypes.types';

const MAX_VISIBLE_COUNTRIES = 3;

export interface IGiftTypeCountriesProps {
  giftType: IGiftType;
}

const GiftTypeCountries = ({ giftType }: IGiftTypeCountriesProps) => {
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(giftType.countryIds), [giftType]),
  );

  const visibleCountries = useMemo(
    () =>
      countries
        .slice(0, MAX_VISIBLE_COUNTRIES)
        .map(country => country.code)
        .join(', '),
    [countries],
  );
  const hiddenCountries = useMemo(
    () => countries.slice(MAX_VISIBLE_COUNTRIES).map(country => <Box key={country.id}>{country.name}</Box>),
    [countries],
  );

  return (
    <Typography className="Subcopy-Static" component="span">
      <Box component="span" display="flex" flexWrap="nowrap" width="105px">
        {visibleCountries}
        {hiddenCountries.length > 0 && (
          <>
            ,&nbsp;
            <Tooltip title={hiddenCountries} placement="top-end">
              <Typography className="Subcopy-Link">+{hiddenCountries.length}</Typography>
            </Tooltip>
          </>
        )}
      </Box>
    </Typography>
  );
};

export default memo(GiftTypeCountries);
