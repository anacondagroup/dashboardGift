import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon, LoadingLabel } from '@alycecom/ui';
import { GlobalMessage } from '@alycecom/services';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    borderTop: `1px solid ${palette.divider}`,
    padding: spacing(3),
  },
  input: {
    display: 'none',
  },
  buttonUpload: {
    color: palette.link.main,
    backgroundColor: palette.common.white,
    boxShadow: 'none',
    height: 48,
  },
  red: {
    color: palette.red.main,
  },
  buttonRemove: {
    color: palette.red.main,
    marginTop: spacing(1),
    width: '100%',
    '& :hover': {
      boxShadow: 'none',
      fontWeight: 'bold',
    },
  },
  imageBox: {
    width: 88,
    height: 88,
    border: `1px dotted grey`,
    borderRadius: props => (props.variant === 'circle' ? '50%' : 5),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  image: {
    borderRadius: props => (props.variant === 'circle' ? '50%' : 5),
    width: 80,
    height: 80,
    backgroundColor: palette.grey.dark,
  },
  icon: {
    width: 40,
    height: 40,
  },
  buttonsBlocK: {
    marginLeft: spacing(4),
  },
}));

const UploadPictureComponent = ({
  alt,
  image,
  isLoading,
  onRemove,
  onChange,
  isAvatar,
  variant,
  accepted,
  maxSizeMb,
}) => {
  const classes = useStyles({ variant });
  const [open, setOpen] = useState(false);
  const [currentImageWidth, setCurrentImageWidth] = useState(0);

  const { showGlobalMessage } = GlobalMessage.useGlobalMessage();

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.decode().then(() => {
        const currentWidth = img.width > img.height ? 80 : 13;
        setCurrentImageWidth(currentWidth);
      });
    }
  }, [image, setCurrentImageWidth]);

  const preview = useMemo(
    () => (
      <Box className={classes.imageBox}>
        {image ? (
          <img src={image} alt={alt} width={currentImageWidth} />
        ) : (
          <Box display="flex" justifyContent="center" alignItems="center" className={classes.image}>
            <DashboardIcon icon={isAvatar ? 'user' : 'image'} className={classes.icon} color="grey" />
          </Box>
        )}
      </Box>
    ),
    [classes.imageBox, classes.image, classes.icon, image, alt, isAvatar, currentImageWidth],
  );

  const removeAvatarHandler = () => {
    document.getElementById('contained-button-file').value = '';
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fileChangedHandler = event => {
    if (event.target.files.length) {
      const file = event.target.files[0];
      if (maxSizeMb && file.size / 1024 / 1024 > maxSizeMb) {
        showGlobalMessage({ type: 'error', text: `Maximum file size ${maxSizeMb} Mb` });
        return;
      }
      onChange(file);
    }
  };

  const removeAvatarProcess = () => {
    setOpen(false);
    onRemove();
  };

  return (
    <Box display="flex">
      <Box display="flex" justifyContent="center" alignItems="flex-start">
        {isLoading ? <LoadingLabel /> : preview}
      </Box>
      <Box ml={3}>
        <Box>
          <label htmlFor="contained-button-file">
            <input
              accept={accepted}
              className={classes.input}
              id="contained-button-file"
              multiple
              type="file"
              onChange={fileChangedHandler}
            />
            <Button variant="outlined" className={classes.buttonUpload} component="span">
              Change
            </Button>
          </label>
        </Box>
        <Box item>
          <Button color="primary" className={classes.buttonRemove} onClick={removeAvatarHandler}>
            Remove
          </Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="draggable-dialog-title">
            <DialogTitle id="draggable-dialog-title">Are you sure?</DialogTitle>
            <DialogContent>
              <DialogContentText>Please confirm your image deletion.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button className={classes.red} onClick={removeAvatarProcess} autoFocus>
                Remove
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Box>
  );
};

UploadPictureComponent.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.string,
  isLoading: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  isAvatar: PropTypes.bool,
  variant: PropTypes.oneOf(['circle', 'square']),
  accepted: PropTypes.string,
  maxSizeMb: PropTypes.number,
};

UploadPictureComponent.defaultProps = {
  image: undefined,
  isLoading: false,
  alt: '',
  isAvatar: false,
  variant: 'circle',
  accepted: 'image/jpg, image/png, image/gif',
  maxSizeMb: undefined,
};

export default UploadPictureComponent;
