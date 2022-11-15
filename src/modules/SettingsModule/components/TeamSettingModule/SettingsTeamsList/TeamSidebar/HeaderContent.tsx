import React, { memo } from 'react';
import { Icon } from '@alycecom/ui';
import { Box, IconButton, Theme, Typography } from '@mui/material';

const styles = {
  container: {
    display: 'flex',
    height: '80px',
    width: '100%',
    padding: ({ spacing }: Theme) => spacing(2, 1, 2, 3),
    position: 'relative',
    '&::before': {
      position: 'absolute',
      content: "''",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
      background: ({ palette }: Theme) => `linear-gradient(to right, ${palette.green.dark}, ${palette.teal.main})`,
    },
    color: ({ palette }: Theme) => palette.common.white,
  },
  textContainer: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
  },
  closeButton: {
    color: ({ palette }: Theme) => palette.common.white,
    '& svg': {
      width: '26px !important',
      height: '26px !important',
    },
    marginLeft: ({ spacing }: Theme) => spacing(2),
  },
} as const;

export interface IHeaderContentProps {
  text: string;
  onClose: () => void;
}

const HeaderContent = ({ text, onClose }: IHeaderContentProps): JSX.Element => (
  <Box sx={styles.container}>
    <Box sx={styles.textContainer}>
      <Typography data-testid="TeamManagement.Sidebar.Header" variant="h4">
        {text}
      </Typography>
    </Box>
    <IconButton sx={styles.closeButton} onClick={onClose} data-testid="TeamManagement.Sidebar.Close" size="large">
      <Icon icon={['far', 'times']} />
    </IconButton>
  </Box>
);

export default memo(HeaderContent);
