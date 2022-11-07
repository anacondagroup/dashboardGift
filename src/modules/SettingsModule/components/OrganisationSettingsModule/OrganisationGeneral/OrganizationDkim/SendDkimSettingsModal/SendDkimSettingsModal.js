import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage, BaseField } from '@alycecom/ui';
import { useKeyPressEnter } from '@alycecom/hooks';

import { getErrors, getIsSendingEmail } from '../../../../../store/organisation/dkim/details/details.selectors';
import {
  sendEmailRequest,
  setSendEmailModalOpen,
  resetErrors,
} from '../../../../../store/organisation/dkim/details/details.actions';

const useStyles = makeStyles(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.green.dark,
  },
  root: {
    width: 500,
    borderTop: `4px solid ${palette.green.dark}`,
  },
  submitButton: {
    backgroundColor: palette.green.dark,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    marginLeft: '0px !important',
    width: 220,
    border: 'none',
    marginBottom: 0,
    '&:hover': {
      backgroundColor: palette.green.dark,
    },
    whiteSpace: 'nowrap',
    '&>span>span': {
      lineHeight: '1.3 !important',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  cancelButton: {
    paddingLeft: spacing(2),
    paddingRight: spacing(2),
    width: 'auto',
    marginRight: spacing(2),
    maxWidth: 220,
    whiteSpace: 'nowrap',
    '&>span>span': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

const SendDkimSettingsModal = ({ domainId, ...modalProps }) => {
  const dispatch = useDispatch();
  const customClasses = useStyles({ isMobile: false });

  const [coworkerEmail, setCoworkerEmail] = useState('');

  const isLoading = useSelector(getIsSendingEmail);
  const errors = useSelector(getErrors);

  const handleCloseSendEmailModal = useCallback(() => dispatch(setSendEmailModalOpen(false)), [dispatch]);
  const handleSendEmail = useCallback(() => {
    dispatch(sendEmailRequest({ id: domainId, email: coworkerEmail }));
  }, [domainId, coworkerEmail, dispatch]);
  const handleOnExitModal = useCallback(() => {
    setCoworkerEmail('');
    dispatch(resetErrors());
  }, [dispatch]);
  const handleResetErrors = useCallback(() => dispatch(resetErrors()), [dispatch]);

  return (
    <ModalConfirmationMessage
      title="Send email to your Network Administrator"
      width="100%"
      icon="envelope"
      customClasses={customClasses}
      onSubmit={handleSendEmail}
      onDiscard={handleCloseSendEmailModal}
      submitButtonText="Send email"
      cancelButtonText="Cancel"
      buttonsProps={{ disabled: isLoading }}
      DialogProps={{ onExited: handleOnExitModal }}
      {...modalProps}
    >
      <Typography className="Body-Regular-Left-Static">
        Enter your Network Administrator’s email address and we’ll send them everything they need to install these
        records.
      </Typography>
      <Box mt={2}>
        <BaseField
          name="email"
          label="Network Administrator's email"
          fullWidth
          value={coworkerEmail}
          disabled={isLoading}
          errors={errors}
          onChange={useCallback(({ target }) => setCoworkerEmail(target.value), [])}
          onKeyPress={useKeyPressEnter(handleSendEmail)}
          onFocus={handleResetErrors}
        />
      </Box>
    </ModalConfirmationMessage>
  );
};

SendDkimSettingsModal.propTypes = {
  domainId: PropTypes.number.isRequired,
};

export default memo(SendDkimSettingsModal);
