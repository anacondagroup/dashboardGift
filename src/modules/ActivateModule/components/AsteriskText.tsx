import { Box, BoxProps } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';
import React from 'react';
import classNames from 'classnames';

const useStyles = makeStyles<AlyceTheme>({
  root: {
    fontSize: 14,
  },
});

interface IAsteriskTextProps extends BoxProps {
  invalid?: boolean;
}

const AsteriskText = ({ invalid = false, children, ...boxProps }: IAsteriskTextProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box
      color={invalid ? 'red.main' : 'grey.main'}
      {...boxProps}
      className={classNames(classes.root, boxProps.className)}
    >
      {children}
    </Box>
  );
};

export default AsteriskText;
