import React from 'react';
import classNames from 'classnames';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';

import IntegrationStatusInactive from './IntegrationStatusInactive';
import IntegrationStatusLocked from './IntegrationStatusLocked';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  icon: {
    fontSize: '3rem',
    width: '60px !important',
  },
  button: {
    cursor: 'pointer',
  },
  content: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingRight: spacing(3),
    marginLeft: spacing(1),
  },
  description: {
    marginTop: spacing(1),
    fontSize: 16,
    lineHeight: 1.5,
    color: palette.grey.main,
  },
}));

interface IntegrationItemProps {
  title: string;
  integrationName: string;
  description: string;
  logo: string;
  alt: string;
  link: string;
  isEnabled: boolean;
  isActive: boolean;
  isLoading: boolean;
  error?: string;
  onClick: () => void;
}

const IntegrationItem = ({
  logo,
  alt,
  title,
  integrationName,
  link,
  description,
  isEnabled,
  isActive,
  isLoading,
  error,
  onClick,
}: IntegrationItemProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      className={classNames({ [classes.button]: isActive })}
      onClick={onClick}
    >
      <Box display="flex" flex={1}>
        <Box display="flex" alignItems="center">
          <img src={logo} alt={alt} className={classes.icon} />
        </Box>
        <Box className={classes.content}>
          <Box className={isActive ? 'Body-Medium-Link' : 'Body-Medium-Link-Disabled'}>{title}</Box>

          {isLoading && (
            <Box display="flex" mt={2} className="Body-Regular-Left-Link-Bold">
              <Icon spin icon="spinner" color="inherit" />
              <Box ml={1}>Checking integration status...</Box>
            </Box>
          )}

          {!isEnabled && <IntegrationStatusLocked link={link} />}

          {isActive && <Box className={classes.description}>{description}</Box>}

          {!isActive && error && <IntegrationStatusInactive integrationName={integrationName} errorMessage={error} />}
        </Box>
      </Box>
      <Icon color={isActive ? 'link' : 'grey.main'} icon="chevron-right" />
    </Box>
  );
};

export default IntegrationItem;
