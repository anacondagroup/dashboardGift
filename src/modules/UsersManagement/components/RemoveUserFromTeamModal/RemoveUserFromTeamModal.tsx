import React, { memo, useCallback } from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage, AlyceTheme, IModalConfirmationMessageProps } from '@alycecom/ui';
import { useSelector, useDispatch } from 'react-redux';
import { User } from '@alycecom/modules';

import { getIsOperationPending } from '../../store/usersOperation/usersOperation.selectors';
import { getCurrentActionUsers } from '../../store/usersManagement.selectors';
import { removeUserFromTeamsRequest } from '../../store/usersOperation/usersOperation.actions';
import { getIsAllSelected, getPagination } from '../../store/users/users.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.red.main,
  },
  root: {
    width: 500,
    borderTop: `4px solid ${palette.red.main}`,
  },
  submitButton: {
    backgroundColor: palette.red.main,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    marginLeft: '0px !important',
    width: 220,
    border: 'none',
    marginBottom: 0,
    '&:hover': {
      backgroundColor: palette.red.main,
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
  ul: {
    paddingLeft: spacing(3),
    '& > li': {
      paddingBottom: spacing(1),
    },
  },
}));

export interface IRemoveUserFromTeamModalProps
  extends Pick<IModalConfirmationMessageProps, 'onDiscard' | 'DialogProps'> {
  isOpen: boolean;
}

const RemoveUserFromTeamModal = ({ isOpen, ...ModalProps }: IRemoveUserFromTeamModalProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles({ isMobile: false });

  const users = useSelector(getCurrentActionUsers);
  const isLoading = useSelector(getIsOperationPending);
  const isAllSelected = useSelector(getIsAllSelected);
  const { total } = useSelector(getPagination);
  const currentUser = useSelector(User.selectors.getUser);

  const usersText = users.length > 1 ? 'users' : 'user';
  const affectedUsersCount = isAllSelected ? total : users.length;

  const handleRemoveFromAccount = useCallback(() => {
    dispatch(removeUserFromTeamsRequest());
  }, [dispatch]);

  return (
    <ModalConfirmationMessage
      isOpen={isOpen}
      title={`Remove ${affectedUsersCount} ${usersText} from account?`}
      width="100%"
      icon="exclamation-circle"
      customClasses={classes}
      submitButtonText="Remove from account"
      cancelButtonText="Cancel"
      submitButtonsProps={{ disabled: isLoading }}
      discardButtonsProps={{ disabled: isLoading }}
      onSubmit={handleRemoveFromAccount}
      {...ModalProps}
    >
      <Typography className="Body-Regular-Left-Static">
        You’re about to remove {affectedUsersCount} {usersText} from this account
      </Typography>
      <Typography className="Body-Regular-Left-Static">This action can’t be undone</Typography>
      <ul className={classes.ul}>
        <li>
          Created and not sent gifts will be re associated with {currentUser.firstName} {currentUser.lastName}
        </li>
        <li>Sent gifts will be associated with the original gifter</li>
        <li>Recipients will be able to claim pending gifts sent by the original gifter</li>
      </ul>
    </ModalConfirmationMessage>
  );
};

export default memo(RemoveUserFromTeamModal);
