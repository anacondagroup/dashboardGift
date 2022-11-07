import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import {
  setOpenCloseCardsSettingsBar,
  setOpenCloseCodesSettingsBar,
  saveSwagDraftCardOrder,
  saveSwagDraftCardDesign,
} from '../../../../store/swagCampaign/steps/codes/codes.actions';
import { CodesType, EXPIRATION_DATE_FORMAT } from '../../../../store/swagCampaign/steps/codes/codes.constants';
import { TDigitalCodesFormValues } from '../../../../store/swagCampaign/steps/codes/codes.types';
import { TSwagCardOrder, TSwagCardDesign } from '../../../../store/swagCampaign/swagCampaign.types';
import {
  getCardDesign,
  getCardsOrder,
  getGiftCodeFormat,
} from '../../../../store/swagCampaign/steps/codes/codes.selectors';
import { useSwag } from '../../../../hooks/useSwag';
import SwagBuilderFooter from '../SwagBuilderFooter/SwagBuilderFooter';
import { useBuilderSteps } from '../../../../hooks/useBuilderSteps';
import CodesForm from '../../../../components/CodesForm/CodesForm';
import { useTrackSwagCampaignBuilderNextButtonClicked } from '../../../../hooks/useTrackSwag';
import { SwagCampaignBuilderStep } from '../../../../routePaths';

const CodesStep = (): JSX.Element => {
  const dispatch = useDispatch();

  const giftCodeFormat = useSelector(getGiftCodeFormat);
  const cardDesignData = useSelector(getCardDesign);
  const isCardDesignData = !!cardDesignData;
  const cardOrderData = useSelector(getCardsOrder);
  const isCardOrderData = !!cardOrderData;

  const { campaignId } = useSwag();
  const { goToNextStep, goToPrevStep } = useBuilderSteps();
  const trackNextButtonClick = useTrackSwagCampaignBuilderNextButtonClicked(SwagCampaignBuilderStep.Codes);

  const handleSubmitForm = useCallback(
    (values: TDigitalCodesFormValues, isDirty: boolean) => {
      if (giftCodeFormat === CodesType.Physical) {
        if (!isCardOrderData) {
          dispatch(setOpenCloseCodesSettingsBar(true));
          return;
        }
        if (!isCardDesignData) {
          dispatch(setOpenCloseCardsSettingsBar(true));
          return;
        }

        const formCardOrderData = {
          ...cardOrderData,
          draftId: campaignId,
        } as TSwagCardOrder & { draftId: number | null };

        const formCardDesignData = {
          ...cardDesignData,
          draftId: campaignId,
        } as TSwagCardDesign & { draftId: number | null };

        dispatch(saveSwagDraftCardOrder.pending(formCardOrderData));
        dispatch(saveSwagDraftCardDesign.pending(formCardDesignData));

        goToNextStep();
      }

      if (giftCodeFormat === CodesType.Digital) {
        if (!isDirty && campaignId) {
          goToNextStep();
          return;
        }

        if (isDirty && campaignId) {
          const formData = {
            ...values,
            draftId: campaignId,
            codesExpirationDate: moment(values.codesExpirationDate).format(EXPIRATION_DATE_FORMAT),
          };
          dispatch(saveSwagDraftCardOrder.pending(formData));
          trackNextButtonClick(campaignId, { cardOrder: formData });
          goToNextStep();
        }
      }
    },
    [
      campaignId,
      cardDesignData,
      cardOrderData,
      isCardOrderData,
      isCardDesignData,
      giftCodeFormat,
      goToNextStep,
      dispatch,
      trackNextButtonClick,
    ],
  );

  return (
    <CodesForm onSubmit={handleSubmitForm}>
      <SwagBuilderFooter wrap onClickBack={goToPrevStep} />
    </CodesForm>
  );
};

export default CodesStep;
