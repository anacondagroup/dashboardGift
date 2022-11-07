import React, { useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TableRow, TableCell, Box, Typography, Tooltip } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon, CopyToClipboardButton, TableLoadingLabel } from '@alycecom/ui';

import { DOMAIN_DKIM_STATUS } from '../../../../../../../constants/organizationDkim.constants';

const useStyles = makeStyles(({ palette, spacing }) => ({
  tableRow: {
    '&:last-child > $tableCell': {
      borderBottom: 'none',
    },
  },
  warningCell: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  tableCell: {
    verticalAlign: 'top',
  },
  removeButton: {
    color: palette.error.main,
  },
  icon: {
    marginRight: spacing(1),
  },
  error: {
    wordBreak: 'break-all',
  },
}));

const DomainDetailsRow = ({ details, isVerified, isLoading }) => {
  const classes = useStyles();
  const { type, dnsType, name, value, status } = details;

  const tdClass = classNames(classes.tableCell, 'Body-Small-Static');
  const showVerificationError = isVerified && !status;

  const errorMessage = useMemo(() => {
    if (!showVerificationError) return '';
    if (type === 'dkim') {
      return `Expected ${dnsType} record at “${name}” to match ${value}: no such host`;
    }
    return `Unable to lookup ${dnsType} record for “${name}”`;
  }, [showVerificationError, type, name, dnsType, value]);

  const statusIconProps = useMemo(() => {
    if (isVerified && status) {
      return { icon: 'check', color: 'green.main', tooltip: DOMAIN_DKIM_STATUS.CONNECTED };
    }
    if (isVerified && !status) {
      return { icon: 'ban', color: 'error.main', tooltip: DOMAIN_DKIM_STATUS.NOT_CONNECTED };
    }
    return { icon: 'exclamation-circle', color: 'orange.main', tooltip: 'Pending' };
  }, [status, isVerified]);

  return (
    <>
      <TableRow className={classes.tableRow}>
        <TableCell align="center" className={tdClass} data-testid={`DkimDetailsStatus${type}`}>
          <TableLoadingLabel
            isLoading={isLoading}
            maxWidth={300}
            render={() => (
              <Tooltip placement="top-start" title={statusIconProps.tooltip}>
                <Box>
                  <DashboardIcon size="sm" {...statusIconProps} />
                </Box>
              </Tooltip>
            )}
          />
        </TableCell>
        <TableCell align="left" className={tdClass} data-testid={`DkimDetailsDnsType${type}`}>
          <TableLoadingLabel isLoading={isLoading} maxWidth={300} render={() => dnsType} />
        </TableCell>
        <TableCell align="left" className={tdClass}>
          <TableLoadingLabel
            isLoading={isLoading}
            maxWidth={400}
            render={() => (
              <Box display="flex" justifyContent="flex-start">
                <Box>{name}</Box>
                <Box display="inline-flex" ml={1}>
                  <CopyToClipboardButton data-testid={`DkimDetailsName${type}`} title="" value={name} />
                </Box>
              </Box>
            )}
          />
        </TableCell>
        <TableCell align="left" className={tdClass}>
          <TableLoadingLabel
            isLoading={isLoading}
            wordBreak="break-all"
            render={() => (
              <Box display="flex" justifyContent="flex-start">
                <Box>{value}</Box>
                <Box display="inline-flex" ml={1}>
                  <CopyToClipboardButton data-testid={`DkimDetailsValue${type}`} title="" value={value} />
                </Box>
              </Box>
            )}
          />
        </TableCell>
      </TableRow>
      {showVerificationError && (
        <TableRow>
          <TableCell className={classes.warningCell} colSpan={4}>
            <Box px={2} py={3} bgcolor="orange.superLight">
              <Box mb={2} display="flex" alignItems="center" justifyContent="flex-start">
                <DashboardIcon className={classes.icon} color="orange.main" icon="exclamation-circle" />
                <Typography className="Subcopy-Static Alt">
                  We received the following error when validating the record
                </Typography>
              </Box>
              <Box px={1} py={1} ml={3.5} bgcolor="common.white">
                <Typography className={classNames('Body-Regular-Left-Static', classes.error)}>
                  {errorMessage}
                </Typography>
              </Box>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

DomainDetailsRow.propTypes = {
  details: PropTypes.shape({
    type: PropTypes.string.isRequired,
    dnsType: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }).isRequired,
  isVerified: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool,
};

DomainDetailsRow.defaultProps = {
  isLoading: false,
};

export default memo(DomainDetailsRow);
