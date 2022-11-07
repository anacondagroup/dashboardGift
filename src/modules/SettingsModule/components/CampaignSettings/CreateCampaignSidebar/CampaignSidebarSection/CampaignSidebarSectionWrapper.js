import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import { Box, Paper } from '@mui/material';

const useStyles = makeStyles(theme => ({
  paper: {
    borderRadius: 5,
    position: 'relative',
  },
  ACTIVE: {
    minHeight: 90,
    border: `2px solid`,
    borderColor: theme.palette.green.dark,
    backgroundColor: theme.palette.common.white,
    paddingTop: 24,
    paddingBottom: 24,
  },
  COMPLETED: {
    minHeight: 90,
    border: `2px solid`,
    borderColor: theme.palette.text.disabled,
    backgroundColor: theme.palette.common.white,
    paddingTop: 24,
    paddingBottom: 24,
  },
  SKIPPED: {
    minHeight: 90,
    border: `2px solid`,
    borderColor: theme.palette.text.disabled,
    backgroundColor: theme.palette.common.white,
    paddingTop: 24,
    paddingBottom: 24,
  },
  UNTOUCHED: {
    minHeight: 67,
    border: `2px solid`,
    borderColor: theme.palette.text.disabled,
    backgroundColor: theme.palette.background.default,
    paddingTop: 18,
    paddingBottom: 18,
  },
}));

const CampaignSidebarSectionWrapper = ({ status, children }) => {
  const classes = useStyles();
  const paperElevation = useMemo(() => (status === 'ACTIVE' ? 2 : 0), [status]);

  return (
    <Box mt={2}>
      <Paper elevation={paperElevation} className={classnames(classes.paper, classes[status])}>
        {children}
      </Paper>
    </Box>
  );
};

CampaignSidebarSectionWrapper.propTypes = {
  status: PropTypes.string.isRequired,
  children: PropTypes.node,
};

CampaignSidebarSectionWrapper.defaultProps = {
  children: undefined,
};

export default CampaignSidebarSectionWrapper;
