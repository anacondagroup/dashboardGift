import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon } from '@alycecom/ui';

export const useStyles = makeStyles(({ spacing, palette }) => ({
  integrationStatusIcon: {
    marginRight: spacing(1),
  },
  lockedBox: {
    backgroundColor: palette.primary.light,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  learnMore: {
    color: 'white',
    textDecoration: 'underline',
    fontSize: 12,
    fontWeight: 'normal',

    '&:hover': {
      color: 'white',
    },
  },
}));

interface IIntegrationStatusLockedProps {
  link: string;
}

const IntegrationStatusLocked = ({ link }: IIntegrationStatusLockedProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box mt={2} p={2} className={classes.lockedBox}>
      <Box display="flex">
        <Icon className={classes.integrationStatusIcon} icon="lock" color="white" />
        <Box ml={1} color="white">
          <Box fontWeight="bold" fontSize={14}>
            PREMIUM INTEGRATION
          </Box>
          <Box fontSize={12}>
            Available on the{' '}
            <Box display="inline" fontWeight="bold">
              Alyce Enterprise plan
            </Box>
          </Box>
        </Box>
      </Box>
      <a href={link} target="_blank" rel="noreferrer" className={classes.learnMore}>
        Learn more
      </a>
    </Box>
  );
};

export default IntegrationStatusLocked;
