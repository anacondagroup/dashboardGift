import React from 'react';
import { Box, Typography } from '@mui/material';
import { AlyceTheme } from '@alycecom/ui';
import { useTheme } from '@mui/styles';

import { noSearchResultsSvg } from '../../../assets';

interface INotFoundMessageProps {
  height?: number;
  top?: number;
  titleColor?: string;
  messageColor?: string;
}

export const NotFoundMessage = ({
  height = 0,
  top = 0,
  titleColor,
  messageColor,
}: INotFoundMessageProps): JSX.Element => {
  const { palette: colors } = useTheme<AlyceTheme>();
  const headerColor = titleColor || colors.text.primary;
  const textColor = messageColor || colors.grey.main;

  return (
    <Box position="relative" height={height} top={top} display="flex" flexDirection="column" alignItems="center">
      <img src={noSearchResultsSvg} alt="No result found" />
      <Box display="flex" width={250} flexDirection="column" alignItems="center" color={textColor}>
        <Typography style={{ fontWeight: 700, color: headerColor }}>No results found</Typography>
        <Typography>Try adjusting your search</Typography>
        <Typography>to find what you are looking for</Typography>
      </Box>
    </Box>
  );
};
