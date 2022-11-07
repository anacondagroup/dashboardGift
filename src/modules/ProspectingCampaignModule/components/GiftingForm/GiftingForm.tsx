import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { clone } from 'ramda';
import { Box } from '@mui/material';
import { useApplyManualFormErrorsEffect } from '@alycecom/hooks';

import {
  giftingFormDefaultValues,
  giftingFormResolver,
} from '../../store/prospectingCampaign/steps/gifting/gifting.schemas';
import { useProspecting } from '../../hooks';
import { makeGetGiftingLocalDraftById } from '../../store/prospectingCampaign/ui/giftingStepLocalDraft/giftingStepLocalDraft.selectors';
import { SectionTitle } from '../styled/Styled';
import { useTeamProductTypes } from '../../../MarketplaceModule/hooks/useTeamProductTypes';
import { getDetailsData } from '../../store/prospectingCampaign/steps/details/details.selectors';
import {
  getGiftingDataAsFormValues,
  getGiftingErrors,
  getIsGiftingFulfilled,
} from '../../store/prospectingCampaign/steps/gifting/gifting.selectors';
import {
  GiftingStepFields,
  TProspectingGiftingForm,
} from '../../store/prospectingCampaign/steps/gifting/gifting.types';

import ConfigureMarketplaces from './controllers/ConfigureMarketplaces/ConfigureMarketplaces';
import ConfigureLeadingGiftController from './controllers/ConfigureLeadingGiftController/ConfigureLeadingGiftController';
import ConfigureGiftActionsController from './controllers/ConfigureGiftActionsController/ConfigureGiftActionsController';
import ConfigureRecipientActionsController from './controllers/ConfigureRecipientActionsController/ConfigureRecipientActionsController';

export interface IGiftingFormChildrenProps {
  isDirty: boolean;
}

export interface IGiftingFormProps {
  children: ReactNode | ((arg0: IGiftingFormChildrenProps) => ReactNode);
  onSubmit: (value: TProspectingGiftingForm, isDirty: boolean) => void;
}

const GiftingForm = ({ children, onSubmit }: IGiftingFormProps): JSX.Element => {
  const { campaignId } = useProspecting();
  const { teamId, countryIds = [] } = useSelector(getDetailsData) || {};
  const giftingData = useSelector(getGiftingDataAsFormValues);
  const errors = useSelector(getGiftingErrors);
  const isFulfilled = useSelector(getIsGiftingFulfilled);
  const isGiftingDataExist = !!giftingData;

  const { useAvailableByCountryIds } = useTeamProductTypes({ teamId });
  const {
    control,
    trigger,
    reset,
    resetField,
    handleSubmit,
    setError,
    formState: { isDirty },
  } = useForm<TProspectingGiftingForm>({
    mode: 'all',
    resolver: giftingFormResolver,
    defaultValues: useMemo(() => clone(giftingFormDefaultValues), []),
    context: {
      permittedProductTypeIds: useAvailableByCountryIds(countryIds),
    },
  });
  const persistValue = useSelector(
    useMemo(() => (campaignId ? makeGetGiftingLocalDraftById(campaignId) : () => null), [campaignId]),
  );
  const isMount = useRef(false);

  useEffect(() => {
    if (isMount.current) {
      return;
    }
    if (persistValue && !isGiftingDataExist && isFulfilled) {
      reset(clone(persistValue), { keepDefaultValues: false });
    }

    if (isFulfilled) {
      isMount.current = true;
    }
  }, [reset, persistValue, trigger, isGiftingDataExist, isFulfilled]);

  useEffect(() => {
    if (giftingData) {
      reset(clone(giftingData), { keepDefaultValues: false });
    }
  }, [reset, giftingData]);

  useApplyManualFormErrorsEffect<TProspectingGiftingForm>(setError, errors);

  const customMarketplaceData = useWatch({ control, name: GiftingStepFields.CustomMarketplaceData });

  const submitHandler = (form: TProspectingGiftingForm) => {
    const hasChanges = isDirty || customMarketplaceData?.id !== giftingData?.customMarketplaceData?.id;
    onSubmit(form, hasChanges);
  };

  return (
    <Box component="form" display="flex" flexDirection="column" onSubmit={handleSubmit(submitHandler)}>
      <Box flex="1 1 auto" mb={20}>
        <Box mb={1.5}>
          <SectionTitle>Gift Details</SectionTitle>
        </Box>
        <Box mb={6.5}>
          <ConfigureMarketplaces control={control} trigger={trigger} resetField={resetField} />
        </Box>
        <Box mb={8}>
          <ConfigureLeadingGiftController control={control} />
        </Box>
        <ConfigureGiftActionsController control={control} />
        <Box mt={10} mb={3}>
          <SectionTitle>Gift Redemption Required Actions</SectionTitle>
        </Box>
        <ConfigureRecipientActionsController resetField={resetField} control={control} />
      </Box>
      {typeof children === 'function' ? children({ isDirty }) : children}
    </Box>
  );
};

export default GiftingForm;
