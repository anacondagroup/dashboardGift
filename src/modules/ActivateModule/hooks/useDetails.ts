import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';

import { getDetailsData, getIsDetailsLoading } from '../store/steps/details/details.selectors';
import { createActivateDraftRequest, updateDetailsRequest } from '../store/steps/details/details.actions';
import { IActivateDetails } from '../store';
import { TUpdateBuilderDetailsBody, TUpdateEditorDetailsBody } from '../store/steps/details/details.types';

interface IDetailsStepAdapter {
  createDraftCampaign: (detailsData: IActivateDetails) => void;
  updateDetailsStep: (detailsData: TUpdateBuilderDetailsBody | TUpdateEditorDetailsBody) => void;
  data?: IActivateDetails;
  isLoading: boolean;
}

export const useDetails = (): IDetailsStepAdapter => {
  const dispatch = useDispatch();

  const data = useSelector(getDetailsData);
  const isLoading = useSelector(getIsDetailsLoading);

  const createDraftCampaign = useCallback(
    (detailsData: IActivateDetails) => {
      dispatch(createActivateDraftRequest(detailsData));
    },
    [dispatch],
  );

  const updateDetailsStep = useCallback(
    (detailsData: TUpdateBuilderDetailsBody | TUpdateEditorDetailsBody) => {
      dispatch(updateDetailsRequest(detailsData));
    },
    [dispatch],
  );

  return {
    createDraftCampaign,
    updateDetailsStep,
    data,
    isLoading,
  };
};
