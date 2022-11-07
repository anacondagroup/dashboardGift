import React, { ChangeEvent, memo, useCallback, useEffect } from 'react';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, ColorPicker, Divider, FileInput, Icon } from '@alycecom/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  EmailBrandingFields,
  EmailBrandingImageName,
  IBrandingSettings,
  IUploadImageParams,
} from '../../store/emailBranding.types';
import {
  getBrandingSettings,
  getInitialBrandingSettings,
} from '../../store/brandingSettings/brandingSettings.selectors';
import { resetLogoImage, uploadBrandingImageRequest } from '../../store/brandingSettings/brandingSettings.actions';

import LogoFilePreview from './LogoFilePreview';
import BackgroundOptions from './BackgroundOptions';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: palette.text.primary,
  },
  tooltipIcon: {
    marginLeft: spacing(1),
  },
  colorField: {
    marginBottom: spacing(2),
  },
}));

export interface IBrandingFormProps {
  onChangeField: (data: Partial<IBrandingSettings>) => void;
}

const BrandingForm = ({ onChangeField }: IBrandingFormProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  const { companyLogoId: initialLogoId } = useSelector(getInitialBrandingSettings) || {};
  const { companyLogoUrl, companyLogoId } = useSelector(getBrandingSettings);

  const handleRemoveImage = useCallback(
    event => {
      event.preventDefault();
      event.stopPropagation();
      dispatch(resetLogoImage());
    },
    [dispatch],
  );

  const renderPreview = useCallback(
    (fileName: string | undefined | File) => {
      const canRemovedLogo = companyLogoId !== 0 && companyLogoId !== initialLogoId;
      return <LogoFilePreview fileName={fileName} canBeRemoved={canRemovedLogo} onRemoveImage={handleRemoveImage} />;
    },
    [handleRemoveImage, companyLogoId, initialLogoId],
  );

  const handleUploadImageField = useCallback(
    (data: IUploadImageParams) => {
      dispatch(uploadBrandingImageRequest(data));
    },
    [dispatch],
  );

  useEffect(() => {
    setValue(EmailBrandingFields.companyLogoUrl, companyLogoUrl);
  }, [companyLogoUrl, setValue]);

  return (
    <Box pb={3}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" my={2}>
        <Typography className={classes.sectionTitle}>Logo</Typography>
        <Tooltip title="If you are using a dark background for your emails, please upload a transparent, light-treatment logo meant for dark backgrounds. You can alternately use a regular, transparent logo with a light-colored background.">
          <span>
            <Icon className={classes.tooltipIcon} icon="exclamation-circle" color="grey.main" fontSize={1} />
          </span>
        </Tooltip>
      </Box>
      <Box mb={2}>
        <Controller
          control={control}
          name={EmailBrandingFields.companyLogoUrl}
          render={({ field: { onChange, value } }) => (
            <FileInput
              id="display-logo-file-input"
              fileName={value || ''}
              label="Logo"
              accept="image/png"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (!event?.target?.files || !event.target.files[0]) {
                  return;
                }
                const file = event.target.files[0];
                onChange(file.name);
                handleUploadImageField({ name: EmailBrandingImageName.logo, file });
              }}
              renderPreview={renderPreview}
              hintText="Only PNG files accepted"
            />
          )}
        />
      </Box>
      <Box mb={2}>
        <Controller
          control={control}
          name={EmailBrandingFields.companyLogoWidth}
          render={({ field: { onChange, value } }) => (
            <TextField
              name={EmailBrandingFields.companyLogoWidth}
              variant="outlined"
              value={value}
              label="Min. Logo Size (PX)"
              fullWidth
              error={!!errors.companyLogoWidth}
              helperText={errors.companyLogoWidth && errors.companyLogoWidth.message}
              onChange={({ target }) => {
                onChange(target.value);
                const parsedValue = parseInt(target.value, 10);
                const widthValue = Number.isNaN(parsedValue) ? 0 : parsedValue;
                onChangeField({ [EmailBrandingFields.companyLogoWidth]: widthValue });
              }}
            />
          )}
        />
      </Box>
      <Divider my={3} />
      <BackgroundOptions onChangeField={onChangeField} />
      <Divider my={3} />
      <Box display="flex" justifyContent="flex-start" alignItems="center" my={2}>
        <Typography className={classes.sectionTitle}>CTA Button</Typography>
      </Box>
      <Box>
        <Controller
          control={control}
          name={EmailBrandingFields.buttonColor}
          render={({ field: { onChange, value } }) => (
            <ColorPicker
              value={value}
              fieldProps={{
                name: EmailBrandingFields.buttonColor,
                label: 'CTA Button Color',
                error: !!errors.buttonColor,
                helperText: errors.buttonColor && errors.buttonColor.message,
              }}
              wrapperProps={{ mb: 2 }}
              onChange={(inputValue: string) => {
                onChange(inputValue);
                onChangeField({ [EmailBrandingFields.buttonColor]: inputValue });
              }}
            />
          )}
        />
        <Controller
          control={control}
          name={EmailBrandingFields.buttonTextColor}
          render={({ field: { onChange, value } }) => (
            <ColorPicker
              value={value}
              fieldProps={{
                name: EmailBrandingFields.buttonTextColor,
                label: 'CTA Button Text',
                error: !!errors.buttonTextColor,
                helperText: errors.buttonTextColor && errors.buttonTextColor.message,
              }}
              wrapperProps={{ mb: 2 }}
              onChange={(inputValue: string) => {
                onChange(inputValue);
                onChangeField({ [EmailBrandingFields.buttonTextColor]: inputValue });
              }}
            />
          )}
        />
      </Box>
      <Divider my={3} />
      <Box mt={2} mb={4}>
        <Box mb={3}>
          <Typography className={classes.sectionTitle}>Footer Content</Typography>
        </Box>
        <Box mb={2}>
          <Controller
            control={control}
            name={EmailBrandingFields.privacyPolicyUrl}
            render={({ field: { onChange, value } }) => (
              <TextField
                name={EmailBrandingFields.privacyPolicyUrl}
                variant="outlined"
                value={value}
                label="Privacy Policy Link"
                fullWidth
                error={!!errors.privacyPolicyUrl}
                helperText={errors.privacyPolicyUrl && errors.privacyPolicyUrl.message}
                onChange={({ target }) => {
                  onChange(target.value);
                  onChangeField({ [EmailBrandingFields.privacyPolicyUrl]: target.value });
                }}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Controller
            control={control}
            name={EmailBrandingFields.footerCopyrightInscription}
            render={({ field: { onChange, value } }) => (
              <TextField
                name={EmailBrandingFields.footerCopyrightInscription}
                variant="outlined"
                value={value}
                label="Copyright Attribution"
                fullWidth
                error={!!errors.footerCopyrightInscription}
                helperText={errors.footerCopyrightInscription && errors.footerCopyrightInscription.message}
                onChange={({ target }) => {
                  onChange(target.value);
                  onChangeField({ [EmailBrandingFields.footerCopyrightInscription]: target.value });
                }}
              />
            )}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default memo<IBrandingFormProps>(BrandingForm);
