import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { ActionButton, BaseField, HtmlTip, Divider } from '@alycecom/ui';

const GiftRedirectForm = ({
  isLoading,
  errors,
  redirectUrl,
  redirectHeader,
  redirectBody,
  redirectButton,
  redirectConfirmed,
  onSave,
}) => {
  const [isRedirectEnable, setIsRedirectEnable] = useState(!!redirectUrl);
  const [localRedirectUrl, setLocalRedirectUrl] = useState(redirectUrl);
  const [localRedirectHeader, setLocalRedirectHeader] = useState(redirectHeader);
  const [localRedirectBody, setLocalRedirectBody] = useState(redirectBody);
  const [localRedirectButton, setLocalRedirectButton] = useState(redirectButton);
  const [localRedirectConfirmed, setLocalRedirectConfirmed] = useState(redirectConfirmed);

  const handleRedirectEnabled = useCallback(() => {
    setIsRedirectEnable(!isRedirectEnable);
  }, [isRedirectEnable]);

  const getLimitMessage = useCallback((value, limit) => {
    const letterCount = value ? value.length : 0;
    return (
      <Box
        component="span"
        width={1}
        textAlign="right"
        className={limit > letterCount ? 'Body-Small-Success' : 'Body-Small-Error'}
      >
        {`You have ${limit - letterCount} characters left (${letterCount} out of ${limit})`}
      </Box>
    );
  }, []);

  const handleSave = useCallback(() => {
    const request = {
      redirectUrl: isRedirectEnable ? localRedirectUrl : null,
      redirectHeader: isRedirectEnable ? localRedirectHeader : null,
      redirectMessage: isRedirectEnable ? localRedirectBody : null,
      redirectButton: isRedirectEnable ? localRedirectButton : null,
      redirectConfirmed: isRedirectEnable ? localRedirectConfirmed : false,
    };
    if (!isRedirectEnable) {
      setLocalRedirectConfirmed(false);
      setLocalRedirectUrl('');
      setLocalRedirectHeader('');
      setLocalRedirectBody('');
      setLocalRedirectButton('');
    }
    onSave(request);
  }, [
    onSave,
    localRedirectUrl,
    localRedirectHeader,
    localRedirectBody,
    localRedirectButton,
    localRedirectConfirmed,
    isRedirectEnable,
  ]);

  const isRedirectEmpty = localRedirectUrl === '' || localRedirectUrl === null;
  const blockPopupFields = isLoading || isRedirectEmpty || !localRedirectConfirmed;

  return (
    <Box display="flex" flexDirection="column">
      <Box pt={3} pb={3} flexDirection="row">
        <RadioGroup value={isRedirectEnable} onChange={handleRedirectEnabled} style={{ flexDirection: 'row' }}>
          <FormControlLabel value={false} control={<Radio color="primary" />} label="No, do not use a CTA link" />
          <FormControlLabel value control={<Radio color="primary" />} label="Yes, use a CTA link" />
        </RadioGroup>
      </Box>

      {isRedirectEnable && (
        <>
          <Divider mb={3} />

          <Box display="flex" justyfiContent="space-between" alignItems="flex-start">
            <Box width={1 / 2} mt={2} mb={2} mr={4}>
              <BaseField
                value={localRedirectUrl}
                name="redirect_url"
                label="CTA URL"
                placeholder="Input CTA url"
                fullWidth
                disabled={isLoading}
                errors={errors}
                onChange={e => setLocalRedirectUrl(e.target.value)}
              />
            </Box>
            <Box width={1 / 2} mt={2} mb={2} ml={4}>
              <HtmlTip>
                <div>
                  <Box>Alyce Post gift CTA links need to include the full link, as shown in this example:</Box>
                  <Box pt={1}>
                    • <b>Link format</b>: https://alyce.com/*
                  </Box>
                  <Box pt={1}>
                    For more information, please see the&nbsp;
                    <a
                      className="Subcopy-Regular-Link"
                      target="_blank"
                      rel="noreferrer noopener"
                      href="https://help.alyce.com/article/156-how-to-set-up-a-post-gift-cta-in-a-campaign"
                    >
                      Alyce support article.
                    </a>
                  </Box>
                </div>
              </HtmlTip>
            </Box>
          </Box>

          <Divider mt={3} mb={3} />

          <Box width={1 / 2} pr={4}>
            <Box>
              <FormControlLabel
                className="Body-Regular-Left-Static"
                disabled={isLoading || isRedirectEmpty}
                control={
                  <Checkbox
                    checked={localRedirectConfirmed}
                    onChange={(e, value) => setLocalRedirectConfirmed(value)}
                    value={localRedirectConfirmed}
                    color="primary"
                  />
                }
                label="Enable CTA pop-up"
              />
            </Box>
            <Box width={1} mt={2} mb={2}>
              <BaseField
                value={localRedirectHeader}
                name="redirect_header"
                label="CTA Header"
                placeholder="Input CTA header"
                fullWidth
                disabled={blockPopupFields}
                errors={errors}
                onChange={e => setLocalRedirectHeader(e.target.value)}
              />
              {getLimitMessage(localRedirectHeader, 50)}
            </Box>
            <Box width={1} mt={2} mb={2}>
              <BaseField
                value={localRedirectBody}
                name="redirect_message"
                label="CTA Message"
                placeholder="Input CTA message"
                fullWidth
                disabled={blockPopupFields}
                errors={errors}
                onChange={e => setLocalRedirectBody(e.target.value)}
              />
              {getLimitMessage(localRedirectBody, 300)}
            </Box>
            <Box width={1} mt={2} mb={2}>
              <BaseField
                value={localRedirectButton}
                name="redirect_button"
                label="CTA Button"
                placeholder="Input CTA button"
                fullWidth
                disabled={blockPopupFields}
                errors={errors}
                onChange={e => setLocalRedirectButton(e.target.value)}
              />
              {getLimitMessage(localRedirectButton, 20)}
            </Box>
          </Box>
        </>
      )}

      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} onClick={handleSave} disabled={isLoading || (isRedirectEmpty && isRedirectEnable)}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

GiftRedirectForm.propTypes = {
  redirectUrl: PropTypes.string.isRequired,
  redirectHeader: PropTypes.string.isRequired,
  redirectBody: PropTypes.string.isRequired,
  redirectButton: PropTypes.string.isRequired,
  redirectConfirmed: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
};

GiftRedirectForm.defaultProps = {
  isLoading: false,
  errors: {},
};

export default GiftRedirectForm;
