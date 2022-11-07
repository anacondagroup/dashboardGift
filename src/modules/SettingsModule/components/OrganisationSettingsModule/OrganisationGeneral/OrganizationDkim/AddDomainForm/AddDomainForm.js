import React, { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BaseField, ActionButton, DashboardIcon } from '@alycecom/ui';
import { useKeyPressEnter } from '@alycecom/hooks';

import {
  addDomainRequest,
  setDomainName,
  resetError,
} from '../../../../../store/organisation/dkim/domains/domains.actions';
import {
  getIsLoading,
  getErrors,
  getDomainName,
} from '../../../../../store/organisation/dkim/domains/domains.selectors';

const useStyles = makeStyles(({ spacing }) => ({
  icon: {
    marginRight: spacing(1),
  },
}));

const AddDomainForm = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const isLoading = useSelector(getIsLoading);
  const errors = useSelector(getErrors);
  const domainName = useSelector(getDomainName);
  const isDisabled = !domainName || isLoading;

  const handleChangeDomainName = useCallback(e => dispatch(setDomainName(e.target.value)), [dispatch]);

  const handleAddDomain = useCallback(() => {
    dispatch(addDomainRequest(domainName));
  }, [dispatch, domainName]);

  const handleResetError = useCallback(() => dispatch(resetError()), [dispatch]);

  return (
    <Box display="flex" justifyContent="flex-start">
      <Box width={400} mr={3}>
        <BaseField
          data-testid="domainNameField"
          name="domain"
          label="Domain URL"
          placeholder="Domain URL"
          value={domainName}
          errors={errors}
          fullWidth
          disabled={isLoading}
          onChange={handleChangeDomainName}
          onKeyPress={useKeyPressEnter(handleAddDomain)}
          onFocus={handleResetError}
        />
      </Box>
      <ActionButton width={200} onClick={handleAddDomain} disabled={isDisabled}>
        <DashboardIcon className={classes.icon} icon="plus" size="sm" /> Add a new domain
      </ActionButton>
    </Box>
  );
};

export default memo(AddDomainForm);
