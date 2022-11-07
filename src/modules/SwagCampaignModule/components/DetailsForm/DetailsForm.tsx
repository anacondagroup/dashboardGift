import React, { ReactNode, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';
import { SectionTitleStyled } from '@alycecom/modules';

import { detailsFormDefaultValues, detailsFormResolver } from '../../store/swagCampaign/steps/details/details.schemas';
import { useSwag } from '../../hooks';
import { getDetailsData, getDetailsErrors } from '../../store/swagCampaign/steps/details/details.selectors';
import { TSwagDetailsFormValues } from '../../store/swagCampaign/swagCampaign.types';

import CampaignName from './Fields/CampaignName';
import Team from './Fields/Team';
import CampaignManager from './Fields/CampaignManager';
import Countries from './Fields/Countries';
import EmailNotificationsController from './Fields/EmailNotificationController';

export interface IDetailsChildRendererProps {
  isDirty: boolean;
}

export interface IDetailsFormProps {
  onSubmit: (values: TSwagDetailsFormValues, isDirty: boolean) => void;
  children: ReactNode | ((arg0: IDetailsChildRendererProps) => ReactNode);
}

const DetailsForm = ({ onSubmit, children }: IDetailsFormProps): JSX.Element => {
  const { campaignId } = useSwag();
  const {
    control,
    handleSubmit,
    formState: { isDirty },
    setError,
    reset,
  } = useForm<TSwagDetailsFormValues>({
    resolver: detailsFormResolver,
    defaultValues: detailsFormDefaultValues,
  });
  const data = useSelector(getDetailsData);
  const errors = useSelector(getDetailsErrors);

  const submitHandler = (form: TSwagDetailsFormValues) => {
    onSubmit(form, isDirty);
  };

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [reset, data]);

  useApplyManualFormErrorsEffect<TSwagDetailsFormValues>(setError, errors);

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Box mb={2}>
        <SectionTitleStyled>Campaign Details</SectionTitleStyled>
      </Box>
      <Grid component={Box} maxWidth={400} direction="column" container spacing={5}>
        <Grid item>
          <CampaignName control={control} />
        </Grid>
        <Grid item>
          <Team control={control} draft={!campaignId} />
        </Grid>
        <Grid item>
          <CampaignManager control={control} />
        </Grid>
        <Grid item>
          <Countries control={control} />
        </Grid>
      </Grid>
      <Box mt={3} mb={2}>
        <SectionTitleStyled>Email Notifications</SectionTitleStyled>
      </Box>
      <EmailNotificationsController control={control} />
      {typeof children === 'function' ? children({ isDirty }) : children}
    </form>
  );
};

export default DetailsForm;
