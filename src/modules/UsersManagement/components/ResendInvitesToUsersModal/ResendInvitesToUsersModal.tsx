import React, { memo, useCallback } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage, AlyceTheme, IModalConfirmationMessageProps } from '@alycecom/ui';
import { useSelector, useDispatch } from 'react-redux';

import { getIsOperationPending } from '../../store/usersOperation/usersOperation.selectors';
import { getCurrentActionUsers } from '../../store/usersManagement.selectors';
import { resendInvitesToUsersRequest } from '../../store/usersOperation/usersOperation.actions';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
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
    width: 110,
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
    minWidth: 110,
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

export interface IResendInvitesToUsersModalProps
  extends Pick<IModalConfirmationMessageProps, 'onDiscard' | 'DialogProps'> {
  isOpen: boolean;
}

const ResendInvitesToUsers = ({ isOpen, ...ModalProps }: IResendInvitesToUsersModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles({ isMobile: false });

  const users = useSelector(getCurrentActionUsers);
  const isLoading = useSelector(getIsOperationPending);
  const invitesText = users.length > 1 ? 'invites' : 'invite';
  const usersText = users.length > 1 ? 'users' : 'user';

  const handleResendInvitesToUsers = useCallback(() => {
    dispatch(resendInvitesToUsersRequest());
  }, [dispatch]);

  return (
    <ModalConfirmationMessage
      isOpen={isOpen}
      title={`Resend email ${invitesText}?`}
      width="100%"
      icon="envelope"
      customClasses={classes}
      submitButtonText="Resend"
      cancelButtonText="Cancel"
      submitButtonsProps={{ disabled: isLoading }}
      discardButtonsProps={{ disabled: isLoading }}
      onSubmit={handleResendInvitesToUsers}
      {...ModalProps}
    >
      <Typography className="Body-Regular-Left-Static">
        The {usersText} will receive another email invitation, with all information they need to setup their account.
      </Typography>
    </ModalConfirmationMessage>
  );
};

export default memo(ResendInvitesToUsers);
