import React, { useEffect, memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { skipToken } from '@reduxjs/toolkit/query';
import { Box, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useGetBrandingSettingsByTeamIdQuery, useGetEmailPreviewQuery } from '@alycecom/services';

import {
  getBrandingSettings,
  getEmailTypeId,
  getIsEmailTypeChanged,
} from '../../store/brandingSettings/brandingSettings.selectors';
import { EmailType } from '../../constants/emailTypes.constants';

import EmailPreviewSkeleton from './EmailPreviewSkeleton';
import { styles } from './EmailPreview.styles';

const EmailPreview = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const contentWrapper = useRef<HTMLIFrameElement>(null);

  const isEmailTypeChanged = useSelector(getIsEmailTypeChanged);

  const emailTypeId = useSelector(getEmailTypeId);

  const settings = useSelector(getBrandingSettings);

  const { isLoading: isSettingsPending, isSuccess: isSettingsFulfilled } = useGetBrandingSettingsByTeamIdQuery(
    teamId ? Number(teamId) : skipToken,
  );
  const { data: emailContent, isLoading: isPreviewPending } = useGetEmailPreviewQuery(
    teamId && isSettingsFulfilled ? { teamId: Number(teamId), params: { ...settings, emailTypeId } } : skipToken,
  );

  const isIntegrationEmail = emailTypeId === EmailType.initialEmailByIntegration;

  useEffect(() => {
    const { current } = contentWrapper;
    if (emailContent && current) {
      if (current.contentWindow) {
        current.contentWindow.document.open('text/htmlreplace');
        current.contentWindow.document.write(emailContent.emailContent);
        current.contentWindow.document.close();
      }
    }
  }, [contentWrapper, emailContent]);

  const isContentHidden = isPreviewPending && isEmailTypeChanged;
  const isLoaderVisible = isSettingsPending || isContentHidden;

  return (
    <Box sx={styles.root}>
      {isLoaderVisible && <EmailPreviewSkeleton />}
      {isSettingsFulfilled && (
        <Paper
          elevation={4}
          sx={[isIntegrationEmail ? styles.integration : styles.nonIntegration, isContentHidden && styles.hidden]}
        >
          <Box component="iframe" sx={styles.iframe} title="email-content" ref={contentWrapper} />
        </Paper>
      )}
    </Box>
  );
};

export default memo(EmailPreview);
