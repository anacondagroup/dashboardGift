import React, { memo, ReactElement } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { GiftResearchFlowType, giftResearchFlowTypeNames } from '@alycecom/modules';

const useStyles = makeStyles({
  description: {
    whiteSpace: 'normal',
  },
});

export interface IGiftResearchOptionProps {
  type: GiftResearchFlowType;
  description: string;
  isDefault?: boolean;
  disabled?: boolean;
  countriesIcon?: ReactElement;
}

const GiftResearchOption = ({
  type,
  description,
  isDefault = false,
  disabled = false,
  countriesIcon,
}: IGiftResearchOptionProps): React.ReactElement => {
  const classes = useStyles();
  const name = giftResearchFlowTypeNames[type];
  return (
    <Box
      width={1}
      flexWrap="wrap"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      data-testid={`AutomaticGiftProposal.GiftResearchOption.${type}`}
    >
      <Box>
        <Typography
          className={classNames({
            'Body-Regular-Left-Chambray-Bold': !disabled,
            'Body-Regular-Left-Inactive-Bold': disabled,
          })}
        >
          {name} {isDefault && <span className="Body-Regular-Left-Static">- default for new campaigns</span>}
        </Typography>
        <Typography
          className={classNames(classes.description, {
            'Body-Regular-Left-Static': !disabled,
            'Body-Regular-Left-Inactive': disabled,
          })}
        >
          {description}
        </Typography>
      </Box>
      <Box>{countriesIcon}</Box>
    </Box>
  );
};

export default memo(GiftResearchOption);
