import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import recipientImportImage from '../../../../../../../../../assets/images/giftTransferAsset.png';
import { swagDigitalGenerationCodesProgressRequest } from '../../../../../../../store/campaign/swagDigitalCodes/swagDigitalCodes.actions';

const CreateCodesProcessing = ({ requestId, classes, createdCodesAmount, codesAmount, campaignId }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(swagDigitalGenerationCodesProgressRequest({ campaignId, requestId }));
  }, [campaignId, dispatch, requestId]);

  return (
    <>
      <Box pb={2} pl="52px" className="H4-Chambray">
        Give us a minute to create codes!
        <Box mt={1} className={classes.description}>
          Feel free to close the window… or just hangout! We’ll let you know when the creating codes has been completed.
        </Box>
      </Box>
      <Box mt={3} textAlign="center" className="H4-Chambray">
        Created {createdCodesAmount || 0} of {codesAmount} codes
      </Box>
      <Box mt={4} textAlign="center">
        <img src={recipientImportImage} alt="recipient import" width="306" />
      </Box>
    </>
  );
};

CreateCodesProcessing.propTypes = {
  requestId: PropTypes.number.isRequired,
  campaignId: PropTypes.number.isRequired,
  classes: PropTypes.objectOf(PropTypes.string),
  createdCodesAmount: PropTypes.number,
  codesAmount: PropTypes.number,
};

CreateCodesProcessing.defaultProps = {
  classes: {},
  createdCodesAmount: 0,
  codesAmount: 0,
};

export default CreateCodesProcessing;
