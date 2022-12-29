import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceTheme, ModalConfirmationMessage } from '@alycecom/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { batch, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useRouting } from '@alycecom/hooks';
import { MessageType, showGlobalMessage, usePutBrandingSettingsMutation } from '@alycecom/services';

import { EmailBrandingFields, IBrandingSettings } from '../../store/emailBranding.types';
import { setBrandingSettings } from '../../store/brandingSettings/brandingSettings.reducer';
import { brandingSettingsDefaultValue, validationSchema } from '../../store/brandingSettings/brandingSettings.schemas';
import EmailBrandingForm from '../EmailBrandingForm/EmailBrandingForm';
import {
  getBrandingSettings,
  getInitialBrandingSettings,
} from '../../store/brandingSettings/brandingSettings.selectors';

const useStyles = makeStyles<AlyceTheme>(({ palette, zIndex }) => ({
  sidebar: {
    width: 320,
  },
  discardButton: {
    color: palette.link.main,
    height: 48,
  },
  buttonsWrapper: {
    width: 320,
    height: 80,
    position: 'fixed',
    bottom: 0,
    backgroundColor: palette.common.white,
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
    zIndex: zIndex.drawer,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}));

const EmailBrandingSidebar = () => {
  const classes = useStyles();
  const { teamId } = useParams<{ teamId: string }>();
  const dispatch = useDispatch();
  const go = useRouting();
  const initialBranding = useSelector(getInitialBrandingSettings);

  const branding = useSelector(getBrandingSettings);

  const [
    updateBrandingSettings,
    { isLoading: isSavingSettings, isSuccess: isUpdateSuccess },
  ] = usePutBrandingSettingsMutation();

  const methods = useForm<IBrandingSettings>({
    mode: 'all',
    defaultValues: brandingSettingsDefaultValue,
    resolver: yupResolver(validationSchema),
  });
  const {
    reset,
    getValues,
    formState: { isValid, isDirty },
  } = methods;

  const [brandingValues, setBrandingValues] = useState<IBrandingSettings | undefined>(initialBranding);

  const handleDiscardChanges = useCallback(() => {
    go(`/settings/teams/${teamId}/settings-and-permissions/general`);
  }, [go, teamId]);

  const handleChangeField = useCallback(
    (data: Partial<IBrandingSettings>) => {
      const values = getValues();
      const newBrandingValues = { ...values, ...data };
      validationSchema.isValid(newBrandingValues).then(isValidData => {
        if (isValidData) {
          setBrandingValues(newBrandingValues);
        }
      });
    },
    [setBrandingValues, getValues],
  );

  useDebounce(
    () => {
      if (brandingValues) {
        dispatch(setBrandingSettings(brandingValues));
      }
    },
    300,
    [brandingValues, dispatch],
  );

  const handleApply = useCallback(
    (data: IBrandingSettings) => {
      updateBrandingSettings({ settings: { ...branding, ...data }, teamId: Number(teamId) });
    },
    [teamId, branding, updateBrandingSettings],
  );

  useEffect(() => {
    if (initialBranding) {
      reset({
        [EmailBrandingFields.companyLogoUrl]: initialBranding.companyLogoUrl,
        [EmailBrandingFields.companyLogoWidth]: initialBranding.companyLogoWidth,
        [EmailBrandingFields.headerBackgroundColor]: initialBranding.headerBackgroundColor,
        [EmailBrandingFields.headerItemsColor]: initialBranding.headerItemsColor,
        [EmailBrandingFields.headerItemsOpacity]: initialBranding.headerItemsOpacity,
        [EmailBrandingFields.buttonColor]: initialBranding.buttonColor,
        [EmailBrandingFields.buttonTextColor]: initialBranding.buttonTextColor,
        [EmailBrandingFields.privacyPolicyUrl]: initialBranding.privacyPolicyUrl,
        [EmailBrandingFields.footerCopyrightInscription]: initialBranding.footerCopyrightInscription,
        [EmailBrandingFields.preferencesUrl]: initialBranding.preferencesUrl,
        [EmailBrandingFields.unsubscribeUrl]: initialBranding.unsubscribeUrl,
      });
    }
  }, [reset, initialBranding]);

  useEffect(() => {
    if (isUpdateSuccess) {
      batch(() => {
        dispatch(
          showGlobalMessage({
            type: MessageType.Success,
            text: `Success! Your styling changes will be applied to your emails`,
          }),
        );
      });
    }
  }, [isUpdateSuccess, dispatch]);

  const isSaveDisabled = !isDirty || !isValid || isSavingSettings;

  const [isOpenDiscardModal, setIsOpenDiscardModal] = useState<boolean>(false);
  const handleOpenDiscardModal = useCallback(() => {
    if (isSaveDisabled) {
      handleDiscardChanges();
    } else {
      setIsOpenDiscardModal(true);
    }
  }, [isSaveDisabled, handleDiscardChanges]);
  const handleCloseDiscardModal = useCallback(() => setIsOpenDiscardModal(false), []);

  return (
    <>
      <Drawer
        className={classes.sidebar}
        anchor="left"
        variant="permanent"
        ModalProps={{ BackdropProps: { invisible: true }, disablePortal: true }}
      >
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleApply)}>
            <Box height={1} width={320} bgcolor="common.white" position="relative" minHeight={1} pb={6}>
              <Box
                width={1}
                height={80}
                bgcolor="primary.dark"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={2}
              >
                <Typography className="H4-White">Edit Custom Branding</Typography>
              </Box>
              <Box px={2}>
                <EmailBrandingForm onChangeField={handleChangeField} />
              </Box>
              <Box className={classes.buttonsWrapper}>
                <Button
                  className={classes.discardButton}
                  variant="outlined"
                  onClick={handleOpenDiscardModal}
                  disabled={isSavingSettings}
                >
                  Cancel
                </Button>
                <ActionButton type="submit" width={140} disabled={isSaveDisabled}>
                  Save changes
                </ActionButton>
              </Box>
            </Box>
          </form>
        </FormProvider>
      </Drawer>
      <ModalConfirmationMessage
        isOpen={isOpenDiscardModal}
        title="Discard Changes?"
        width="100%"
        icon="pencil"
        submitButtonText="Discard Changes"
        cancelButtonText="Cancel"
        backdropStyles={{ top: 0 }}
        onSubmit={handleDiscardChanges}
        onDiscard={handleCloseDiscardModal}
      >
        <Typography className="Body-Regular-Left-Static">
          Please confirm that you would like to discard your changes to this email theme.
        </Typography>
      </ModalConfirmationMessage>
    </>
  );
};

export default memo(EmailBrandingSidebar);
