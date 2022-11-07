import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Divider } from '@mui/material';
import { DashboardIcon } from '@alycecom/ui';

import downloadLink from '../../../../../../../../../assets/images/la-link-generated.png';

const DownloadCsvCodes = ({ classes, csvUrl, handleCloseAndGoToSettings }) => (
  <>
    <Box px={2}>
      <Box className="H4-Chambray">Hey now! Your swag select plus campaign is all set!</Box>
      <Box py={2} textAlign="center">
        <img src={downloadLink} alt="Download link" />
      </Box>
      <Box className={classes.description}>
        Now that you have your list of generate gift codes, start sending them off to your recipients! Remember to
        include www.alyce.com/card so that they know where to go to redeem them! You can also add as many recipients as
        you’d like after you save your campaign.
      </Box>
      <Box py={3}>
        <Divider />
      </Box>
      <Box display="flex" justifyContent="center">
        <a href={csvUrl} download>
          <Box width="320px">
            <Button variant="contained" color="secondary" fullWidth>
              <DashboardIcon className={classes.buttonIconLeft} color="inherit" icon="file-download" />
              Download CSV of your gift codes
            </Button>
          </Box>
        </a>
      </Box>
      <Box mt={2} display="flex" justifyContent="center">
        <Box width="320px">
          <Button variant="text" color="primary" onClick={handleCloseAndGoToSettings} fullWidth>
            <Box className="Body-Regular-Center-Link">Close and view all campaign settings</Box>
          </Button>
        </Box>
      </Box>
    </Box>
  </>
);

DownloadCsvCodes.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string),
  csvUrl: PropTypes.string,
  handleCloseAndGoToSettings: PropTypes.func.isRequired,
};

DownloadCsvCodes.defaultProps = {
  classes: {},
  csvUrl: undefined,
};

export default DownloadCsvCodes;
