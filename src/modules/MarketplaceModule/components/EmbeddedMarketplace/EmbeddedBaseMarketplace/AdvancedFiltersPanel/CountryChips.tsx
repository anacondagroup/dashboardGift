import { CommonData } from '@alycecom/modules';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, Chip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { EntityId } from '@alycecom/utils';
import { AlyceTheme, LinkButton } from '@alycecom/ui';
import classNames from 'classnames';
import CloseIcon from '@mui/icons-material/Close';

import { ProductFilter } from '../../../../store/products/products.types';
import { updateFilters } from '../../../../store/products/products.actions';
import { getSelectedCountries } from '../../../../store/products/products.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  chip: {
    color: palette.background.default,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: palette.grey.chambray50,
    '& svg, & svg:hover': {
      color: palette.background.default,
    },
    marginRight: spacing(1),
    marginBottom: spacing(1),
  },
  chipSelected: {
    backgroundColor: palette.green.mountainMeadowLight,
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: spacing(1),
  },
}));

const DEFAULT_VISIBLE_CHIPS = 4;

export interface ICountryChipsProps {
  selectedProductsCountryIds: EntityId[];
}

const CountryChips = ({ selectedProductsCountryIds }: ICountryChipsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const countryIds = useSelector(getSelectedCountries);
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountriesByIds(countryIds as number[]), [countryIds]),
  );

  const handleDelete = useCallback(
    event => {
      const { id } = event.currentTarget.dataset;
      const deletedId = Number(id);
      if (Number.isNaN(deletedId)) {
        return;
      }
      dispatch(
        updateFilters({
          [ProductFilter.CountryIds]: countryIds.filter(countryId => countryId !== deletedId),
        }),
      );
    },
    [dispatch, countryIds],
  );

  const [showAll, setShowAll] = useState(false);
  const visibleCountries = showAll ? countries : countries.slice(0, DEFAULT_VISIBLE_CHIPS);
  const hiddenCountries = showAll ? [] : countries.slice(DEFAULT_VISIBLE_CHIPS);

  const handleShowMore = useCallback(() => setShowAll(true), []);
  const handleShowLess = useCallback(() => setShowAll(false), []);

  const isProductSelected = useCallback(country => selectedProductsCountryIds.includes(country.id), [
    selectedProductsCountryIds,
  ]);

  return (
    <Box display="flex" flexWrap="wrap">
      {visibleCountries.map(country => (
        <Chip
          avatar={<Avatar alt={`${country.name} flag`} src={country.image} />}
          label={isProductSelected(country) ? `${country.name} (1)` : country.name}
          onDelete={handleDelete}
          key={country.name}
          size="medium"
          deleteIcon={<CloseIcon data-id={country.id} />}
          className={classNames(classes.chip, { [classes.chipSelected]: isProductSelected(country) })}
        />
      ))}
      {hiddenCountries.length > 0 && (
        <LinkButton onClick={handleShowMore} className={classes.linkButton}>
          Show more
        </LinkButton>
      )}
      {visibleCountries.length > DEFAULT_VISIBLE_CHIPS && (
        <LinkButton onClick={handleShowLess} className={classes.linkButton}>
          Show less
        </LinkButton>
      )}
    </Box>
  );
};

export default memo(CountryChips);
