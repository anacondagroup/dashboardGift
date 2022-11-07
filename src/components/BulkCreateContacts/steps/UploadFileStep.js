import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Box, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon, LinkButton } from '@alycecom/ui';

import FileInput from '../../Shared/FileInput';
import { MAX_IMPORT_SIZE } from '../bulkCreate.constants';

const useStyles = makeStyles(({ palette, spacing }) => ({
  downloadIcon: {
    marginRight: spacing(1),
  },
  tipIcon: {
    marginRight: spacing(2),
    color: palette.green.main,
    fontSize: 24,
  },
  divider: {
    width: '100%',
    borderTop: `1px solid ${palette.divider}`,
    margin: spacing(2, 0),
  },
  uploadButton: {
    background: palette.secondary.main,
    color: palette.primary.main,
    '&:hover': {
      background: palette.secondary.dark,
    },
  },
  uploadIcon: {
    marginRight: spacing(2),
  },
}));

const UploadFileStep = ({ teamName, onChange, fileName, onUpload, uploadError, onDownloadTemplate }) => {
  const classes = useStyles();
  return (
    <>
      <Typography className="H4-Chambray">Great, lets get this list uploaded to the {teamName}!</Typography>
      <Box mt={3} mb={3}>
        <Typography className="Body-Regular-Left-Static">
          To upload max. {MAX_IMPORT_SIZE} contacts at once, your file must be .xls, .xlsx, or .csv format.
        </Typography>
      </Box>
      <LinkButton className="Body-Regular-Center-Link-Bold" onClick={onDownloadTemplate}>
        <DashboardIcon icon="file-download" className={classes.downloadIcon} />
        Download XLSX template
      </LinkButton>
      <Box mt={3}>
        <FileInput onChange={onChange} fileName={fileName} error={uploadError} />
      </Box>
      <Box>
        <Box pt={1}>
          <Button disabled={!fileName} className={classes.uploadButton} fullWidth onClick={onUpload}>
            <DashboardIcon icon="arrow-right" className={classes.uploadIcon} />
            Upload file and preview
          </Button>
        </Box>
      </Box>
    </>
  );
};

UploadFileStep.propTypes = {
  teamName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  uploadError: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onDownloadTemplate: PropTypes.func.isRequired,
};

UploadFileStep.defaultProps = {
  fileName: undefined,
  uploadError: '',
};

export default UploadFileStep;
