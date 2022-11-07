import React, { memo, ReactElement, useCallback } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';
import { useWindowScroll } from 'react-use';

const useStyles = makeStyles<AlyceTheme>({
  scrollBox: {
    cursor: 'pointer',
  },
});

const ScrollTopButton = (): ReactElement => {
  const classes = useStyles();
  const handleGoTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, []);
  const { y } = useWindowScroll();

  return (
    <Box
      position="sticky"
      width={1}
      bottom={0}
      display={y > 240 ? 'flex' : 'none'}
      alignItems="center"
      justifyContent="flex-end"
      bgcolor="common.white"
    >
      <Box
        className={classes.scrollBox}
        display="flex"
        width={80}
        height={50}
        mr={7.5}
        alignItems="center"
        justifyContent="center"
        fontWeight="bold"
        bgcolor="primary.main"
        onClick={handleGoTop}
      >
        <Icon icon="chevron-up" color="common.white" />
      </Box>
    </Box>
  );
};

export default memo(ScrollTopButton);
