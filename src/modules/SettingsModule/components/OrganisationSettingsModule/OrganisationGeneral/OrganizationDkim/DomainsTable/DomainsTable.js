import React, { useCallback, useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory } from '@alycecom/utils';

import {
  getDomains,
  getIsLoaded,
  getIsLoading,
} from '../../../../../store/organisation/dkim/domains/domains.selectors';
import { loadDomainsRequest, resetError } from '../../../../../store/organisation/dkim/domains/domains.actions';
import notFoundDomains from '../../../../../../../assets/images/not-found-product.svg';
import { setDomain } from '../../../../../store/organisation/dkim/details/details.actions';
import AddDomainForm from '../AddDomainForm/AddDomainForm';

import DomainRow from './DomainRow';

const useStyles = makeStyles(({ spacing }) => ({
  icon: {
    marginRight: spacing(1),
  },
}));

const DomainsTable = ({ onRemove }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const domains = useSelector(getDomains);
  const isLoaded = useSelector(getIsLoaded);
  const isLoading = useSelector(getIsLoading);

  const hasNoDomains = isLoaded && domains.length === 0;

  const rows = useMemo(() => fakeItemsFactory(domains, isLoading, id => ({ id, domain: '', status: false }), 5), [
    isLoading,
    domains,
  ]);

  const handleSelectDomain = useCallback(domain => dispatch(setDomain(domain)), [dispatch]);

  useEffect(() => {
    dispatch(loadDomainsRequest());
    return () => dispatch(resetError());
  }, [dispatch]);

  return (
    <>
      <Box mb={3}>
        <AddDomainForm />
      </Box>
      {hasNoDomains ? (
        <Box minHeight={300} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
          <img width={180} src={notFoundDomains} alt="" />
          <Box mt={3}>
            <Typography className="H3-Dark">You have no DKIMs set up yet</Typography>
          </Box>
        </Box>
      ) : (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">Domain</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="right" width={200} />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(domain => (
              <DomainRow
                key={`domain-id-${domain.id}`}
                domain={domain}
                isLoading={isLoading}
                onSelect={handleSelectDomain}
                onRemove={onRemove}
              />
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

DomainsTable.propTypes = {
  onRemove: PropTypes.func.isRequired,
};

export default memo(DomainsTable);
