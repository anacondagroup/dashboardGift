import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper } from '@mui/material';
import { FlatButton } from '@alycecom/ui';

const StepWrapper = ({ children, goBackText, onGoBack, goBackDisabled }) => (
  <>
    {goBackText && (
      <Box mt={1} mb={3}>
        <FlatButton icon="arrow-left" onClick={onGoBack} disabled={goBackDisabled}>
          {goBackText}
        </FlatButton>
      </Box>
    )}
    <Paper>
      <Box p={2} pt={3} pb={3}>
        {children}
      </Box>
    </Paper>
  </>
);
StepWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  goBackText: PropTypes.string,
  onGoBack: PropTypes.func,
  goBackDisabled: PropTypes.bool,
};
StepWrapper.defaultProps = {
  goBackText: '',
  onGoBack: () => {},
  goBackDisabled: false,
};

export default StepWrapper;
