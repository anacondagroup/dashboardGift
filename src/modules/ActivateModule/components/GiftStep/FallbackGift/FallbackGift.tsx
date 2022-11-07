import React, { useCallback } from 'react';
import { Box, BoxProps, Typography } from '@mui/material';
import { Icon } from '@alycecom/ui';
import { useModalState } from '@alycecom/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';

import InfoTooltip from '../../InfoTooltip';
import ActionButton from '../../ActionButton';
import SelectGiftSidebar from '../SelectGiftSidebar/SelectGiftSidebar';
import { getFallbackGift, updateAcceptOnlyFallbackGift } from '../../../store/steps/gift';
import { getActivateModuleParams } from '../../../store/activate.selectors';
import { TProduct } from '../../../store/entities/defaultGiftProducts/defaultGiftProducts.types';

const FallbackGift = (rootProps: BoxProps): JSX.Element => {
  const dispatch = useDispatch();
  const fallbackGift = useSelector(getFallbackGift);
  const { isBuilderMode } = useSelector(getActivateModuleParams);
  const { isOpen, handleOpen, handleClose } = useModalState();

  const handleSelectFallbackGift = useCallback(
    ([{ id, denomination }]: TProduct[]) => {
      dispatch(updateAcceptOnlyFallbackGift({ productId: id, denomination: denomination?.price }));
    },
    [dispatch],
  );

  return (
    <Box {...rootProps}>
      {isBuilderMode && (
        <Box display="flex" alignItems="center">
          <Typography className="Body-Regular-Left-Static-Bold">
            (Optional) Set a Fallback Gift <span>*</span>
          </Typography>
          <Box ml={1}>
            <InfoTooltip title="In the event that your Leading Gift goes out of stock, you can set a Fallback Gift that will automatically take its place. (You will also receive a notification about the gift being out of stock, and may also change your leading gift at any time after campaign creation.)" />
          </Box>
        </Box>
      )}
      {fallbackGift && (
        <Box mt={2}>
          <CampaignSettings.DefaultGift productId={fallbackGift.productId} denomination={fallbackGift.denomination} />
        </Box>
      )}
      {isBuilderMode && (
        <Box mt={2}>
          <ActionButton variant="outlined" onClick={handleOpen} endIcon={<Icon icon="gift" />}>
            {fallbackGift ? 'Change Gift' : 'Select Gift'}
          </ActionButton>
        </Box>
      )}
      <SelectGiftSidebar onSelect={handleSelectFallbackGift} isOpen={isOpen} onClose={handleClose} />
    </Box>
  );
};

export default FallbackGift;
