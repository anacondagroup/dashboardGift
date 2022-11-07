import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon } from '@alycecom/ui';

const useStyles = makeStyles<AlyceTheme>({
  imagePreview: {
    width: 48,
    height: 48,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'contain',
  },
});

export interface ILogoFilePreviewProps {
  fileName: string | undefined | File;
  canBeRemoved?: boolean;
  onRemoveImage?: (event: React.MouseEvent<HTMLElement | SVGElement>) => void;
}

const LogoFilePreview = ({ fileName, canBeRemoved = false, onRemoveImage }: ILogoFilePreviewProps) => {
  const classes = useStyles();
  return fileName ? (
    <Box display="flex" alignItems="center" justifyContent="space-around">
      <Box className={classes.imagePreview} style={{ backgroundImage: fileName ? `url('${fileName}')` : '' }} mr={1} />
      {canBeRemoved && onRemoveImage && <Icon onClick={onRemoveImage} icon="times" color="grey.main" />}
    </Box>
  ) : (
    <Typography className="Body-Regular-Left-Static">No image</Typography>
  );
};

export default memo<ILogoFilePreviewProps>(LogoFilePreview);
