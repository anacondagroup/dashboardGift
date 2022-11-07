import React from 'react';
import PropTypes from 'prop-types';
import { DashboardIcon } from '@alycecom/ui';
import { fromSnakecase2Headline } from '@alycecom/utils';
import { Box } from '@mui/material';

import { useStyles } from './useStyleGiftDiffs';

const SettingsGiftDiffs = ({ diffs }) => {
  const { original, target } = diffs;
  const classes = useStyles();
  return (
    <Box className={classes.container}>
      <Box className="Label-Table-Left-Static">ORIGINAL SETTINGS</Box>
      {original.map(item => (
        <Box key={item.campaign_name} mb={1}>
          <Box className="Body-Regular-Left-Static-Bold">{item.campaign_name}</Box>
          {Object.keys(item.diffs).map(key => (
            <Box key={key} className="Body-Small-Inactive">
              {fromSnakecase2Headline(key)}: {item.diffs[key]}
            </Box>
          ))}
        </Box>
      ))}
      <DashboardIcon className={classes.arrowDown} icon="arrow-down" />
      <Box className="Label-Table-Left-Static">NEW SETTINGS</Box>
      <Box mb={1}>
        <Box className="Body-Regular-Left-Static-Bold">{target.campaign_name}</Box>
        {Object.keys(target.diffs).map(key => (
          <Box key={key} className="Body-Small-Inactive">
            {fromSnakecase2Headline(key)}: {target.diffs[key]}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

SettingsGiftDiffs.propTypes = {
  diffs: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    original: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    target: PropTypes.object.isRequired,
  }).isRequired,
};

export default SettingsGiftDiffs;
