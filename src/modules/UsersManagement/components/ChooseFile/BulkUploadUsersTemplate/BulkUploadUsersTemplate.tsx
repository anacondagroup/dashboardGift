import React, { memo, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceLoading, Icon, AlyceTheme, Button } from '@alycecom/ui';
import { User } from '@alycecom/modules';

import { MAX_BULK_FILE_SIZE, BULK_INVITE_ACCEPT_MIME } from '../../../constants/bulkCreate.constants';
import { downloadBulkInviteTemplate, uploadFileRequest } from '../../../store/bulkCreate/bulkCreate.actions';
import { getIsFilePending } from '../../../store/bulkCreate/bulkCreate.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  dropZone: {
    borderRadius: 5,
    border: `dashed 1px ${palette.divider}`,
    backgroundColor: '#f5f8fa',
    color: palette.grey.main,
    padding: spacing(6, 18),
  },
  dropZoneActive: {
    borderColor: palette.link.main,
  },
  selectFileButton: {
    color: palette.link.main,
    padding: 0,
    fontSize: 12,
    '&:hover': {
      background: 'transparent',
    },
  },
  sampleTemplateButton: {
    color: palette.link.main,
    fontSize: 12,
  },
  loader: {
    color: palette.link.main,
  },
  uploadIcon: {
    fontSize: '30px !important',
  },
}));

const BulkUploadUsersTemplate = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isAccepted, setIsAccepted] = useState(true);
  const isLoading = useSelector(getIsFilePending);
  const orgName = useSelector(User.selectors.getOrgName);

  const onDropAccepted = useCallback(
    acceptedFiles => {
      setIsAccepted(true);
      const [bulkFile] = acceptedFiles;
      if (!bulkFile) {
        return;
      }
      dispatch(uploadFileRequest({ file: bulkFile }, orgName));
    },
    [dispatch, setIsAccepted, orgName],
  );

  const onDropRejected = useCallback(() => {
    setIsAccepted(false);
  }, [setIsAccepted]);

  const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    accept: BULK_INVITE_ACCEPT_MIME,
    maxSize: MAX_BULK_FILE_SIZE,
    onDropAccepted,
    onDropRejected,
  });

  const onDownloadTemplateClick = useCallback(
    e => {
      e.preventDefault();
      dispatch(downloadBulkInviteTemplate());
    },
    [dispatch],
  );

  return (
    <Box width={1}>
      <Box>
        {isLoading ? (
          <AlyceLoading isLoading circularProps={{ className: classes.loader }} />
        ) : (
          <>
            <Box
              {...getRootProps({
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 1,
                className: classNames(classes.dropZone, { [classes.dropZoneActive]: isDragActive }),
              })}
            >
              <input {...getInputProps()} />
              <Icon className={classes.uploadIcon} color="inherit" icon="file-upload" />
              <Box display="inline-block" width={400} fontSize={12} mt={3} mb={2}>
                Drag and drop or choose a file to create users, max. 250 users at once. .xlsx files are supported{' '}
              </Box>
              <Button onClick={open} className={classes.selectFileButton}>
                Choose a file
              </Button>
            </Box>
            {!isAccepted && (
              <Typography color="error">
                Drag and drop or choose a file to create users. Only *.xlsx lower than {MAX_BULK_FILE_SIZE / 1024}KiB
                will be accepted
              </Typography>
            )}
          </>
        )}
      </Box>
      <Button
        className={classes.sampleTemplateButton}
        variant="text"
        startIcon={<Icon color="inherit" icon="file-upload" />}
        onClick={onDownloadTemplateClick}
      >
        Download sample file
      </Button>
    </Box>
  );
};

export default memo(BulkUploadUsersTemplate);
