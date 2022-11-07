import React from 'react';
import { useSelector } from 'react-redux';

import { SourceTypes } from '../../../constants/recipientSidebar.constants';
import { getSourceType } from '../../../store/ui/createPage/contactsSidebar';

import MarketoUploading from './MarketoUploading/MarketoUploading';

const UploadWithSelectedIntegration = (): JSX.Element | null => {
  const selectedSource = useSelector(getSourceType);
  switch (selectedSource) {
    case SourceTypes.Marketo:
      return <MarketoUploading />;
    // TODO Eloqua integration goes here
    default:
      return null;
  }
};

export default UploadWithSelectedIntegration;
