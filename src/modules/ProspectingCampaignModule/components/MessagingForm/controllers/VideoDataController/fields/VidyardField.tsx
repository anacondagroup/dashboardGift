import React, { useCallback } from 'react';
import { Box, FormHelperText } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, VidyardIntegration as Vidyard, VidyardLevelNames, IVidyardValue } from '@alycecom/ui';
import { Control, useController } from 'react-hook-form';

import { TProspectingMessaging } from '../../../../../store/prospectingCampaign/prospectingCampaign.types';
import { useProspecting } from '../../../../../hooks';
import {
  MessagingStepFields,
  VideoDataFields,
} from '../../../../../store/prospectingCampaign/steps/messaging/messaging.schemas';

const useStyles = makeStyles<AlyceTheme>(() => ({
  boxImage: {
    height: '100%',
    border: 'none',

    '& > img': {
      borderRadius: 5,
    },
  },
}));

interface IVidyardFieldProps {
  control: Control<TProspectingMessaging>;
}

const VidyardField = ({ control }: IVidyardFieldProps): JSX.Element => {
  const classes = useStyles();
  const { campaignId } = useProspecting();

  const {
    fieldState: { error },
    field: { value, onChange },
  } = useController({
    control,
    name: `${MessagingStepFields.VideoData}.${VideoDataFields.Vidyard}` as const,
  });

  const handleVidyardSelect = useCallback(
    (vidyard: IVidyardValue) => {
      onChange({
        vidyardImage: `https:${vidyard.thumbnail}`,
        vidyardVideo: `https:${vidyard.base_url}`,
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
        levelObjectId={campaignId as number}
        image={value?.imageUrl || ''}
        link={value?.videoUrl || ''}
        handleSelect={handleVidyardSelect}
        onRemove={handleRemoveVidyardVideo}
        vidyardClientId={window.APP_CONFIG.vidyardClientId}
        overrideClasses={{ boxImage: classes.boxImage }}
      />
      {!!error?.message && (
        <Box ml={4}>
          <FormHelperText error>{error?.message}</FormHelperText>
        </Box>
      )}
    </Box>
  );
};

export default VidyardField;
