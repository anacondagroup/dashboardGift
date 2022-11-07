import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, VidyardIntegration as Vidyard, VidyardLevelNames, IVidyardValue } from '@alycecom/ui';

import { IVidyardFormValues } from '../../store/steps/messaging/messagingForm.schemas';

const useStyles = makeStyles<AlyceTheme>(() => ({
  boxImage: {
    height: '100%',
    border: 'none',

    '& > img': {
      borderRadius: 5,
    },
  },
}));

interface IVidyardIntegrationProps {
  campaignId: number;
  value: IVidyardFormValues | null;
  onChange: (value: IVidyardFormValues | null) => void;
}

const VidyardIntegration = ({ campaignId, value, onChange }: IVidyardIntegrationProps): JSX.Element => {
  const classes = useStyles();

  const image = value?.vidyardImage || '';
  const link = value?.vidyardVideo || '';

  const handleVidyardSelect = useCallback(
    (v: IVidyardValue) => {
      const thumbnail = `https:${v.thumbnail}`;
      const baseUrl = `https:${v.base_url}`;

      onChange({
        vidyardImage: thumbnail,
        vidyardVideo: baseUrl,
      });
    },
    [onChange],
  );

  const handleRemoveVidyardVideo = useCallback(() => {
    onChange(null);
  }, [onChange]);

  return (
    <Box display="flex" flexDirection="column" width={1}>
      <Vidyard
        levelName={VidyardLevelNames.CampaignSettings}
        levelObjectId={campaignId}
        image={image}
        link={link}
        handleSelect={handleVidyardSelect}
        onRemove={handleRemoveVidyardVideo}
        vidyardClientId={window.APP_CONFIG.vidyardClientId}
        overrideClasses={{ boxImage: classes.boxImage }}
      />
    </Box>
  );
};

export default VidyardIntegration;
