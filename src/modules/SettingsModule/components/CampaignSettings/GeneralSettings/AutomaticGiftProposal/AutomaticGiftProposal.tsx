import React, { useState, memo, useCallback } from 'react';
import { SelectFilter, ActionButton, Icon, Tooltip, AlyceTheme } from '@alycecom/ui';
import { Box, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';
import { CommonData, CountriesFlags, GiftResearchFlowType, giftResearchFlowTypeNames } from '@alycecom/modules';
import classNames from 'classnames';

import { getIsInternational } from '../../../../store/campaign/commonData/commonData.selectors';

import GiftResearchOption from './GiftResearchOption';

export interface IAutomaticGiftProposalProps {
  value?: GiftResearchFlowType;
  isLoading?: boolean;
  onSubmit: (value?: GiftResearchFlowType) => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  disabledMenuItem: {
    cursor: 'auto',
    '&:hover': {
      backgroundColor: palette.common.white,
    },
  },
}));

const AutomaticGiftProposal = ({ value, isLoading, onSubmit }: IAutomaticGiftProposalProps): React.ReactElement => {
  const classes = useStyles();

  const [localValue, setLocalValue] = useState<GiftResearchFlowType | undefined>(value);
  const usaAndCanada = useSelector(CommonData.selectors.getNonInternationalCountries);
  const isInternational = useSelector(getIsInternational) as boolean;

  const renderValue = useCallback(option => giftResearchFlowTypeNames[option as GiftResearchFlowType] || 'None', []);

  const handleChangeResearchOption = useCallback(
    ({ researchOption }) => {
      const canSelectOption =
        !isInternational || (isInternational && researchOption === GiftResearchFlowType.instantGift);
      if (canSelectOption) {
        setLocalValue(researchOption);
      }
    },
    [setLocalValue, isInternational],
  );

  const handleSave = useCallback(() => onSubmit(localValue), [onSubmit, localValue]);

  const internationalTip = isInternational
    ? 'To be compliant with data privacy regulations research is available in US & CAN only.'
    : '';
  const usaAndCanadaFlags = (
    <Tooltip title={internationalTip} placement="top-start">
      <Box>
        <CountriesFlags countries={usaAndCanada} size="medium" />
      </Box>
    </Tooltip>
  );

  return (
    <Box display="flex" flexDirection="column" width="50%">
      <SelectFilter
        name="researchOption"
        fullWidth
        disabled={isLoading}
        margin="normal"
        onFilterChange={handleChangeResearchOption}
        label="Gift Research options"
        value={localValue}
        selectProps={{ renderValue }}
      >
        <MenuItem key={GiftResearchFlowType.instantGift} value={GiftResearchFlowType.instantGift}>
          <GiftResearchOption
            type={GiftResearchFlowType.instantGift}
            description="automatic gift proposal, no research on social media profile"
            isDefault
            countriesIcon={<Icon icon="globe" color="primary.main" />}
          />
        </MenuItem>
        <MenuItem
          className={classNames({ [classes.disabledMenuItem]: isInternational })}
          key={GiftResearchFlowType.requireResearch}
          value={GiftResearchFlowType.requireResearch}
        >
          <GiftResearchOption
            type={GiftResearchFlowType.requireResearch}
            description="research on social media profile, can take up to 2 days, no automatic gift proposal"
            countriesIcon={usaAndCanadaFlags}
            disabled={isInternational}
          />
        </MenuItem>
        <MenuItem
          className={classNames({ [classes.disabledMenuItem]: isInternational })}
          key={GiftResearchFlowType.instantGiftOrResearch}
          value={GiftResearchFlowType.instantGiftOrResearch}
        >
          <GiftResearchOption
            type={GiftResearchFlowType.instantGiftOrResearch}
            description="allow automatic gift proposal or research on social media profile, can take up to 2 days"
            countriesIcon={usaAndCanadaFlags}
            disabled={isInternational}
          />
        </MenuItem>
      </SelectFilter>
      <Box mt={2}>
        <ActionButton
          data-testid="CampaignSettings-GiftProposal-Save"
          width={100}
          onClick={handleSave}
          disabled={isLoading}
        >
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

export default memo(AutomaticGiftProposal);
