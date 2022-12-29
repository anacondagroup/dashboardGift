import React, { ChangeEvent, memo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { ColorPicker, Divider, FileInput, Icon } from '@alycecom/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { useUploadBrandingImageMutation } from '@alycecom/services';

import {
  EmailBrandingFields,
  EmailBrandingImageName,
  IBrandingSettings,
  IUploadImageParams,
} from '../../store/emailBranding.types';
import { resetLogoImage } from '../../store/brandingSettings/brandingSettings.reducer';
import {
  getBrandingSettings,
  getInitialBrandingSettings,
} from '../../store/brandingSettings/brandingSettings.selectors';

import LogoFilePreview from './LogoFilePreview';
import BackgroundOptions from './BackgroundOptions';

const styles = {
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'text.primary',
  },
  tooltipIcon: {
    ml: 1,
  },
  colorField: {
    mb: 2,
  },
} as const;

export interface IBrandingFormProps {
  onChangeField: (data: Partial<IBrandingSettings>) => void;
}

const BrandingForm = ({ onChangeField }: IBrandingFormProps) => {
  const dispatch = useDispatch();
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();

  const { companyLogoId: initialLogoId } = useSelector(getInitialBrandingSettings) || {};
  const { companyLogoUrl, companyLogoId } = useSelector(getBrandingSettings);

  const [uploadBrandingImageRequest] = useUploadBrandingImageMutation();

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
      uploadBrandingImageRequest(data);
    },
    [uploadBrandingImageRequest],
  );

  useEffect(() => {
    setValue(EmailBrandingFields.companyLogoUrl, companyLogoUrl);
  }, [companyLogoUrl, setValue]);

  return (
    <Box pb={3}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" my={2}>
        <Typography sx={styles.sectionTitle}>Logo</Typography>
        <Tooltip title="If you are using a dark background for your emails, please upload a transparent, light-treatment logo meant for dark backgrounds. You can alternately use a regular, transparent logo with a light-colored background.">
          <span>
            <Icon sx={styles.tooltipIcon} icon="exclamation-circle" color="grey.main" fontSize={1} />
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
        <Typography sx={styles.sectionTitle}>CTA Button</Typography>
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
          <Typography sx={styles.sectionTitle}>Footer Content</Typography>
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
        <Box mb={2}>
          <Controller
            control={control}
            name={EmailBrandingFields.preferencesUrl}
            render={({ field: { onChange, value } }) => (
              <TextField
                name={EmailBrandingFields.preferencesUrl}
                variant="outlined"
                value={value}
                label="Manage Preferences Link"
                fullWidth
                error={!!errors.preferencesUrl}
                helperText={errors.preferencesUrl && errors.preferencesUrl.message}
                onChange={({ target }) => {
                  onChange(target.value);
                  onChangeField({ [EmailBrandingFields.preferencesUrl]: target.value });
                }}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Controller
            control={control}
            name={EmailBrandingFields.unsubscribeUrl}
            render={({ field: { onChange, value } }) => (
              <TextField
                name={EmailBrandingFields.unsubscribeUrl}
                variant="outlined"
                value={value}
                label="Unsubscribe Link"
                fullWidth
                error={!!errors.unsubscribeUrl}
                helperText={errors.unsubscribeUrl && errors.unsubscribeUrl.message}
                onChange={({ target }) => {
                  onChange(target.value);
                  onChangeField({ [EmailBrandingFields.unsubscribeUrl]: target.value });
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
