import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Control, useController } from 'react-hook-form';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormHelperText,
  Grid,
  Theme,
} from '@mui/material';
import { GlobalMessage, MessageType } from '@alycecom/services';
import { Icon, LoadingLabel } from '@alycecom/ui';

import {
  TCardsDesignFormValues,
  CardsDesignDataFields,
} from '../../../../../store/swagCampaign/steps/codes/codes.types';
import { landscapeImageWidth, portraitImageWidth } from '../../../../../store/swagCampaign/steps/codes/codes.constants';

const styles = {
  root: {
    borderTop: ({ palette }: Theme) => `1px solid ${palette.divider}`,
    padding: ({ spacing }: Theme) => spacing(3),
  },
  input: {
    display: 'none',
  },
  buttonUpload: {
    color: ({ palette }: Theme) => palette.link.main,
    backgroundColor: ({ palette }: Theme) => palette.common.white,
    boxShadow: 'none',
    height: 48,
  },
  red: {
    color: ({ palette }: Theme) => palette.red.main,
  },
  buttonRemove: {
    color: ({ palette }: Theme) => palette.red.main,
    marginTop: ({ spacing }: Theme) => spacing(1),
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
    borderRadius: ({ spacing }: Theme) => spacing(0),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0.5,
  },
  image: {
    borderRadius: ({ spacing }: Theme) => spacing(0),
    width: 80,
    height: 80,
    backgroundColor: ({ palette }: Theme) => palette.grey.dark,
  },
  icon: {
    width: 40,
    height: 40,
  },
  buttonsBlocK: {
    marginLeft: ({ spacing }: Theme) => spacing(4),
  },
  errorMessage: {
    marginLeft: 0,
  },
} as const;

export interface IUploadLogoProps {
  alt: string;
  image?: string;
  isLoading?: boolean;
  onRemoveLogo: () => void;
  onChangeLogo: (file: File) => void;
  accepted: string;
  maxSizeMb: number;
  control: Control<TCardsDesignFormValues>;
}

const UploadLogo = ({
  alt,
  image,
  isLoading = false,
  onRemoveLogo,
  onChangeLogo,
  accepted,
  maxSizeMb,
  control,
}: IUploadLogoProps): JSX.Element => {
  const [open, setOpen] = useState(false);
  const [currentImageWidth, setCurrentImageWidth] = useState(0);

  const { showGlobalMessage } = GlobalMessage.useGlobalMessage();

  const name = CardsDesignDataFields.File;

  const {
    field: { onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const preview = useMemo(
    () => (
      <Box sx={styles.imageBox}>
        {image ? (
          <img
            src={image}
            alt={alt}
            width={currentImageWidth}
            data-testid="SwagBuilder.CodesStep.CardDesign.CardLogo.Logo"
          />
        ) : (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={styles.image}
            data-testid="SwagBuilder.CodesStep.CardDesign.CardLogo.EmptyLogo"
          >
            <Icon icon="image" sx={styles.icon} color="grey" />
          </Box>
        )}
      </Box>
    ),
    [currentImageWidth, image, alt],
  );

  const removeAvatarHandler = useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const fileChangedHandler = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event?.target?.files?.length) {
        const file = event.target.files[0];
        if (maxSizeMb && file.size / 1024 / 1024 > maxSizeMb) {
          showGlobalMessage({ type: MessageType.Error, text: `Maximum file size ${maxSizeMb} Mb` });
          return;
        }
        onChangeLogo(file);
        onChange(file);
      }
    },
    [maxSizeMb, showGlobalMessage, onChangeLogo, onChange],
  );

  const removeAvatarProcess = useCallback(() => {
    setOpen(false);
    onRemoveLogo();
    onChange(null);
  }, [setOpen, onRemoveLogo, onChange]);

  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.decode().then(() => {
        const currentWidth = img.width > img.height ? landscapeImageWidth : portraitImageWidth;
        setCurrentImageWidth(currentWidth);
      });
    }
  }, [image, setCurrentImageWidth]);

  return (
    <>
      <Box display="flex">
        <Box display="flex" justifyContent="center" alignItems="flex-start">
          {isLoading ? <LoadingLabel /> : preview}
        </Box>
        <Box ml={3}>
          <Box>
            <label htmlFor="contained-button-file">
              <Box sx={styles.input}>
                <input
                  accept={accepted}
                  id="contained-button-file"
                  multiple
                  type="file"
                  onChange={fileChangedHandler}
                />
              </Box>
              <Button variant="outlined" sx={styles.buttonUpload} component="span">
                Change
              </Button>
            </label>
          </Box>
          <Grid component={Box} item>
            <Button color="primary" disabled={!image} sx={styles.buttonRemove} onClick={removeAvatarHandler}>
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
                <Button sx={styles.red} onClick={removeAvatarProcess} autoFocus>
                  Remove
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Box>
      </Box>
      {!!error?.message && (
        <FormHelperText error sx={styles.errorMessage}>
          {error.message}
        </FormHelperText>
      )}
      <Box mt={1} className="Body-Small-Static">
        PNG file only, minimum image height: 600px <br />
        Maximum file size -5MB
      </Box>
    </>
  );
};

export default UploadLogo;
