import React, { useCallback, useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';
import { EntityId } from '@alycecom/utils';
import { CampaignSettings, CommonData, Features } from '@alycecom/modules';

import CampaignName from '../../DetailsStep/CampaignName';
import CampaignManager from '../../DetailsStep/CampaignManager';
import ExpirationDate from '../../DetailsStep/ExpirationDate';
import { useActivate } from '../../../hooks/useActivate';
import { useDetails } from '../../../hooks/useDetails';
import {
  DetailsFormFields,
  TUpdateDetailsFormValues,
  updateDetailsFormDefaultValues,
  updateDetailsFormSchema,
} from '../../../store/steps/details/detailsForm.schemas';
import GiftLinkSettings from '../../DetailsStep/GiftLinkSettings';
import EmailNotificationsSection from '../../DetailsStep/EmailNotificationsSection';
import CampaignTrackingSection from '../../DetailsStep/CampaignTrackingSection';
import { useTrackCampaignEditorSaveButtonClicked } from '../../../hooks/useTrackActivate';
import ActivateTabsFooter from '../Tabs/ActivateTabsFooter/ActivateTabsFooter';
import TabTitle from '../../TabTitle';
import useConnectToSf from '../../../../../hooks/useConnectToSf';
import { ActivateBuilderStep } from '../../../routePaths';
import { getClaimType } from '../../../store/steps/details';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: spacing(11),
  },
  control: {
    width: 400,
    marginBottom: spacing(5),
  },
  linkControl: {
    width: 400,
  },
  connectSection: {
    padding: spacing(2, 0, 0),
  },
}));

const DetailsTab = (): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const controlClasses = useMemo(() => ({ root: classes.control }), [classes]);
  const trackCampaignEditorSaveButtonClicked = useTrackCampaignEditorSaveButtonClicked(ActivateBuilderStep.Details);

  const { campaignId } = useActivate();
  const isMultipleLinksAvailable = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.MULTIPLE_GIFT_LINKS), []),
  );
  const isFreeClaimEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ONE_TO_MANY_FREE_CLAIMS));
  const campaignClaimType = useSelector(getClaimType);

  const { handleConnectSFCampaign, isConnectToSFSectionDisplayed } = useConnectToSf(campaignId);

  const formMethods = useForm<TUpdateDetailsFormValues>({
    mode: 'onChange',
    defaultValues: updateDetailsFormDefaultValues,
    resolver: yupResolver(updateDetailsFormSchema),
    context: { isMultipleLinksAvailable, isFreeClaimEnabled },
    shouldUnregister: true,
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isDirty, isValid, dirtyFields },
    reset,
  } = formMethods;

  const { data, isLoading, updateDetailsStep } = useDetails();
  const isDisabled = !isValid || isLoading || !isDirty;

  const entities = useSelector(CampaignSettings.selectors.getTeamsMap);
  const getTeamLabel = (id: EntityId) => entities[id]?.name ?? '';

  const hasInternational = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.INTERNATIONAL), []),
  );
  const countries = useSelector(
    useMemo(() => CommonData.selectors.makeGetCountries(hasInternational), [hasInternational]),
  );
  const countryLabels = useMemo(
    () =>
      countries
        .filter(({ id }) => data?.countryIds?.includes(id))
        .map(({ name }) => name)
        .join(', '),
    [countries, data],
  );

  const onSubmit = useCallback(
    (formValues: TUpdateDetailsFormValues) => {
      const formValuesToSend = {
        ...formValues,
        claimType: campaignClaimType,
      };
      updateDetailsStep(formValuesToSend);
      if (campaignId) {
        trackCampaignEditorSaveButtonClicked(campaignId, formValues);
      }
    },
    [updateDetailsStep, trackCampaignEditorSaveButtonClicked, campaignId, campaignClaimType],
  );

  useEffect(() => {
    dispatch(CampaignSettings.actions.loadTeamsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      reset({
        [DetailsFormFields.Name]: data.campaignName,
        [DetailsFormFields.TeamOwner]: data.ownerId,
        [DetailsFormFields.ExpirationDate]: data.expirationDate,
        [DetailsFormFields.NotificationSettings]: data.notificationSettings,
        [DetailsFormFields.SendAsOption]: data.sendAsOption,
        [DetailsFormFields.SendAsId]: data.sendAsId,
        [DetailsFormFields.OwnPurpose]: data.ownPurpose,
        [DetailsFormFields.NumberOfRecipients]: data.numberOfRecipients,
        [DetailsFormFields.CampaignPurpose]: data.campaignPurpose,
      });
    }
  }, [reset, data]);

  return (
    <>
      <FormProvider {...formMethods}>
        <form className={classes.form}>
          <TabTitle maxWidth={580} mb={2}>
            Campaign Details
          </TabTitle>

          <CampaignName error={errors[DetailsFormFields.Name]?.message} classes={controlClasses} />

          <Box display="flex" flexDirection="column" className={classes.control}>
            <Typography className="Body-Regular-Left-Static-Bold">Assigned Team</Typography>
            <Typography>{data?.teamId && getTeamLabel(data.teamId)}</Typography>
          </Box>

          <CampaignManager classes={controlClasses} error={errors[DetailsFormFields.TeamOwner]?.message} />

          <Box display="flex" flexDirection="column" className={classes.control}>
            <Typography className="Body-Regular-Left-Static-Bold">Gift Recipient Countries</Typography>
            <Typography>{countryLabels}</Typography>
          </Box>

          <ExpirationDate />
        </form>

        <GiftLinkSettings classes={controlClasses} error={errors[DetailsFormFields.SendAsId]?.message} />

        <Box mt={9}>
          <CampaignSettings.SectionTitle>EMAIL NOTIFICATIONS</CampaignSettings.SectionTitle>
          <EmailNotificationsSection control={control} />
        </Box>
        <CampaignTrackingSection mt={7} />
        {isConnectToSFSectionDisplayed && (
          <Box mt={5}>
            <TabTitle>Connect to Salesforce</TabTitle>
            <CampaignSettings.SfConnectionSettings
              description="Connect this Alyce campaign with a Salesforce campaign to ensure that all Alyce gifts are synchronized with your Salesforce campaign."
              onChange={handleConnectSFCampaign}
              overrideStyles={{ root: classes.connectSection }}
            />
          </Box>
        )}
      </FormProvider>
      <ActivateTabsFooter
        isLoading={isLoading}
        disabled={isDisabled}
        displayWarningMessage={isDirty && Object.keys(dirtyFields).length !== 0}
        onSaveButtonClick={handleSubmit(onSubmit)}
      />
    </>
  );
};

export default DetailsTab;
