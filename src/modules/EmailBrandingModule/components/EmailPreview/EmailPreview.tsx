import React, { useEffect, memo, useRef } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import {
  getBrandingSettings,
  getIsLoaded,
  getIsLoading,
} from '../../store/brandingSettings/brandingSettings.selectors';
import { loadEmailPreviewRequest } from '../../store/emailPreview/emailPreview.actions';
import { getContent } from '../../store/emailPreview/emailPreview.selectors';

import EmailPreviewSkeleton from './EmailPreviewSkeleton';

const EmailPreview = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams<{ teamId: string }>();
  const contentWrapper = useRef<HTMLIFrameElement>(null);

  const isLoaded = useSelector(getIsLoaded);
  const isLoading = useSelector(getIsLoading);
  const settings = useSelector(getBrandingSettings);
  const emailContent = useSelector(getContent);

  useEffect(() => {
    if (teamId && isLoaded) {
      dispatch(loadEmailPreviewRequest({ teamId: Number(teamId), params: settings }));
    }
  }, [teamId, isLoaded, settings, dispatch]);

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

  return (
    <Box
      width="calc(100% - 320px)"
      minHeight="100vh"
      ml={40}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isLoaded && (
        <Box height="100vh" width="100%">
          <iframe width="100%" height="100%" title="email-content" ref={contentWrapper} />
        </Box>
      )}
      {!isLoaded && isLoading && <EmailPreviewSkeleton />}
    </Box>
  );
};

export default memo(EmailPreview);
