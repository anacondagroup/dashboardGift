import React, { memo } from 'react';
import { Box, Typography, BoxProps } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme } from '@alycecom/ui';
import { Link } from 'react-router-dom';
import { RecipientExperienceFlowLink } from '@alycecom/modules';

const useStyles = makeStyles<AlyceTheme>(({ spacing, palette }) => ({
  preview: {
    fontSize: 16,
    fontFamily: 'Lato',
    marginRight: spacing(1),
    color: palette.text.primary,
    fontWeight: 'bold',
  },
}));

export interface ICampaignPreviewLinksProps extends BoxProps {
  campaignId: number;
  canPreviewRecipientExperience?: boolean;
}

const CampaignPreviewLinks = ({
  campaignId,
  canPreviewRecipientExperience = true,
  ...boxProps
}: ICampaignPreviewLinksProps): JSX.Element => {
  const classes = useStyles();
  return (
    <Box display="flex" alignItems="center" justifyContent="center" {...boxProps}>
      <Typography className={classes.preview}>Preview: </Typography>
      <Link className="Body-Regular-Center-Link-Bold" to={`/marketplace/campaign/${campaignId}`}>
        Marketplace
      </Link>
      {canPreviewRecipientExperience && (
        <>
          <Box fontSize={14} component="span" mx={0.5}>
            |
          </Box>
          <RecipientExperienceFlowLink apiHost={window.APP_CONFIG.apiHost} campaignId={campaignId} />
        </>
      )}
    </Box>
  );
};

export default memo<ICampaignPreviewLinksProps>(CampaignPreviewLinks);
