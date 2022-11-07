import React, { useCallback, useMemo } from 'react';
import * as R from 'ramda';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { Typography, Box, Button } from '@mui/material';
import { AlyceLoading, DashboardIcon, HtmlTip } from '@alycecom/ui';

import { MAX_IMPORT_SIZE } from '../bulkCreate.constants';

import ImportTable from './ImportTable';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {},
  divider: {
    borderTop: `1px solid ${palette.divider}`,
  },
  select: {
    width: '100%',
  },
  button: {
    background: palette.secondary.main,
    color: palette.primary.main,
    '&:hover': {
      background: palette.secondary.dark,
    },
    padding: '12px 28px',
  },
  uploadIcon: {
    marginRight: spacing(2),
  },
  selectInput: {
    color: palette.grey.main,
  },
  errorsListItem: {
    '&:before': {
      content: `""`,
      display: 'inline-block',
      width: 5,
      height: 5,
      background: palette.error.main,
      borderRadius: '100%',
      margin: 5,
      position: 'relative',
      top: 3,
    },
  },
}));

const ImportEditStep = ({
  contacts,
  onContactUpdate,
  onBulkCreateHandler,
  isLoading,
  onRowDelete,
  errors,
  lockedSendAs,
  campaignName,
}) => {
  const classes = useStyles();
  const findErrors = useCallback(
    contactId => {
      if (!errors) {
        return false;
      }
      const errorTypes = Object.keys(errors);
      return errorTypes.reduce((foundErrors, errorType) => {
        if (errors[errorType].lines.find(line => line === contactId)) {
          foundErrors.push({
            field: errors[errorType].field,
            message: errors[errorType].message,
          });
        }
        return foundErrors;
      }, []);
    },
    [errors],
  );
  const errorsCount = useMemo(
    () => (errors ? Object.values(errors).reduce((acc, { lines }) => acc + lines.length, 0) : 0),
    [errors],
  );
  const contactsCombinedWithErrors = useMemo(
    () => contacts.map(contact => ({ ...contact, errors: findErrors(contact.id) })),
    [contacts, findErrors],
  );
  const isUploadButtonDisabled = contacts.length > MAX_IMPORT_SIZE || isLoading;
  return (
    <>
      {(!errors || R.isEmpty(errors)) && (
        <>
          <Typography className="H4-Chambray">Thanks, let’s review and verify these contacts!</Typography>
          <Box mt={3} mb={3}>
            <Typography className="Body-Regular-Left-Static">
              Take a look at everything and make sure it looks good. Alyce will start creating the perfect gifts for you
              asap!{' '}
            </Typography>
          </Box>
        </>
      )}
      {!R.isEmpty(errors) && (
        <>
          <Typography className="H4-Chambray">Heads up! We have a few issues you need to look at!</Typography>
          <Box mt={3} mb={3}>
            <Typography className="Body-Regular-Left-Static">
              Out of the {contacts.length} contacts you uploaded to the <b>{campaignName}</b> campaign, there are{' '}
              {errorsCount} issues you need to address before continuing. You can find the lines were the issues are
              below:
            </Typography>
          </Box>
        </>
      )}
      {lockedSendAs && (
        <HtmlTip>
          The send-as person is locked for this campaign, all empty send-as fields will be automatically updated with
          this email.
        </HtmlTip>
      )}
      {isLoading ? (
        <AlyceLoading isLoading />
      ) : (
        <ImportTable rows={contactsCombinedWithErrors} onContactUpdate={onContactUpdate} onRowDelete={onRowDelete} />
      )}
      {!R.isNil(errors) && !R.isEmpty(errors) && (
        <Box mt={3} pt={3} mb={3} className={classes.divider}>
          {Object.keys(errors).map(errorType => (
            <Box mb={1} key={errorType}>
              <Typography className="Subcopy-Italic-Error">
                On lines{' '}
                {contacts
                  .filter(contact => errors[errorType].lines.indexOf(contact.id) >= 0)
                  .map(contact => contacts.indexOf(contact) + 1)
                  .join(', ')}
              </Typography>
              <Typography className={classNames('Body-Regular-Left-Error', classes.errorsListItem)}>
                {errorType}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      {contacts.length > MAX_IMPORT_SIZE && (
        <Box mt={3} pt={3} mb={3} className={classes.divider}>
          <Typography className={classNames('Body-Regular-Left-Error', classes.errorsListItem)}>
            Maximum limit of {MAX_IMPORT_SIZE} is exceeded.
          </Typography>
        </Box>
      )}
      <Box display="flex" flexDirection="row" justifyContent="flex-end" mt={3}>
        <Button className={classes.button} onClick={onBulkCreateHandler} disabled={isUploadButtonDisabled}>
          <DashboardIcon icon="file-upload" className={classes.uploadIcon} />
          Verify and upload your list
        </Button>
      </Box>
    </>
  );
};

ImportEditStep.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  contacts: PropTypes.array.isRequired,
  onContactUpdate: PropTypes.func.isRequired,
  onBulkCreateHandler: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onRowDelete: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  lockedSendAs: PropTypes.bool,
  campaignName: PropTypes.string.isRequired,
};

ImportEditStep.defaultProps = {
  errors: null,
  lockedSendAs: false,
};

export default ImportEditStep;
