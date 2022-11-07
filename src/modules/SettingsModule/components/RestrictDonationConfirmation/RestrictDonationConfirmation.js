import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box } from '@mui/material';
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

const RestrictDonationConfirmationComponent = ({ area, ...otherProps }) => {
  const customClasses = useStyles();
  return (
    <ModalConfirmationMessage
      title="Please confirm"
      icon="eye-slash"
      customClasses={customClasses}
      submitButtonText="Continue"
      cancelButtonText="Cancel"
      backdropStyles={{ top: 0 }}
      width="100%"
      {...otherProps}
    >
      <Typography className="Body-Regular-Left-Static">
        If you uncheck &quot;Donations&quot; your {area} will be unable to send donations as gifts and recipients will
        be unable to donate the value of the gift.
      </Typography>
      <Box pt={2} pb={2}>
        <Typography className="Body-Regular-Left-Static">
          You should not do this unless you have a specific, legal requirement to do so.
        </Typography>
      </Box>
    </ModalConfirmationMessage>
  );
};

RestrictDonationConfirmationComponent.propTypes = {
  area: PropTypes.string,
};

RestrictDonationConfirmationComponent.defaultProps = {
  area: 'team',
};

export default RestrictDonationConfirmationComponent;
