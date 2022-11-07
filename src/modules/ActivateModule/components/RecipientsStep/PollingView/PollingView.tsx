import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';

import recipientImportImage from '../../../assets/images/giftTransferAsset.png';
import { IUploadRequestAttributes } from '../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import UploadingSectionContent from '../UploadingSectionContent';
import { pollContactsUploadingFileFinish, pollContactsUploadingFileRequest } from '../../../store/steps/recipients';
import { useActivate } from '../../../hooks/useActivate';

interface IPollingViewProps {
  attributes: IUploadRequestAttributes;
}

const PollingView = ({ attributes }: IPollingViewProps): JSX.Element => {
  const dispatch = useDispatch();

  const { campaignId: draftId } = useActivate();
  const { total, completed } = attributes;

  useEffect(() => {
    if (draftId) {
      dispatch(pollContactsUploadingFileRequest({ campaignId: draftId }));
    }
    return () => {
      dispatch(pollContactsUploadingFileFinish());
    };
  }, [dispatch, draftId]);

  return (
    <UploadingSectionContent
      title="Give us a minute to upload!"
      description="Feel free to close the window… or just hangout! We’ll let you know when the upload has been completed."
    >
      <Box pb={1} textAlign="center">
        <div className="H4-Chambray">
          {total ? (
            <span>
              Validating {completed} of {total} contacts
            </span>
          ) : (
            <span>Validating contacts...</span>
          )}
        </div>
      </Box>
      <Box mt={1} display="flex" justifyContent="center">
        <img src={recipientImportImage} alt="recipient import" width="306" />
      </Box>
    </UploadingSectionContent>
  );
};

export default PollingView;
