import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, RadioGroup, FormControlLabel, Checkbox, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { TrackEvent } from '@alycecom/services';
import {
  useVideoIntegration,
  ActionButton,
  BaseField,
  EmbedVideoTip,
  VidyardIntegration,
  RadioWithContent,
  VIDEO_TYPE_DISABLED,
  VIDEO_TYPE_EMBED,
  VIDEO_TYPE_VIDYARD,
} from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { campaignGiftUpdateVideoMessageCleanErrors } from '../../../../store/campaign/giftInvites/giftInvites.actions';
import { CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';
import { getCampaignType } from '../../../../store/campaign/commonData/commonData.selectors';

const useStyles = makeStyles(({ palette }) => ({
  input: {
    backgroundColor: 'transparent',
    '& .MuiInputBase-root': {
      backgroundColor: palette.common.white,
    },
  },
  boxImage: {
    height: '100%',
    border: 'none',
    '& > img': {
      borderRadius: 5,
    },
  },
}));

const GiftVideoMessageForm = ({
  type,
  vidyardVideo,
  vidyardImage,
  isLoading,
  errors,
  videoMessage,
  allowOverride,
  onSave,
  campaignId,
  campaignName,
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const campaignType = useSelector(getCampaignType);
  const { trackEvent } = TrackEvent.useTrackEvent();
  const [allowOverrideOnGift, setAllowOverrideOnGift] = useState(allowOverride);

  const onUpdateErrors = useCallback(
    saveErrors => {
      dispatch(campaignGiftUpdateVideoMessageCleanErrors(saveErrors));
    },
    [dispatch],
  );

  const handleSaveSettings = useCallback(
    payload => {
      onSave(payload);
      trackEvent('Enterprise dashboard — save recipient video message', {
        campaignId,
        ...payload,
      });
    },
    [campaignId, onSave, trackEvent],
  );

  const handleChangeVideoType = useCallback(() => {
    dispatch(campaignGiftUpdateVideoMessageCleanErrors({}));
  }, [dispatch]);

  const {
    videoType: localType,
    videoMessage: localVideoMessage,
    vidyardVideo: localVidyardVideo,
    vidyardImage: localVidyardImage,
    isSaveDisable,
    handleVideoEnabled,
    handleVidyardSelect,
    handleVidyardRemove,
    handleSetLocalVideoMessage,
    handleSave,
  } = useVideoIntegration({
    type,
    vidyardVideo,
    vidyardImage,
    videoMessage,
    isLoading,
    errors,
    onSave: handleSaveSettings,
    onUpdateErrors,
    onChangeType: handleChangeVideoType,
  });

  const handleChangeAllowOverride = useCallback((_, value) => setAllowOverrideOnGift(value), []);

  const handleShowVidyardPopup = useCallback(() => {
    trackEvent('Sender - Vidyard Integration Settings. Open popup for select video');
  }, [trackEvent]);

  const handleRemoveVidyardVideo = useCallback(() => {
    trackEvent('Sender - Vidyard Integration Settings. Remove selected video', {
      image: localVidyardImage,
      link: localVidyardVideo,
    });
    handleVidyardRemove();
  }, [trackEvent, handleVidyardRemove, localVidyardImage, localVidyardVideo]);

  return (
    <Box display="flex" flexDirection="column">
      <RadioGroup value={localType} onChange={handleVideoEnabled}>
        <RadioWithContent
          color="primary"
          isActive={localType === VIDEO_TYPE_DISABLED}
          value={VIDEO_TYPE_DISABLED}
          label={`Do not use a default video for ${campaignName}`}
        />
        <RadioWithContent
          color="primary"
          isActive={localType === VIDEO_TYPE_VIDYARD}
          value={VIDEO_TYPE_VIDYARD}
          label="Add or record Vidyard video"
        >
          <Box width={1} display="flex" flexDirection="column">
            <VidyardIntegration
              levelName="campaignSettings"
              levelObjectId={campaignId}
              handleSelect={handleVidyardSelect}
              onShowModal={handleShowVidyardPopup}
              onRemove={handleRemoveVidyardVideo}
              image={localVidyardImage}
              link={localVidyardVideo}
              vidyardClientId={window.APP_CONFIG.vidyardClientId}
              overrideClasses={{ boxImage: classes.boxImage }}
            />
            <Box mb={2}>
              {errors && errors.vidyard_video && (
                <FormHelperText error>{errors.vidyard_video.join(', ')}</FormHelperText>
              )}
            </Box>
          </Box>
        </RadioWithContent>
        <RadioWithContent
          color="primary"
          isActive={localType === VIDEO_TYPE_EMBED}
          value="embed"
          label="Embed video link"
        >
          <Box width="50%" pt={2}>
            <BaseField
              value={localVideoMessage}
              name="recipient_video"
              label="Gift Invitation Landing Page Video Link"
              placeholder="Input gift invitation landing page video link"
              fullWidth
              className={classes.input}
              disabled={isLoading}
              errors={errors}
              onChange={handleSetLocalVideoMessage}
            />
          </Box>
          <Box pl={4} display="flex" width="50%" pt={2}>
            <EmbedVideoTip display="flex" justifyContent="flex-start" alignItems="flex-start" />
          </Box>
        </RadioWithContent>
      </RadioGroup>
      {campaignType !== CAMPAIGN_TYPES.ACTIVATE && (
        <Box display="flex" flexDirection="row">
          <FormControlLabel
            className="Body-Regular-Left-Inactive"
            disabled={isLoading}
            control={
              <Checkbox
                disabled={isLoading}
                checked={allowOverrideOnGift}
                onChange={handleChangeAllowOverride}
                value
                color="primary"
              />
            }
            label="Allow team members to add their own video or change the default landing page video link on a per gift basis"
          />
        </Box>
      )}
      <Box mt={2} width={1} display="flex" justifyContent="space-between">
        <ActionButton
          width={100}
          disabled={isSaveDisable}
          onClick={useCallback(() => handleSave({ allowOverrideOnGift }), [handleSave, allowOverrideOnGift])}
        >
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

GiftVideoMessageForm.propTypes = {
  videoMessage: PropTypes.string.isRequired,
  vidyardImage: PropTypes.string.isRequired,
  vidyardVideo: PropTypes.string.isRequired,
  type: PropTypes.oneOf([VIDEO_TYPE_DISABLED, VIDEO_TYPE_EMBED, VIDEO_TYPE_VIDYARD]),
  allowOverride: PropTypes.bool.isRequired,
  campaignId: PropTypes.number.isRequired,
  campaignName: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
};

GiftVideoMessageForm.defaultProps = {
  isLoading: false,
  type: null,
  errors: {},
};

export default GiftVideoMessageForm;
