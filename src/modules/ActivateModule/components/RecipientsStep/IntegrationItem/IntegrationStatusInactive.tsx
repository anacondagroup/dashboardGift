import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon } from '@alycecom/ui';

const useStyles = makeStyles(() => ({
  disabledLink: {
    pointerEvents: 'none',
  },
}));

interface IntegrationStatusInactiveProps {
  contactEmail?: string;
  integrationName: string;
  errorMessage?: string;
}

const IntegrationStatusInactive = ({
  contactEmail,
  integrationName,
  errorMessage,
}: IntegrationStatusInactiveProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box mt={2}>
      <Box display="flex" alignItems="center" className="Body-Regular-Left-Error-Bold">
        <Icon icon="info-circle" color="inherit" />
        {errorMessage && <Box ml={1}>Integration inactive</Box>}
      </Box>
      <Box mt={1} className="Body-Regular-Left-Error">
        Your {integrationName} integration is not currently active. Please
        {contactEmail ? (
          <a
            href={`mailto:${contactEmail}`}
            className={`Body-Regular-Left-Link-Bold ${!contactEmail && classes.disabledLink}`}
          >
            contact your admin{' '}
          </a>
        ) : (
          ' contact your admin '
        )}
        to help resolve this issue.
      </Box>
    </Box>
  );
};

export default IntegrationStatusInactive;
