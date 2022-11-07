import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { AlyceTheme, Button, ProductSidebar, ProductSidebarHeader } from '@alycecom/ui';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { getCountryIds, getTeamId } from '../../../store/steps/details';
import { EmbeddedTeamSettingsMarketplace } from '../../../../MarketplaceModule/components/EmbeddedMarketplace';
import { TProduct } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.types';
import { getSelectableCountyIds } from '../../../store/ui/createPage/marketplaceSidebar';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'right',
    paddingRight: spacing(5),
    borderTop: `1px solid ${palette.primary.light}`,
  },
  cancelBtn: {
    border: `1px solid ${palette.divider}`,
  },
  submitBtn: {
    marginLeft: spacing(1),
    border: `1px solid ${palette.secondary.main}`,
    '&.Mui-disabled': {
      backgroundColor: palette.background.darken,
      border: `1px solid ${palette.divider}`,
    },
  },
}));

export interface ISelectGiftSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selected: TProduct[]) => void;
  initialSelectedProducts?: TProduct[];
}

const SelectGiftSidebar = ({
  isOpen,
  onClose,
  onSelect,
  initialSelectedProducts,
}: ISelectGiftSidebarProps): JSX.Element => {
  const classes = useStyles();

  const countryIds = useSelector(getCountryIds);
  const teamId = useSelector(getTeamId);

  const [selectedProducts, setSelectedProducts] = useState<TProduct[]>([]);
  const selectedProductsCountryIds = useMemo(() => selectedProducts.map(({ countryId }) => Number(countryId)), [
    selectedProducts,
  ]);
  const selectableCountyIds = useSelector(getSelectableCountyIds);

  const handleClickProduct = useCallback(
    (product: TProduct) => {
      setSelectedProducts([...selectedProducts.filter(({ countryId }) => countryId !== product.countryId), product]);
    },
    [selectedProducts],
  );

  const countryToProductMap = useMemo(
    () =>
      selectedProducts.reduce<Record<number, TProduct>>(
        (acc, product) => ({ ...acc, [product.countryId]: product }),
        {},
      ),
    [selectedProducts],
  );
  const checkIsProductSelected = useCallback(
    ({ id, countryId, denomination }: TProduct) => {
      const countryProduct = countryToProductMap[countryId];
      if (!countryProduct) {
        return false;
      }
      return id === countryProduct.id && denomination?.price === countryProduct.denomination?.price;
    },
    [countryToProductMap],
  );

  const handleSubmit = useCallback(() => {
    onSelect(selectedProducts);
    onClose();
  }, [onSelect, selectedProducts, onClose]);

  const handleCancel = useCallback(() => {
    setSelectedProducts([]);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen && initialSelectedProducts) {
      setSelectedProducts(initialSelectedProducts);
    }
  }, [isOpen, initialSelectedProducts]);

  return (
    <ProductSidebar isOpen={isOpen} onClose={handleCancel} width={800}>
      <Box display="flex" flexDirection="column" bgcolor="common.white" height="max(100%, 100vh)">
        <ProductSidebarHeader onClose={handleCancel}>
          <Box ml={2} fontSize="20px">
            Choose Leading Gift{countryIds && countryIds.length === 1 ? '' : `s`}
          </Box>
        </ProductSidebarHeader>
        {countryIds?.length && teamId && (
          <>
            <Box pt={4} height="calc(100vh - 186px)" overflow="hidden">
              <EmbeddedTeamSettingsMarketplace
                countryIds={countryIds}
                teamId={teamId as number}
                onClickProduct={handleClickProduct}
                showCountry
                columnsCount={4}
                columnWidth={190}
                checkIsProductSelected={checkIsProductSelected}
                selectedProductsCountryIds={selectedProductsCountryIds}
                selectableCountyIds={selectableCountyIds}
              />
            </Box>
            <Box height={106} className={classes.footer}>
              <Button onClick={handleCancel} className={classes.cancelBtn} color="default" variant="contained">
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={selectedProducts.length === 0}
                className={classes.submitBtn}
                color="primary"
                variant="contained"
              >
                {countryIds.length > 1
                  ? `Select gifts (${selectedProducts.length}/${countryIds.length})`
                  : `Select gift`}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </ProductSidebar>
  );
};

export default memo(SelectGiftSidebar);
