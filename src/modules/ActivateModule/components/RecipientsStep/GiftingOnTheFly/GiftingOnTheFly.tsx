import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';
import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { StateStatus } from '@alycecom/utils';
import { GiftingOnTheFly as GiftingOnTheFlyModule } from '@alycecom/modules';
import { Tooltip } from '@alycecom/ui';

import {
  getGiftingOnTheFlyStatus,
  getIsGiftingOnTheFlyEnabled,
} from '../../../store/steps/recipients/giftingOnTheFly/giftingOnTheFly.selectors';
import { updateGiftingOnTheFlyRequest } from '../../../store/steps/recipients/giftingOnTheFly/giftingOnTheFly.actions';
import InfoTooltip from '../../InfoTooltip';

export interface IGiftingOnTheFlyProps {
  disabled?: boolean;
  disabledReason?: string;
}

const GiftingOnTheFly = ({ disabled = false, disabledReason = '' }: IGiftingOnTheFlyProps): JSX.Element => {
  const dispatch = useDispatch();

  const isGiftingOnTheFlyEnabled = useSelector(getIsGiftingOnTheFlyEnabled);
  const loadStatus = useSelector(getGiftingOnTheFlyStatus);

  const [isChecked, setIsChecked] = useState(false);

  const SafeTooltip = disabled && disabledReason ? Tooltip : Fragment;

  useEffect(() => {
    if (loadStatus === StateStatus.Fulfilled || loadStatus === StateStatus.Rejected) {
      setIsChecked(isGiftingOnTheFlyEnabled);
    }
  }, [loadStatus, isGiftingOnTheFlyEnabled]);

  const handleChange = useCallback(
    (newIsChecked: boolean) => {
      setIsChecked(newIsChecked);
      dispatch(updateGiftingOnTheFlyRequest({ isEnabled: newIsChecked }));
    },
    [dispatch],
  );

  return (
    <Box>
      <Typography className="Body-Regular-Left-Static-Bold">Gifting on the Fly</Typography>
      <Box display="flex" alignItems="center">
        <FormControlLabel
          disabled={disabled}
          label={
            <Typography className="Body-Regular-Left-Static">
              Allow team members to quick-add recipients from the{' '}
              <a href={GiftingOnTheFlyModule.routes.ENTRY_POINT} target="_blank" rel="noreferrer">
                Gifting on the Fly
              </a>{' '}
              page
            </Typography>
          }
          control={
            <SafeTooltip title={disabledReason} arrow placement="bottom-start">
              <Checkbox
                disabled={disabled}
                name="giftingOnTheFlyEnabled"
                checked={isChecked}
                onChange={e => handleChange(e.target.checked)}
                color="primary"
              />
            </SafeTooltip>
          }
        />
        <InfoTooltip title="Easily add additional recipients to campaigns with Gifting on the Fly! Enabling this feature will allow your team to add new recipients to campaigns and receive gift links immediately for their outreach without the need for campaign managers to upload contacts to Marketo or Alyce." />
      </Box>
    </Box>
  );
};

export default memo(GiftingOnTheFly);
