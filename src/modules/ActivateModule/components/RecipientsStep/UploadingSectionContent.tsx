import React from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  description: {
    color: palette.grey.main,
    fontSize: 14,
  },
}));

interface IUploadingSectionContentProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const UploadingSectionContent = ({ title, description, children }: IUploadingSectionContentProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Box>
      <Box pb={4} pl={3} pr={3}>
        <Typography className="H4-Chambray">{title}</Typography>
        {description && <Typography className={classes.description}>{description}</Typography>}
      </Box>
      <Box px={3} pb={1}>
        {children}
      </Box>
    </Box>
  );
};

export default UploadingSectionContent;
