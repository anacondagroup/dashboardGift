import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ModalConfirmationMessage } from '@alycecom/ui';

const useStyles = makeStyles(({ palette, spacing }) => ({
  avatar: {
    backgroundColor: palette.error.main,
  },
  root: {
    borderTop: `4px solid ${palette.error.main}`,
  },
  submitButton: {
    backgroundColor: palette.error.main,
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    width: 156,
  },
  cancelButton: {
    paddingLeft: spacing(1),
    paddingRight: spacing(1),
    width: 156,
  },
  actions: {
    justifyContent: 'space-between',
  },
}));

const RemoveDkimConfirmation = props => {
  const customClasses = useStyles();
  return (
    <ModalConfirmationMessage
      title="Are you sure?"
      customClasses={customClasses}
      submitButtonText="Remove DKIM"
      cancelButtonText="Cancel"
      backdropStyles={{ top: 0 }}
      width="100%"
      {...props}
    >
      <Typography className="Body-Regular-Left-Static">How would you like to continue?</Typography>
    </ModalConfirmationMessage>
  );
};

export default RemoveDkimConfirmation;
