import React, { useEffect, useCallback, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Link } from '@mui/material';
import { LinkButton, Icon } from '@alycecom/ui';

import { resetDomainDetails } from '../../../../store/organisation/dkim/details/details.actions';
import { getDomain } from '../../../../store/organisation/dkim/details/details.selectors';
import { removeDomainRequest } from '../../../../store/organisation/dkim/domains/domains.actions';

import RemoveDkimConfirmation from './RemoveDomainConfirmation/RemoveDomainConfirmation';
import DomainDetailsTable from './DomainDetailsTable/DomainDetailsTable';
import DomainsTable from './DomainsTable/DomainsTable';

const OrganizationDKIM = () => {
  const dispatch = useDispatch();

  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [domain, setDomain] = useState(null);
  const selectedDomain = useSelector(getDomain);

  const handleRemoveDomain = useCallback(id => {
    setIsConfirmVisible(true);
    setDomain(id);
  }, []);

  const handleSubmitRemoving = useCallback(() => {
    dispatch(removeDomainRequest(domain));
    dispatch(resetDomainDetails());
    setIsConfirmVisible(false);
  }, [dispatch, domain]);
  const handleCancelRemoving = useCallback(() => {
    setIsConfirmVisible(false);
    setDomain(null);
  }, []);

  const goBack = useCallback(() => dispatch(resetDomainDetails()), [dispatch]);

  useEffect(() => () => dispatch(resetDomainDetails()), [dispatch]);

  return (
    <Box mx={3} my={3}>
      {selectedDomain && (
        <Box my={3} maxWidth={220}>
          <Box display="flex" alignItems="center" justifyContent="space-between" onClick={goBack}>
            <Icon icon="arrow-left" color="link.main" />
            <LinkButton onClick={goBack}>Go back to the domains list</LinkButton>
          </Box>
        </Box>
      )}
      <Box mb={3}>
        <Typography className="Body-Regular-Left-Static">
          Domain Keys Identified Mail (DKIM) allows the receiver to check that an email claimed to have come from a
          specific domain was indeed authorized by the owner of that domain.
        </Typography>
        {selectedDomain && (
          <Typography className="Body-Regular-Left-Static">
            If you need any help, please consult our&nbsp;
            <Link
              style={{ display: 'inline-block' }}
              target="_blank"
              href="https://help.alyce.com/hc/en-us/articles/360048989271-Domain-authentication-configuration-connect-all-emails-of-a-domain"
            >
              help desk article
            </Link>
          </Typography>
        )}
      </Box>
      <Box mb={3}>
        {selectedDomain ? (
          <DomainDetailsTable onRemove={handleRemoveDomain} />
        ) : (
          <DomainsTable onRemove={handleRemoveDomain} />
        )}
      </Box>
      <RemoveDkimConfirmation
        isOpen={isConfirmVisible}
        onSubmit={handleSubmitRemoving}
        onDiscard={handleCancelRemoving}
      />
    </Box>
  );
};

export default memo(OrganizationDKIM);
