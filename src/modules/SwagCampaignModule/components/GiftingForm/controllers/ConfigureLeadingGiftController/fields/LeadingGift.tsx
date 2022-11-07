import React, { memo } from 'react';
import { Marketplace } from '@alycecom/modules';
import { Box, Collapse } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';

import { TSwagDefaultGift } from '../../../../../store/swagCampaign/swagCampaign.types';

export interface ILeadingGiftProps {
  value: TSwagDefaultGift | null;
  onOpenMarketplace?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const styles = {
  button: {
    maxWidth: 200,
  },
  removeButton: {
    color: 'grey.main',
  },
} as const;

const LeadingGift = ({ value, onOpenMarketplace, onRemove, disabled = false }: ILeadingGiftProps): JSX.Element => {
  const isSet = !!value?.productId;
  return (
    <Box display="flex" flexDirection="column" height={isSet ? 1 : undefined}>
      <Box maxWidth={185} flex="1 1 auto" height={isSet ? 1 : 0}>
        <Collapse in={isSet} mountOnEnter unmountOnExit>
          {isSet && (
            <Marketplace.ConnectedSelectableProductItem
              mb={2}
              id={value?.productId as number}
              denomination={value?.denomination}
            />
          )}
        </Collapse>
      </Box>
      {(onRemove || onOpenMarketplace) && (
        <Box flex="0 0 auto" display="flex" flexDirection="column">
          {onOpenMarketplace && (
            <Button
              sx={styles.button}
              disabled={disabled}
              borderColor="divider"
              onClick={onOpenMarketplace}
              endIcon={<Icon icon="gift" />}
            >
              {isSet ? 'Edit' : 'Select'} Gift
            </Button>
          )}
          {value && (
            <Collapse in={isSet} mountOnEnter unmountOnExit>
              <Button
                fullWidth
                onClick={onRemove}
                variant="text"
                sx={[styles.button, styles.removeButton]}
                disableRipple
              >
                Remove
              </Button>
            </Collapse>
          )}
        </Box>
      )}
    </Box>
  );
};

export default memo(LeadingGift);
