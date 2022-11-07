import React, { memo } from 'react';
import { Marketplace } from '@alycecom/modules';
import { Box, Collapse, Theme } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';

import { TProspectingDefaultGift } from '../../../../../store/prospectingCampaign/prospectingCampaign.types';

export interface ILeadingGiftProps {
  value: TProspectingDefaultGift | null;
  onOpenMarketplace?: () => void;
  onRemove?: () => void;
  disabled?: boolean;
}

const styles = {
  removeButton: {
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

const LeadingGift = ({ value, onOpenMarketplace, onRemove, disabled = false }: ILeadingGiftProps): JSX.Element => {
  const isSet = !!value?.id;
  return (
    <Box display="flex" flexDirection="column" height={isSet ? 1 : undefined}>
      <Box maxWidth={185} flex="1 1 auto" height={isSet ? 1 : 0}>
        <Collapse in={isSet} mountOnEnter unmountOnExit>
          {isSet && (
            <Marketplace.ConnectedSelectableProductItem
              mb={2}
              id={value?.id as number}
              denomination={value?.denomination}
            />
          )}
        </Collapse>
      </Box>
      {(onRemove || onOpenMarketplace) && (
        <Box flex="0 0 auto" display="flex" flexDirection="column">
          {onOpenMarketplace && (
            <Button
              disabled={disabled}
              fullWidth
              borderColor="divider"
              onClick={onOpenMarketplace}
              endIcon={<Icon icon="gift" />}
            >
              {isSet ? 'Edit' : 'Select'} Gift
            </Button>
          )}
          {onRemove && (
            <Collapse in={isSet} mountOnEnter unmountOnExit>
              <Button fullWidth onClick={onRemove} variant="text" sx={styles.removeButton} disableRipple>
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
