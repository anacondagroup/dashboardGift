import React from 'react';
import { Icon } from '@alycecom/ui';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';

export interface IExchangeOptionProps {
  title: string;
  subtitle: string;
  onClick: () => void;
}

const useStyles = makeStyles(() => ({
  root: {
    cursor: 'pointer',
  },
}));

const ExchangeOption = ({ title, subtitle, onClick }: IExchangeOptionProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box className={classes.root} onClick={onClick} display="flex" flexDirection="row" justifyContent="space-between">
      <Box display="flex" flexDirection="column">
        <Box color="link.main" fontSize="1.25rem" fontWeight={700}>
          {title}
        </Box>
        <Box mt={1} color="gray.main" fontSize="0.75rem">
          {subtitle}
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Icon color="link.main" icon="chevron-right" />
      </Box>
    </Box>
  );
};

export default ExchangeOption;
