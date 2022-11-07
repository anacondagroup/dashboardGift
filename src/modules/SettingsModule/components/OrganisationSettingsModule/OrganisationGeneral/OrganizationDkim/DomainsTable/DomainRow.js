import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, TableRow, TableCell, Typography, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { formatTestId } from '@alycecom/utils';
import { TableLoadingLabel } from '@alycecom/ui';

import { DOMAIN_DKIM_STATUS } from '../../../../../../../constants/organizationDkim.constants';

const useStyles = makeStyles(({ palette }) => ({
  tableRow: {
    '&:last-child > $tableCell': {
      borderBottom: 'none',
    },
  },
  tableCell: {},
  addButton: {
    color: palette.link.main,
  },
  removeButton: {
    color: palette.error.main,
  },
}));

const DomainRow = ({ domain, isLoading, onSelect, onRemove }) => {
  const classes = useStyles();
  const { domain: url, status } = domain;

  const statusDesc = status ? DOMAIN_DKIM_STATUS.CONNECTED : DOMAIN_DKIM_STATUS.NOT_CONNECTED;
  const statusClass = status ? 'Body-Regular-Left-Success' : 'Body-Regular-Left-Error';

  const handleSelectDomain = useCallback(() => onSelect(domain), [domain, onSelect]);
  const handleRemoveDomain = useCallback(() => onRemove(domain), [domain, onRemove]);

  return (
    <>
      <TableRow className={classes.tableRow}>
        <TableCell data-testid={formatTestId(`Dkim.Domain.Url.${url}`)} className={classes.tableCell} align="left">
          <TableLoadingLabel maxWidth={190} pr={2} isLoading={isLoading} render={() => url} />
        </TableCell>
        <TableCell data-testid={formatTestId(`Dkim.Domain.Status.${url}`)} className={classes.tableCell} align="left">
          <TableLoadingLabel
            maxWidth={190}
            pr={2}
            isLoading={isLoading}
            render={() => <Typography className={statusClass}>{statusDesc}</Typography>}
          />
        </TableCell>
        <TableCell align="right" className={classes.tableCell}>
          <TableLoadingLabel
            maxWidth={190}
            pr={2}
            isLoading={isLoading}
            render={() => (
              <Box display="flex">
                <Button
                  data-testid={formatTestId(`Dkim.Domain.Details.Button.${url}`)}
                  className={classes.addButton}
                  onClick={handleSelectDomain}
                >
                  Details
                </Button>
                <Button
                  data-testid={formatTestId(`Dkim.Domain.Remove.Button.${url}`)}
                  className={classes.removeButton}
                  onClick={handleRemoveDomain}
                >
                  Remove
                </Button>
              </Box>
            )}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

DomainRow.propTypes = {
  domain: PropTypes.shape({
    id: PropTypes.number.isRequired,
    domain: PropTypes.string.isRequired,
    status: PropTypes.bool.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default memo(DomainRow);
