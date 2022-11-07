import React, { useCallback, useState } from 'react';
import { CompliancePopup } from '@alycecom/ui';
import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Box, Button } from '@mui/material';

import { selectors } from '../../../../../store/teams/generalSettings';

const ComplianceFormPreview = (): JSX.Element => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const complianceLink = useSelector(selectors.getComplianceLink);
  const compliancePromptText = useSelector(selectors.getCompliancePromptText);
  const complianceRevertText = useSelector(selectors.getComplianceRevertText);

  const { watch } = useFormContext();
  const [
    promptTextValue = compliancePromptText,
    revertTextValue = complianceRevertText,
    linkValue = complianceLink,
  ] = watch(['compliancePromptText', 'complianceRevertText', 'complianceLink']);

  const handlePreview = useCallback(() => setIsPopupVisible(true), []);
  const handleFinish = useCallback(() => setIsPopupVisible(false), []);

  return (
    <>
      {/* @ts-ignore */}
      <CompliancePopup
        preview
        isOpen={isPopupVisible}
        onFinish={handleFinish}
        promptText={promptTextValue}
        revertText={revertTextValue}
        link={linkValue}
      />
      <Box mt={2}>
        <Button className="Button-Link" onClick={handlePreview}>
          Preview compliance check
        </Button>
      </Box>
    </>
  );
};

export default ComplianceFormPreview;
