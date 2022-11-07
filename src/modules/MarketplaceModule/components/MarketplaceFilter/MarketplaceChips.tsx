import React, { memo, ReactElement, useCallback, useMemo } from 'react';
import { AlyceTheme, FilterChips } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@mui/styles';
import { Avatar, Box, Chip } from '@mui/material';

import { ProductFilter } from '../../store/products/products.types';
import { getSelectedCategoryIds } from '../../store/products/products.selectors';
import { getSelectedCategories } from '../../store/marketplace.selectors';
import { updateFilters } from '../../store/products/products.actions';
import { useGetCountriesOptions } from '../../hooks/useGetCountriesOptions';

export interface IMarketplaceChipsProps {
  onChange: () => void;
  disabledFilters?: ProductFilter[];
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  chipsContainer: {
    '& > *': {
      margin: spacing(0, 0.5, 1),
    },
  },
  chipRoot: {
    backgroundColor: palette.green.mountainMeadowLight,
  },
}));

const MarketplaceChips = ({ onChange, disabledFilters }: IMarketplaceChipsProps): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const categories = useSelector(getSelectedCategories);
  const { ids: countryIds, selected: countries } = useGetCountriesOptions();
  const categoryIds = useSelector(getSelectedCategoryIds);
  const isCategoriesDisabled = disabledFilters?.includes(ProductFilter.CategoryIds);
  const isCountriesDisabled = disabledFilters?.includes(ProductFilter.CountryIds);

  const handleDeleteCategory = useCallback(
    event => {
      const { id } = event.currentTarget.dataset;
      const numId = Number(id);
      if (Number.isNaN(numId)) {
        return;
      }

      dispatch(
        updateFilters({
          [ProductFilter.CategoryIds]: categoryIds.filter(cid => cid !== numId),
        }),
      );
    },
    [dispatch, categoryIds],
  );

  const handleDeleteCountry = useCallback(
    event => {
      const { id } = event.currentTarget.dataset;
      const numId = Number(id);
      if (Number.isNaN(numId)) {
        return;
      }

      dispatch(
        updateFilters({
          [ProductFilter.CountryIds]: countryIds.filter(cid => cid !== numId),
        }),
      );
    },
    [dispatch, countryIds],
  );

  const handleClearAllChips = useCallback(() => {
    onChange();
    if (!isCountriesDisabled) {
      dispatch(updateFilters({ [ProductFilter.CountryIds]: [] }));
    }
    if (!isCategoriesDisabled) {
      dispatch(updateFilters({ [ProductFilter.CategoryIds]: [] }));
    }
  }, [dispatch, onChange, isCategoriesDisabled, isCountriesDisabled]);

  const categoryChips = useMemo(
    () =>
      isCategoriesDisabled
        ? []
        : categories.map(category => (
            <Chip data-id={category.id} onDelete={handleDeleteCategory} key={category.label} label={category.label} />
          )),
    [categories, handleDeleteCategory, isCategoriesDisabled],
  );

  const countryChips = useMemo(
    () =>
      isCountriesDisabled
        ? []
        : countries.map(country => (
            <Chip
              avatar={<Avatar alt={`${country.name} flag`} src={country.image} />}
              data-id={country.id}
              onDelete={handleDeleteCountry}
              key={country.name}
              label={country.name}
              size="small"
            />
          )),
    [countries, handleDeleteCountry, isCountriesDisabled],
  );

  const chips = categoryChips.concat(countryChips);

  return (
    <Box
      className={classes.chipsContainer}
      width={1}
      display="flex"
      justifyContent="flex-start"
      alignItems="center"
      flexWrap="wrap"
    >
      <FilterChips onClearAll={handleClearAllChips} overrideClasses={{ chipRoot: classes.chipRoot }}>
        {chips}
      </FilterChips>
    </Box>
  );
};

export default memo(MarketplaceChips);
