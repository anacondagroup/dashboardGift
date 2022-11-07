import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Typography, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

import { DOMAIN_DKIM_STATUS } from '../../../../../../../constants/organizationDkim.constants';

const useStyles = makeStyles(({ palette }) => ({
  verifyButton: {
    color: palette.link.main,
  },
  removeButton: {
    color: palette.error.main,
  },
}));

const DomainDetailsHeader = ({ domain, isVerifying, onVerify, onRemove }) => {
  const classes = useStyles();
  const { domain: url, status } = domain;

  const statusDesc = status ? DOMAIN_DKIM_STATUS.CONNECTED : DOMAIN_DKIM_STATUS.NOT_CONNECTED;
  const statusClass = status ? 'Body-Regular-Left-Success' : 'Body-Regular-Left-Error';

  const handleRemoveDomain = useCallback(() => onRemove(domain), [domain, onRemove]);

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Box mr={3}>
          <Typography className="Body-Regular-Left-Static-Bold">
            Domain URL: <span className="Body-Regular-Left-Chambray">{url}</span>
          </Typography>
        </Box>
        <Typography className="Body-Regular-Left-Static-Bold">
          Status: <span className={statusClass}>{statusDesc}</span>
        </Typography>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="flex-end">
        <Button
          className={classes.verifyButton}
          endIcon={isVerifying ? <DashboardIcon spin color="inherit" icon="spinner" /> : ''}
          disabled={isVerifying}
          onClick={onVerify}
        >
          Verify
        </Button>
        <Button className={classes.removeButton} disabled={isVerifying} onClick={handleRemoveDomain}>
          Remove DKIM
        </Button>
      </Box>
    </Box>
  );
};

DomainDetailsHeader.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  domain: PropTypes.object.isRequired,
  isVerifying: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
};

DomainDetailsHeader.defaultProps = {
  isVerifying: false,
};

export default memo(DomainDetailsHeader);
