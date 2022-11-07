import React from 'react';
import PropTypes from 'prop-types';
import { Paper, Button, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useSelector } from 'react-redux';

import giftTransferAsset from '../../../../assets/images/giftTransferAsset.png';
import {
  getBulkImportTotalContacts,
  getProcessedCount,
} from '../../../../store/bulkCreateContacts/import/import.selectors';

const useStyles = makeStyles(({ palette, spacing }) => ({
  paper: {
    padding: spacing(2),
    borderBottom: `1px solid ${palette.divider}`,
  },
  button: {
    boxShadow: 'none',
  },
}));

const AwaitingProcess = ({ onClose }) => {
  const classes = useStyles();
  const processed = useSelector(getProcessedCount);
  const total = useSelector(getBulkImportTotalContacts);

  return (
    <Paper square className={classes.paper}>
      <Box className="H4-Chambray">Give us a minute to upload!</Box>
      <Box mt={2} className="Body-Regular-Left-Static">
        Feel free to close this window… or just hangout! We’ll let you know via email when the upload has been
        completed.
      </Box>
      <Box mt={4} display="flex" alignItems="center" flexDirection="column">
        <Box className="H4-Chambray">
          Importing {processed} of {total} Contacts
        </Box>
        <Box mt={4} align="center">
          <img src={giftTransferAsset} alt="gift transfer" width="224" />
        </Box>
      </Box>
      <Box width="100%" mt={4}>
        <Button className={classes.button} variant="contained" color="secondary" onClick={onClose} fullWidth>
          Return to dashboard
        </Button>
      </Box>
    </Paper>
  );
};

AwaitingProcess.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default AwaitingProcess;
