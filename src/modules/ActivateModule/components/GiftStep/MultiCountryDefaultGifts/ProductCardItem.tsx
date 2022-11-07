import React, { useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, Icon, MarketplaceProductImage, NumberFormat, Tooltip } from '@alycecom/ui';
import { useSelector } from 'react-redux';
import { CommonData } from '@alycecom/modules';
import { isValidImage } from '@alycecom/utils';

import { TProduct } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.types';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    width: 184,
    height: 184,
    borderColor: palette.additional.chambray10,
    borderStyle: 'solid',
    borderWidth: '1px',
    backgroundColor: palette.common.white,
    borderRadius: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    '&:hover $actionBox': {
      display: 'flex',
    },
  },
  actionBox: {
    display: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, .82)',
    borderColor: palette.link.main,
    borderStyle: 'solid',
    borderWidth: '2px',
    borderRadius: 5,
  },
  image: {
    height: '70%',
    objectFit: 'contain',
    overflow: 'hidden',
    borderRadius: '5px',
    margin: spacing(1),
    cursor: 'default',
  },
  flagImage: {
    flex: '0 0 18px',
    height: 18,
    borderRadius: '50%',
    display: 'inline-block',
    overflow: 'hidden',
    '& > img': {
      height: '100%',
    },
  },
  productName: {
    fontSize: 12,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

interface IProductCardItemProps {
  product: TProduct;
  onChangeGift?: (countryId: number) => void;
}

const ProductCardItem = ({ product, onChangeGift }: IProductCardItemProps): JSX.Element => {
  const classes = useStyles();

  const { countryId, image, name, provider, localPrice } = product;
  const { image: flag } = useSelector(useMemo(() => CommonData.selectors.makeGetCountryById(countryId), [countryId]));

  const handleClick = useCallback(() => {
    if (onChangeGift) {
      onChangeGift(countryId);
    }
  }, [onChangeGift, countryId]);

  return (
    <Box className={classes.root}>
      <Box className={classes.image}>
        <MarketplaceProductImage src={image || ''} isDefaultCursor />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-around" mr={1} ml={1}>
        <Box>
          <Box whiteSpace="nowrap" width={140}>
            <Tooltip title={name} placement="top" arrow>
              <Typography className={classes.productName}>{name}</Typography>
            </Tooltip>
          </Box>
          <Box fontSize={10} color="grey.main">
            {provider}
          </Box>
          <Box fontSize={14} fontWeight="bold">
            <NumberFormat format={`${localPrice?.currencySign}0,0.00`}>{localPrice?.price}</NumberFormat>
          </Box>
        </Box>
        <Box className={classes.flagImage} ml={1}>
          {flag && isValidImage(flag) && <img src={flag} alt="Product country" />}
        </Box>
      </Box>
      {onChangeGift && (
        <Box className={classes.actionBox}>
          <Button onClick={handleClick} borderColor="divider" endIcon={<Icon icon="gift" />}>
            Change Gift
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ProductCardItem;
