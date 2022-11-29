import React, { useEffect, memo, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getBrandingSettings,
  getEmailTypeId,
  getIsEmailTypeChanged,
  getIsFulfilled,
  getIsPending as getIsSettingsPending,
} from '../../store/brandingSettings/brandingSettings.selectors';
import { loadEmailPreviewRequest } from '../../store/emailPreview/emailPreview.actions';
import { getContent, getIsPending } from '../../store/emailPreview/emailPreview.selectors';
import { EmailType } from '../../store/emailTypes/emailTypes.types';

import EmailPreviewSkeleton from './EmailPreviewSkeleton';
import { styles } from './EmailPreview.styles';

const EmailPreview = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams<{ teamId: string }>();
  const contentWrapper = useRef<HTMLIFrameElement>(null);

  const isSettingsPending = useSelector(getIsSettingsPending);
  const isSettingsFulfilled = useSelector(getIsFulfilled);
  const isEmailTypeChanged = useSelector(getIsEmailTypeChanged);

  const isPreviewPending = useSelector(getIsPending);

  const settings = useSelector(getBrandingSettings);
  const emailTypeId = useSelector(getEmailTypeId);
  const emailContent = useSelector(getContent);

  const isIntegrationEmail = emailTypeId === EmailType.initialEmailByIntegration;

  useEffect(() => {
    if (teamId && isSettingsFulfilled) {
      dispatch(loadEmailPreviewRequest({ teamId: Number(teamId), params: { ...settings, emailTypeId } }));
    }
  }, [teamId, isSettingsFulfilled, settings, emailTypeId, dispatch]);

  useEffect(() => {
    const { current } = contentWrapper;
    if (emailContent && current) {
      if (current.contentWindow) {
        current.contentWindow.document.open('text/htmlreplace');
        current.contentWindow.document.write(emailContent);
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
