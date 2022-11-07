import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Paper, Button } from '@mui/material';

import {
  getGiftsCountFromTransferSelection,
  getGiftTransferId,
  getGiftTransferringProgress,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.selectors';
import giftTransferAsset from '../../../../../../assets/images/giftTransferAsset.png';
import {
  closeGiftTransferSidebar,
  giftTransferringProgressRequest,
} from '../../../../store/breakdowns/giftTransfer/giftTransfer.actions';

const TransferringProcess = ({ classes }) => {
  const dispatch = useDispatch();
  const giftCount = useSelector(getGiftsCountFromTransferSelection);
  const transferringId = useSelector(getGiftTransferId);
  const transferringProgress = useSelector(getGiftTransferringProgress);

  useEffect(() => {
    dispatch(giftTransferringProgressRequest({ transferringId }));
  }, [dispatch, transferringId]);

  const handleReturnToDashboard = useCallback(() => {
    dispatch(closeGiftTransferSidebar());
  }, [dispatch]);

  return (
    <Paper square className={classes.paper}>
      <Box className="H4-Chambray">Give us a minute to transfer your gifts!</Box>
      <Box mt={2} className="Body-Regular-Left-Static">
        Feel free to close this window… or just hangout! We’ll let you know when the upload has been completed.
      </Box>
      <Box mt={4} className="H4-Chambray" align="center">
        Transferring {transferringProgress} of {giftCount} gifts
      </Box>
      <Box mt={4} display="flex" justifyContent="center">
        <img src={giftTransferAsset} alt="gift transfer" width="224" />
      </Box>
      <Box width="100%" mt={4}>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          onClick={handleReturnToDashboard}
          fullWidth
        >
          Return to dashboard
        </Button>
      </Box>
    </Paper>
  );
};

TransferringProcess.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
};

TransferringProcess.defaultProps = {
  classes: {},
};

export default TransferringProcess;
