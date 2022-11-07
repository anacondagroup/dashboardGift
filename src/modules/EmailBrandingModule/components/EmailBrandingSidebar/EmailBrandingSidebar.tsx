import React, { memo, useCallback, useEffect, useState } from 'react';
import { Box, Button, Drawer, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ActionButton, AlyceTheme, ModalConfirmationMessage } from '@alycecom/ui';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useRouting } from '@alycecom/hooks';

import {
  getBrandingSettings,
  getInitialBrandingSettings,
  getIsSaveInProgress,
} from '../../store/brandingSettings/brandingSettings.selectors';
import { EmailBrandingFields, IBrandingSettings } from '../../store/emailBranding.types';
import {
  loadBrandingSettingsRequest,
  setBrandingSettings,
  updateBrandingSettingsRequest,
} from '../../store/brandingSettings/brandingSettings.actions';
import { validationSchema } from '../../store/brandingSettings/brandingSettings.schemas';
import EmailBrandingForm from '../EmailBrandingForm/EmailBrandingForm';

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
  const isSaveInProgress = useSelector(getIsSaveInProgress);

  const methods = useForm<IBrandingSettings>({
    mode: 'all',
    defaultValues: {
      [EmailBrandingFields.companyLogoUrl]: '',
      [EmailBrandingFields.companyLogoWidth]: 0,
      [EmailBrandingFields.headerBackgroundColor]: '',
      [EmailBrandingFields.headerItemsColor]: '',
      [EmailBrandingFields.headerItemsOpacity]: 0,
      [EmailBrandingFields.buttonColor]: '',
      [EmailBrandingFields.buttonTextColor]: '',
      [EmailBrandingFields.privacyPolicyUrl]: '',
      [EmailBrandingFields.footerCopyrightInscription]: '',
    },
    resolver: yupResolver(validationSchema),
  });
  const {
    reset,
    getValues,
    formState: { isValid, isDirty },
  } = methods;

  const handleDiscardChanges = useCallback(() => {
    go(`/settings/teams/${teamId}/settings-and-permissions/general`);
  }, [go, teamId]);

  const handleChangeField = useCallback(
    (data: Partial<IBrandingSettings>) => {
      const values = getValues();
      const brandingValues = { ...values, ...data };
      validationSchema.isValid(brandingValues).then(isValidData => {
        if (isValidData) {
          dispatch(setBrandingSettings(brandingValues));
        }
      });
    },
    [dispatch, getValues],
  );

  const handleApply = useCallback(
    (data: IBrandingSettings) => {
      dispatch(updateBrandingSettingsRequest({ settings: { ...branding, ...data }, teamId: Number(teamId) }));
    },
    [dispatch, teamId, branding],
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
      });
    }
  }, [reset, initialBranding]);

  useEffect(() => {
    if (teamId) {
      dispatch(loadBrandingSettingsRequest({ teamId: Number(teamId) }));
    }
  }, [dispatch, teamId]);

  const isSaveDisabled = !isDirty || !isValid || isSaveInProgress;

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
                  disabled={isSaveInProgress}
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
