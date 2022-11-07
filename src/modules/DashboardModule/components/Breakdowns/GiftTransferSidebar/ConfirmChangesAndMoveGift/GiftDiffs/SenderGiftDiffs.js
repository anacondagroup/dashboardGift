import React from 'react';
import PropTypes from 'prop-types';
import { DashboardIcon } from '@alycecom/ui';
import { Box } from '@mui/material';

import { useStyles } from './useStyleGiftDiffs';

const SenderGiftDiffs = ({ diffs }) => {
  const { original, target } = diffs;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box className="Label-Table-Left-Static">ORIGINAL SENDER(S)</Box>
      {original.map((sender, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <Box key={sender.sender_full_name + i} mb={1}>
          <Box className="Body-Regular-Left-Static-Bold">{sender.sender_full_name}</Box>
          <Box className="Body-Small-Inactive">Gift in: {sender.campaign_name}</Box>
        </Box>
      ))}
      <DashboardIcon className={classes.arrowDown} icon="arrow-down" />
      <Box className="Label-Table-Left-Static">NEW SENDER</Box>
      <Box mb={1}>
        <Box className="Body-Regular-Left-Static-Bold">{target.sender_full_name}</Box>
        <Box className="Body-Small-Inactive">Admin in: {target.campaign_name}</Box>
      </Box>
    </Box>
  );
};

SenderGiftDiffs.propTypes = {
  diffs: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    original: PropTypes.object.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    target: PropTypes.object.isRequired,
  }).isRequired,
};

export default SenderGiftDiffs;
