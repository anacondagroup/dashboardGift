import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Box, BoxProps } from '@mui/material';

export interface ITabPanel extends BoxProps {
  children?: React.ReactNode;
  value: number;
  index: number;
}

const TabPanel = ({ children, value, index, ...boxProps }: ITabPanel) => (
  <Box
    role="tabpanel"
    hidden={value !== index}
    id={`nav-tabpanel-${index}`}
    aria-labelledby={`nav-tab-${index}`}
    {...boxProps}
  >
    {value === index && (
      <Box p={3}>
        <Box>{children}</Box>
      </Box>
    )}
  </Box>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default memo(TabPanel);
