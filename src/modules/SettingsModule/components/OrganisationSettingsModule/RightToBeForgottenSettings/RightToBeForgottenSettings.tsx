import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';

import DashboardLayout from '../../../../../components/Dashboard/Shared/DashboardLayout';

import RightToBeForgottenSettingsForm from './RightToBeForgottenSettingsForm';

const RightToBeForgottenSettings = (): JSX.Element => (
  <DashboardLayout>
    <Box mb={2}>
      <Typography className="H3-Dark">Alyce Data Privacy Portal</Typography>
    </Box>
    <Paper elevation={1}>
      <Box p={3}>
        <Grid container lg={8} md={10} xs={12} direction="column" spacing={3}>
          <Grid item xs={12}>
            <Box color="grey.main">Exercise the following rights on behalf of consumers or gift recipients here:</Box>
            <ul>
              <li>
                <strong>Remove data: </strong>{' '}
                <Box display="inline" color="grey.main">
                  Alyce will remove all personal data that it has about the recipient. Only the email will be stored
                  with a timestamp of removal data.
                </Box>
              </li>
              <li>
                <strong>Restrict processing: </strong>
                <Box display="inline" color="grey.main">
                  Alyce and the 3rd parties will keep recipient’s data. However, there will be no future communication.
                </Box>
              </li>
              <li>
                <strong>Data Access: </strong>
                <Box display="inline" color="grey.main">
                  Alyce will export all personal data to a spreadsheet for which Alyce customers may deliver to a
                  consumer.
                </Box>
              </li>
            </ul>
            <Box>
              <strong>Alyce cannot guarantee that data is deleted from your other 3rd party companies. </strong>{' '}
              <Box display="inline" color="grey.main">
                Alyce will delete data in its own systems and in databases or systems used to process the data. For
                instance, Alyce cannot delete data from your instance of Salesforce simply because Alyce maintains an
                integration with Salesforce.
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <RightToBeForgottenSettingsForm />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  </DashboardLayout>
);

export default RightToBeForgottenSettings;
