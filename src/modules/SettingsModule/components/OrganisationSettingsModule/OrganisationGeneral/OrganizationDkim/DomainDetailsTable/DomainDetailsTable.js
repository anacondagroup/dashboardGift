import React, { useEffect, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory } from '@alycecom/utils';
import { LinkButton } from '@alycecom/ui';

import {
  getDomainRecords,
  getIsLoading,
  getDomain,
  getIsVerifying,
  getIsVerified,
  getIsSendEmailModalOpened,
} from '../../../../../store/organisation/dkim/details/details.selectors';
import {
  loadDomainDetailsRequest,
  verifyRequest,
  setSendEmailModalOpen,
} from '../../../../../store/organisation/dkim/details/details.actions';
import SendDkimSettingsModal from '../SendDkimSettingsModal/SendDkimSettingsModal';

import DomainDetailsRow from './DomainDetailsRow';
import DomainDetailsHeader from './DomainDetailsHeader';

const useStyles = makeStyles(({ spacing }) => ({
  icon: {
    marginRight: spacing(1),
  },
}));

const DomainDetailsTable = ({ onRemove }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const domain = useSelector(getDomain);
  const domainRecords = useSelector(getDomainRecords);
  const isLoading = useSelector(getIsLoading);
  const isVerifying = useSelector(getIsVerifying);
  const isVerified = useSelector(getIsVerified);
  const isSendEmailOpened = useSelector(getIsSendEmailModalOpened);

  const rows = useMemo(
    () =>
      fakeItemsFactory(
        domainRecords,
        isLoading,
        id => ({ type: String(id), dnsType: '', name: '', value: '', status: false }),
        3,
      ),
    [isLoading, domainRecords],
  );

  const handleVerify = useCallback(() => dispatch(verifyRequest(domain)), [dispatch, domain]);

  const handleOpenSendEmailModal = useCallback(() => dispatch(setSendEmailModalOpen(true)), [dispatch]);

  const { id: domainId } = domain || {};
  useEffect(() => {
    if (domainId) {
      dispatch(loadDomainDetailsRequest(domainId));
    }
  }, [dispatch, domainId]);

  return (
    <Box>
      <Box my={2} display="flex" alignItems="center" justifyContent="flex-start">
        <Typography>Need help with this?&nbsp;</Typography>
        <LinkButton onClick={handleOpenSendEmailModal}>
          Send email to your Network Administrator to install these records
        </LinkButton>
      </Box>
      <DomainDetailsHeader domain={domain} isVerifying={isVerifying} onVerify={handleVerify} onRemove={onRemove} />
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell align="center">Status</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(details => (
            <DomainDetailsRow
              key={`domain-record-${details.type}`}
              isVerified={isVerified}
              isLoading={isLoading}
              details={details}
            />
          ))}
        </TableBody>
      </Table>
      <SendDkimSettingsModal domainId={domainId} isOpen={isSendEmailOpened} />
    </Box>
  );
};

DomainDetailsTable.propTypes = {
  onRemove: PropTypes.func.isRequired,
};

export default memo(DomainDetailsTable);
