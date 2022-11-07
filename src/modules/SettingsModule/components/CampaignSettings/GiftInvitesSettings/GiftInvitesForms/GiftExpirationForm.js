import React, { useState, useCallback, useMemo } from 'react';
import { map } from 'ramda';
import PropTypes from 'prop-types';
import { Box, MenuItem } from '@mui/material';
import { ActionButton, SelectFilter } from '@alycecom/ui';
import { prependValueToArray } from '@alycecom/utils';

import { GIFT_EXPIRATION_PERIODS } from '../../../../../../constants/campaignSettings.constants';

const GiftExpirationForm = ({ isLoading, giftExpiration, onSave }) => {
  const [localGiftExpiration, setGiftExpiration] = useState(giftExpiration);

  const expirationPeriods = useMemo(() => prependValueToArray(giftExpiration)(GIFT_EXPIRATION_PERIODS), [
    giftExpiration,
  ]);

  const handleSave = useCallback(() => onSave(localGiftExpiration), [onSave, localGiftExpiration]);

  const handleExpirationChange = useCallback(({ giftExpiration: days }) => setGiftExpiration(days), [
    setGiftExpiration,
  ]);

  const optionsItems = useMemo(
    () =>
      map(
        value => (
          <MenuItem key={value} value={value}>
            {value} days
          </MenuItem>
        ),
        expirationPeriods,
      ),
    [expirationPeriods],
  );

  return (
    <Box display="flex" flexDirection="column">
      <Box width={1 / 2} mt={2} mb={2}>
        <SelectFilter
          disabled={isLoading}
          label="When should an unclaimed gift expire after it’s sent?"
          value={localGiftExpiration}
          name="giftExpiration"
          fullWidth
          onFilterChange={handleExpirationChange}
          renderItems={() => optionsItems}
        />
      </Box>
      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} onClick={handleSave} disabled={isLoading}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

GiftExpirationForm.propTypes = {
  giftExpiration: PropTypes.number.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

GiftExpirationForm.defaultProps = {
  isLoading: false,
};

export default GiftExpirationForm;
