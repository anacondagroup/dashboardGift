import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, FlatButton, Icon, LinkButton } from '@alycecom/ui';

import FileInput from '../../../../../components/Shared/FileInput';
import { setContactsUploadingSectionState } from '../../../store/ui/createPage/contactsSidebar';
import { ContactsUploadingStates } from '../../../constants/recipientSidebar.constants';
import {
  downloadXLSXFileTemplateRequest,
  getIsRecipientsSourceTypeDefined,
  uploadRecipientListRequest,
} from '../../../store/steps/recipients';
import UploadingSectionContent from '../UploadingSectionContent';
import { useActivate } from '../../../hooks/useActivate';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  downloadIcon: {
    marginRight: spacing(1),
    color: palette.link.main,
  },
  tipIcon: {
    marginRight: spacing(2),
    color: palette.green.main,
    fontSize: 24,
  },
  button: {
    boxShadow: 'none',
  },
  linkButton: {
    marginBottom: 8,
    '& > div': {
      lineHeight: '1.2 !important',
    },
  },
}));

const acceptFileFormats = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel';

interface IFileUploadingProps {
  isLoading: boolean;
}

const FileUploading = ({ isLoading }: IFileUploadingProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const { campaignId } = useActivate();
  const isSourceTypeDefined = useSelector(getIsRecipientsSourceTypeDefined);

  const [file, setFile] = useState<File | undefined>(undefined);
  const filename = file?.name || '';

  const handleFileChange = useCallback(e => {
    if (!e.target.files[0]) {
      return;
    }
    setFile(e.target.files[0]);
  }, []);

  const handleUploadFile = useCallback(() => {
    if (file && campaignId) {
      dispatch(uploadRecipientListRequest({ file, campaignId }));
      setFile(undefined);
    }
  }, [dispatch, file, campaignId]);

  const handleDownloadTemplate = useCallback(() => dispatch(downloadXLSXFileTemplateRequest()), [dispatch]);

  const handleBackButton = useCallback(() => {
    dispatch(setContactsUploadingSectionState(ContactsUploadingStates.ChooseSource));
  }, [dispatch]);

  return (
    <UploadingSectionContent
      title="Who will be the recipients of this gift?"
      description="Using the Alyce Bulk template, upload your list of recipients below."
    >
      <Box pb={1}>
        <LinkButton className="Body-Regular-Left-Link-Bold" onClick={handleDownloadTemplate}>
          <Icon icon="file-download" className={classes.downloadIcon} />
          Download XLSX template
        </LinkButton>
        <Box pt={4}>
          <FileInput accept={acceptFileFormats} onChange={handleFileChange} fileName={filename} error="" />
        </Box>
      </Box>
      <Box pb={1}>
        <Divider my={2} />
        <Grid container alignItems="center">
          <Icon className={classes.tipIcon} icon="graduation-cap" />
          <Grid item xs={10}>
            <Typography className="Subcopy-Static-Alt">
              Tip: For XLSX file upload, recipient emails are required and must be unique
            </Typography>
          </Grid>
        </Grid>
        <Divider my={2} />
      </Box>
      <Box>
        <Box
          width="100%"
          display="flex"
          justifyContent={isSourceTypeDefined ? 'flex-end' : 'space-between'}
          alignItems="center"
        >
          {!isSourceTypeDefined && (
            <Box display="flex" alignItems="center">
              <FlatButton className={classes.linkButton} icon="arrow-left" onClick={handleBackButton}>
                Back to list selection
              </FlatButton>
            </Box>
          )}
          <Box width="190">
            <Button
              className={classes.button}
              variant="contained"
              color="secondary"
              onClick={handleUploadFile}
              disabled={!filename}
              fullWidth
              endIcon={
                isLoading ? <Icon spin color="inherit" icon="spinner" /> : <Icon color="inherit" icon="arrow-right" />
              }
            >
              Upload file
            </Button>
          </Box>
        </Box>
      </Box>
    </UploadingSectionContent>
  );
};

export default FileUploading;
