import React, { useCallback, useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BaseSettingsItem } from '@alycecom/modules';
import { AlyceTheme } from '@alycecom/ui';

import { setDisableCampaign } from '../../../store/campaign/general/general.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  switch: {
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: palette.error.light,
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: palette.red.light,
    },
  },
}));

export interface IDisableCampaignProps {
  campaignId: number;
  disabled: boolean;
  isLoading: boolean;
  description: string;
}

const DisableCampaign = ({ campaignId, disabled, isLoading, description }: IDisableCampaignProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [value, setValue] = useState(disabled);

  useEffect(() => {
    if (disabled !== value) {
      setValue(disabled);
    }
  }, [disabled, value]);

  const onDisableToggle = useCallback(() => {
    dispatch(setDisableCampaign({ campaignId, isDisabled: !value }));
    setValue(!value);
  }, [campaignId, dispatch, value]);

  return (
    <BaseSettingsItem
      title="Disable campaign"
      description={description}
      isLoading={isLoading}
      value={value ? 'Disabled' : 'Enabled'}
      controls={
        <Switch
          className={classes.switch}
          disabled={isLoading}
          checked={value}
          onChange={onDisableToggle}
          inputProps={{ 'aria-label': 'Toggle campaign disabling setting' }}
          color="primary"
        />
      }
    />
  );
};

export default memo(DisableCampaign);
