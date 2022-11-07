import React, { memo, ReactElement, useCallback, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { useWindowScroll } from 'react-use';
import { AlyceTheme, Icon } from '@alycecom/ui';
import classNames from 'classnames';
import { EntityId } from '@alycecom/utils';

import { ProductFilter } from '../../store/products/products.types';
import { exportProductsRequest, updateFilters } from '../../store/products/products.actions';
import { fetchProductCategories } from '../../store/entities/productCategories/productCategories.actions';
import { FilterItem, FilterLayout } from '../FiltersLayout';

import MarketplaceSorting from './MarketplaceSorting';
import MarketplaceSearch from './MarketplaceSearch';
import MarketplaceCountriesFilter from './MarketplaceCountriesFilter';
import MarketplaceChips from './MarketplaceChips';
import CategoryIds from './fields/CategoryIds';

export interface IMarketplaceFilterProps {
  disabledFilters?: ProductFilter[];
  canExport?: boolean;
  onExport?: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  sticky: {
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.5)',
  },
  categoriesPopper: {
    zIndex: zIndex.appBar,
  },
  exportButton: {
    color: palette.link.main,
    width: 280,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: spacing(1),
  },
}));

const MarketplaceFilter = ({
  disabledFilters = [],
  canExport = true,
  onExport,
}: IMarketplaceFilterProps): ReactElement => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const goBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleOnChangeFilters = useCallback(
    (selectedValues, name: string) => {
      goBackToTop();
      dispatch(
        updateFilters({
          [name as ProductFilter]: selectedValues,
        }),
      );
    },
    [goBackToTop, dispatch],
  );

  const handleChangeCountries = useCallback(
    (countryIds: EntityId[]) => {
      goBackToTop();
      dispatch(
        updateFilters({
          [ProductFilter.CountryIds]: countryIds,
        }),
      );
    },
    [goBackToTop, dispatch],
  );

  const { y } = useWindowScroll();

  const handleExport = useCallback(() => {
    dispatch(exportProductsRequest());
    if (onExport) {
      onExport();
    }
  }, [dispatch, onExport]);

  useEffect(() => {
    dispatch(fetchProductCategories());
  }, [dispatch]);

  return (
    <Box
      className={classNames({ [classes.sticky]: y > 230 })}
      data-testid="MarketplaceFilter"
      position="sticky"
      top={80}
      left={0}
      zIndex={10}
      pt={2}
      bgcolor="common.white"
    >
      <FilterLayout
        title={<Typography className="Body-Regular-Center-Chambray-Bold">Narrow Results</Typography>}
        actions={<MarketplaceSorting onChange={goBackToTop} />}
        afterFilters={
          <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
            <MarketplaceChips disabledFilters={disabledFilters} onChange={goBackToTop} />
            {canExport && (
              <Button onClick={handleExport} className={classes.exportButton}>
                <Icon className={classes.icon} icon="envelope" color="link.main" />
                Export Results as .XLS
              </Button>
            )}
          </Box>
        }
      >
        <>
          <FilterItem size="medium">
            <CategoryIds onChange={handleOnChangeFilters} />
          </FilterItem>
          <FilterItem size="medium">
            <MarketplaceCountriesFilter
              onChange={handleChangeCountries}
              disabled={disabledFilters?.includes(ProductFilter.CountryIds)}
            />
          </FilterItem>
          <FilterItem size="large">
            <MarketplaceSearch onChange={goBackToTop} />
          </FilterItem>
        </>
      </FilterLayout>
    </Box>
  );
};

export default memo(MarketplaceFilter);
