import React, { useCallback, useEffect } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { CampaignSettings } from '@alycecom/modules';

import { getUploadRequestAttributes } from '../../store/steps/recipients';
import { createCampaignRequest, getIsFinalizeLoading } from '../../store/steps/finalize';
import { getDetailsData } from '../../store/steps/details';
import { getDefaultGift } from '../../store/steps/gift';
import { useActivate } from '../../hooks/useActivate';
import { useTrackCampaignBuilderNextButtonClicked } from '../../hooks/useTrackActivate';
import { getDefaultGiftProducts } from '../../store/entities/defaultGiftProducts/defaultGiftProducts.selectors';
import MultiCountryDefaultGifts from '../GiftStep/MultiCountryDefaultGifts/MultiCountryDefaultGifts';
import { loadDefaultGiftProductsRequest } from '../../store/entities/defaultGiftProducts/defaultGiftProducts.actions';
import { ActivateBuilderStep } from '../../routePaths';
import { useBuilderSteps } from '../../hooks/useBuilderSteps';
import ActivateBuilderFooter from '../ActiateBuilderFooter/ActivateBuilderFooter';

import CampaignDetailsSection from './CampaignDetailsSection';
import RecipientsSection from './RecipientsSection';
import ExchangeOptionSection from './ExchangeOptionSection';
import MessagingSection from './MessagingSection';

const FinalizeStep = (): JSX.Element => {
  const dispatch = useDispatch();
  const trackNextButtonClicked = useTrackCampaignBuilderNextButtonClicked(ActivateBuilderStep.Finalize);

  const { campaignId: draftId } = useActivate();
  const { goToPrevStep } = useBuilderSteps();

  const details = useSelector(getDetailsData);
  const defaultGift = useSelector(getDefaultGift);
  const defaultGiftProducts = useSelector(getDefaultGiftProducts);

  const attributes = useSelector(getUploadRequestAttributes);
  const isLoading = useSelector(getIsFinalizeLoading);

  const createActivateCampaign = useCallback(() => {
    if (draftId) {
      dispatch(createCampaignRequest({ draftId }));
      trackNextButtonClicked(draftId);
    }
  }, [dispatch, draftId, trackNextButtonClicked]);

  useEffect(() => {
    if (draftId && defaultGift) {
      dispatch(loadDefaultGiftProductsRequest({ campaignId: draftId }));
    }
  }, [dispatch, draftId, defaultGift]);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Campaign Details
      </CampaignSettings.StyledSectionTitle>
      <Box>
        {details && (
          <CampaignDetailsSection
            teamId={details.teamId}
            ownerId={details.ownerId}
            countryIds={details.countryIds}
            expiry={details.expirationDate}
          />
        )}

        {defaultGift && (
          <Box mb={9} maxWidth={650}>
            <MultiCountryDefaultGifts products={defaultGiftProducts} />
          </Box>
        )}

        <ExchangeOptionSection />

        <MessagingSection />

        <RecipientsSection total={attributes?.completed ?? 0} source={attributes?.source ?? null} />
      </Box>
      <ActivateBuilderFooter
        isLoading={isLoading}
        disabled={isLoading}
        wrap
        isLastStep
        onClickNext={createActivateCampaign}
        onClickBack={goToPrevStep}
      />
    </>
  );
};

export default FinalizeStep;
