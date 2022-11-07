import React, { useCallback, useEffect, memo, useMemo } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { CampaignSettings, CommonData, Features, HasFeature } from '@alycecom/modules';

import { useDetails } from '../../hooks/useDetails';
import { useActivate } from '../../hooks/useActivate';
import {
  fullDetailsFormSchema,
  detailsFormDefaultValues,
  DetailsFormFields,
  IDetailsFormValues,
} from '../../store/steps/details/detailsForm.schemas';
import { useTrackCampaignBuilderNextButtonClicked } from '../../hooks/useTrackActivate';
import { ActivateBuilderStep } from '../../routePaths';
import ActivateBuilderFooter from '../ActiateBuilderFooter/ActivateBuilderFooter';
import { useBuilderSteps } from '../../hooks/useBuilderSteps';

import CampaignName from './CampaignName';
import AssignedTeam from './AssignedTeam';
import CampaignManager from './CampaignManager';
import Countries from './Countries';
import ExpirationDate from './ExpirationDate';
import GiftLinkSettings from './GiftLinkSettings';
import EmailNotificationsSection from './EmailNotificationsSection';
import CampaignTrackingSection from './CampaignTrackingSection';
import GiftClaimStrategy from './GiftClaimStrategy';

const useStyles = makeStyles<AlyceTheme>(({ spacing }) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  control: {
    marginBottom: spacing(5),
    width: 400,
  },
}));

const DetailsStep = (): JSX.Element => {
  const classes = useStyles();
  const controlClasses = useMemo(() => ({ root: classes.control }), [classes]);
  const { goToNextStep } = useBuilderSteps();

  const { campaignId: draftId } = useActivate();
  const isMultipleLinksAvailable = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.MULTIPLE_GIFT_LINKS));
  const isFreeClaimEnabled = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ONE_TO_MANY_FREE_CLAIMS));
  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Details);

  const formMethods = useForm<IDetailsFormValues>({
    mode: 'all',
    defaultValues: detailsFormDefaultValues,
    resolver: yupResolver(fullDetailsFormSchema),
    context: { isMultipleLinksAvailable, isFreeClaimEnabled },
  });
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    setValue,
    reset,
  } = formMethods;

  const { data, isLoading, createDraftCampaign, updateDetailsStep } = useDetails();

  const countries = useSelector(CommonData.selectors.getCommonCountries);

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [reset, data]);

  const onSubmit = useCallback(
    (formValues: IDetailsFormValues) => {
      if (draftId) {
        if (isDirty) {
          const { countryIds } = formValues;
          const countryNames = countries.reduce<string[]>(
            (names, { id, name }) => (countryIds.includes(id) ? [...names, name] : names),
            [],
          );
          trackNextButtonClicked(draftId, {
            ...formValues,
            countryIds: countryIds.join(', '),
            countryNames: countryNames.join(', '),
          });

          return updateDetailsStep(formValues);
        }
        return goToNextStep();
      }
      return createDraftCampaign(formValues);
    },
    [draftId, goToNextStep, createDraftCampaign, updateDetailsStep, isDirty, trackNextButtonClicked, countries],
  );

  return (
    <FormProvider {...formMethods}>
      <Box component="form" className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
          Campaign Details
        </CampaignSettings.StyledSectionTitle>

        <CampaignName
          name={DetailsFormFields.Name}
          error={errors[DetailsFormFields.Name]?.message}
          classes={controlClasses}
        />

        <AssignedTeam
          name={DetailsFormFields.Team}
          draftId={draftId}
          control={control}
          setValue={setValue}
          error={errors[DetailsFormFields.Team]?.message}
          classes={controlClasses}
        />

        <CampaignManager classes={controlClasses} error={errors[DetailsFormFields.TeamOwner]?.message} />

        <Countries
          name={DetailsFormFields.CountryIds}
          draftId={draftId}
          control={control}
          setValue={setValue}
          classes={controlClasses}
        />

        <ExpirationDate />

        <HasFeature featureKey={Features.FLAGS.ONE_TO_MANY_FREE_CLAIMS}>
          <GiftClaimStrategy control={control} />
        </HasFeature>

        <GiftLinkSettings classes={controlClasses} error={errors[DetailsFormFields.SendAsId]?.message} />

        <Box mt={9} maxWidth={792}>
          <CampaignSettings.StyledSectionTitle mb={3}>EMAIL NOTIFICATIONS</CampaignSettings.StyledSectionTitle>
          <EmailNotificationsSection control={control} />
        </Box>

        <CampaignTrackingSection mt={7} />

        <ActivateBuilderFooter isLoading={isLoading} disabled={isLoading || !isValid} wrap isFirstStep />
      </Box>
    </FormProvider>
  );
};

export default memo(DetailsStep);
