import React, { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Features } from '@alycecom/modules';

import { setContactsUploadingSectionState } from '../../../../store/ui/createPage/contactsSidebar';
import {
  clearMarketoFolders,
  getIsMarketoDataLoading,
  getMarketoData,
  getSelectedMarketoListType,
  loadMarketoIntegrationDataRequest,
  setMarketoListType,
} from '../../../../store/steps/recipients/marketo';
import { ContactsUploadingStates } from '../../../../constants/recipientSidebar.constants';
import { getIsRecipientsSourceTypeDefined } from '../../../../store/steps/recipients';
import { UploadRequestSourceTypes } from '../../../../store/steps/recipients/uploadRequest/uploadRequest.types';

import ChooseMarketoContactSource from './ChooseMarketoContactSource/ChooseMarketoContactSource';
import MarketoStaticList from './MarketoStaticList/MarketoStaticList';
import MarketoSmartList from './MarketoSmartList/MarketoSmartList';

const MarketoUploading = (): JSX.Element => {
  const dispatch = useDispatch();

  const selectedListType = useSelector(getSelectedMarketoListType);

  const isMovingBackwardAllowed = !useSelector(getIsRecipientsSourceTypeDefined);
  const isIntegrationEnabled = useSelector(useMemo(() => Features.selectors.hasFeatureFlag('marketoIntegration'), []));
  const isLoading = useSelector(getIsMarketoDataLoading);
  const data = useSelector(getMarketoData);
  const uuid = data && data.uuid;

  useEffect(() => {
    if (isIntegrationEnabled) {
      dispatch(loadMarketoIntegrationDataRequest());
    }
  }, [dispatch, isIntegrationEnabled]);

  const handleBackButton = useCallback(() => {
    if (selectedListType) {
      dispatch(clearMarketoFolders());
      dispatch(setMarketoListType(undefined));
    } else {
      dispatch(setContactsUploadingSectionState(ContactsUploadingStates.ChooseSource));
    }
  }, [dispatch, selectedListType]);

  const handleMarketoListTypeSelect = useCallback(
    (type: UploadRequestSourceTypes) => {
      dispatch(clearMarketoFolders());
      dispatch(setMarketoListType(type));
    },
    [dispatch],
  );

  if (!uuid) {
    return <></>;
  }

  switch (selectedListType) {
    case UploadRequestSourceTypes.MarketoStatic:
      return (
        <MarketoStaticList
          uuid={uuid}
          isLoading={isLoading}
          isMovingBackwardAllowed={isMovingBackwardAllowed}
          handleBack={handleBackButton}
        />
      );
    case UploadRequestSourceTypes.MarketoDynamic:
      return (
        <MarketoSmartList
          uuid={uuid}
          isLoading={isLoading}
          isMovingBackwardAllowed={isMovingBackwardAllowed}
          handleBack={handleBackButton}
        />
      );
    default:
      return (
        <ChooseMarketoContactSource
          onSelectMarketoListType={handleMarketoListTypeSelect}
          handleBack={handleBackButton}
        />
      );
  }
};

export default MarketoUploading;
