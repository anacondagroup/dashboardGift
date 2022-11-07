import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Typography, Box, Button, Grid } from '@mui/material';
import { useSelector } from 'react-redux';

import successImage from '../../../../assets/images/research-success.png';
import { getProcessedCount } from '../../../../store/bulkCreateContacts/import/import.selectors';

const useStyles = makeStyles(({ palette }) => ({
  button: {
    background: palette.secondary.main,
    color: palette.primary.main,
    '&:hover': {
      background: palette.secondary.dark,
    },
    padding: '12px 100px',
  },
  image: {
    maxWidth: 284,
  },
}));

const FinishingProcess = ({ onClose }) => {
  const classes = useStyles();
  const processed = useSelector(getProcessedCount);

  return (
    <>
      <Box mb={3}>
        <Typography className="H4-Chambray">…and we’re off!</Typography>
      </Box>
      <Box mb={3}>
        <Typography className="Body-Regular-Left-Static">
          Thanks for uploading your list! Our gift suggestions for your {processed} contacts will be posted soon.
          Suggestions are reviewed by our team to ensure they’re spot on so we’ll send a notification when they’re
          ready!
        </Typography>
      </Box>
      <Box mb={5}>
        <Grid container justifyContent="center">
          <img className={classes.image} src={successImage} alt="" />
        </Grid>
      </Box>
      <Grid container justifyContent="center">
        <Button className={classes.button} onClick={onClose}>
          Got it, thank you!
        </Button>
      </Grid>
    </>
  );
};

FinishingProcess.propTypes = {
  onClose: PropTypes.func.isRequired,
};
export default FinishingProcess;
