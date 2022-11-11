import React, { useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { Button, Icon } from '@alycecom/ui';
import { MessageType, showGlobalMessage } from '@alycecom/services';
import { useDispatch } from 'react-redux';

import { convertSvgFromHtmlElementToBlob, downloadBlobAsPng } from '../../../../../../../helpers/download.helpers';

import { styles } from './RoiDownloadImage.styles';

interface IRoiDownloadImageProps {
  svgContainerId: string;
  imageTitle: string;
}

export const RoiDownloadImage = ({ svgContainerId, imageTitle }: IRoiDownloadImageProps): JSX.Element => {
  const dispatch = useDispatch();

  const onDownloadPng = useCallback(async () => {
    try {
      const blob = await convertSvgFromHtmlElementToBlob({
        htmlSvgId: svgContainerId,
      });
      if (!blob) {
        throw Error('Unexpected error');
      }
      downloadBlobAsPng({ blob, filename: imageTitle });
    } catch {
      dispatch(showGlobalMessage({ type: MessageType.Error, text: 'Something went wrong. Please try again later.' }));
    }
  }, [svgContainerId, imageTitle, dispatch]);

  return (
    <Button variant="text" onClick={onDownloadPng} sx={styles.button}>
      <Box sx={styles.download}>
        <Icon icon="file-download" color="link.light" />
        <Typography>Download .png</Typography>
      </Box>
    </Button>
  );
};
