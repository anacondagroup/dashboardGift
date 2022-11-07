import React from 'react';
import PropTypes from 'prop-types';
import { Box, Paper, Typography, TextField } from '@mui/material';
import { CopyToClipboardButton, HtmlTip } from '@alycecom/ui';

const OrganisationIntegrationMarketoWebhook = ({ webhooks }) => (
  <Paper mt={2} elevation={1}>
    <Box p={3}>
      <Box mb={2}>
        <Typography className="H3-Dark">Generated Marketo Webhook URL</Typography>
      </Box>
      {webhooks &&
        webhooks.map(webhook => (
          <Box key={webhook.uuid} pt={1} width={1} display="flex" alignItems="center">
            <Box width="60%">
              <TextField
                value={webhook.publicUrl}
                variant="outlined"
                label="Marketo Webhook URL"
                aria-readonly
                fullWidth
              />
            </Box>
            <CopyToClipboardButton title="Copy URL" value={webhook.publicUrl} />
          </Box>
        ))}
      <Box mt={2}>
        <HtmlTip>
          This URL will be generated upon Marketo integration connection. It will be regenerated each time a connection
          is disconnected and then reconnected.
        </HtmlTip>
      </Box>
    </Box>
  </Paper>
);

OrganisationIntegrationMarketoWebhook.propTypes = {
  webhooks: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      publicUrl: PropTypes.string,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
};

export default OrganisationIntegrationMarketoWebhook;
