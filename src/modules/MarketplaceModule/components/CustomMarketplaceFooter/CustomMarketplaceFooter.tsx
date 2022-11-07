import React, { memo } from 'react';
import { Box, Fade, Slide, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Button, DateFormat, Icon } from '@alycecom/ui';
import { useSelector } from 'react-redux';

import { useCustomMarketplace } from '../../hooks/useCustomMarketplace';
import { MarketplaceMode } from '../../types';
import {
  getCustomMarketplaceCreatedAt,
  getCustomMarketplaceCreatedBy,
  getCustomMarketplaceName,
  getCustomMarketplaceProductsCount,
  getCustomMarketplaceUpdatedAt,
  getCustomMarketplaceUpdatedBy,
  getIsLoading,
} from '../../store/customMarketplace/customMarketplace.selectors';
import { useTrackCustomMarketplaceModeChanged } from '../../hooks/useTrackCustomMarketplace';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  root: {
    backgroundColor: palette.divider,
    position: 'sticky',
    bottom: 0,
    padding: spacing(0, 2),
    boxShadow: `0 -1px 4px 0 rgb(0 0 0 / 50%)`,
  },
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 1240,
    margin: spacing(0, 'auto'),
    padding: spacing(1.5, 0),
  },
  title: {
    color: palette.text.primary,
    fontSize: '1.125rem',
    fontWeight: 700,
  },
  subtitle: {
    color: palette.text.primary,
    fontSize: '0.875rem',
  },
}));

const CustomMarketplaceFooter = (): JSX.Element => {
  const classes = useStyles();
  const count = useSelector(getCustomMarketplaceProductsCount);
  const isLoading = useSelector(getIsLoading);
  const marketplaceName = useSelector(getCustomMarketplaceName);
  const createdAt = useSelector(getCustomMarketplaceCreatedAt);
  const updatedAt = useSelector(getCustomMarketplaceUpdatedAt);
  const createdBy = useSelector(getCustomMarketplaceCreatedBy);
  const updatedBy = useSelector(getCustomMarketplaceUpdatedBy);

  const { isEdit, setMode } = useCustomMarketplace();
  const trackModeChanged = useTrackCustomMarketplaceModeChanged();

  const handleClickPreview = () => {
    setMode(MarketplaceMode.Preview);
    trackModeChanged(MarketplaceMode.Preview);
  };

  return (
    <Slide in direction="up" mountOnEnter unmountOnExit>
      <Box className={classes.root}>
        <Box className={classes.container}>
          <Box>
            <Box className={classes.title}>
              {isLoading ? (
                <Skeleton width={250} />
              ) : (
                <>
                  {marketplaceName} | {count} Gifts
                </>
              )}
            </Box>
            <Box className={classes.subtitle}>
              {isLoading ? (
                <Skeleton width={500} />
              ) : (
                <>
                  Created by {createdBy.firstName} {createdBy.lastName} on&nbsp;
                  <DateFormat value={createdAt} format="MM/DD/YYYY" />
                  {updatedAt && updatedBy && (
                    <>
                      {' '}
                      | Last edited by {updatedBy.firstName} {updatedBy.lastName} on&nbsp;
                      <DateFormat value={updatedAt} format="MM/DD/YYYY" />
                    </>
                  )}
                </>
              )}
            </Box>
          </Box>
          <Fade in={isEdit} unmountOnExit mountOnEnter>
            <div>
              <Button startIcon={<Icon icon="eye" />} onClick={handleClickPreview} color="secondary">
                Preview Marketplace
              </Button>
            </div>
          </Fade>
        </Box>
      </Box>
    </Slide>
  );
};

export default memo(CustomMarketplaceFooter);
