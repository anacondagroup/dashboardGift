import React from 'react';
import { Box, Typography } from '@mui/material';
import { CampaignSettings } from '@alycecom/modules';
import { useSelector } from 'react-redux';

import { UploadRequestSourceTypes } from '../../store/steps/recipients/uploadRequest/uploadRequest.types';
import { getFreeClaimsNumber, getIsFreeClaimEnabled, getIsPreApprovedClaimEnabled } from '../../store/steps/details';

interface IRecipientsSectionProps {
  source: UploadRequestSourceTypes | null;
  total: number;
}

const RecipientsSection = ({ source, total }: IRecipientsSectionProps): JSX.Element => {
  const isFreeClaimEnabled = useSelector(getIsFreeClaimEnabled);
  const isPreApprovedClaimEnabled = useSelector(getIsPreApprovedClaimEnabled);
  const freeClaims = useSelector(getFreeClaimsNumber);

  return (
    <>
      <CampaignSettings.StyledSectionTitle mb={3} maxWidth={792}>
        Recipients
      </CampaignSettings.StyledSectionTitle>

      <Box maxWidth={650}>
        {isPreApprovedClaimEnabled && (
          <>
            {source === UploadRequestSourceTypes.MarketoDynamic && 'Marketo smart list is linked'}
            {source !== UploadRequestSourceTypes.MarketoDynamic && !!total && (
              <Typography>{total} recipients specified</Typography>
            )}
            {!total && !source && <Typography>None specified</Typography>}
          </>
        )}
        {isFreeClaimEnabled && (
          <Typography>
            Unknown recipients. Anyone will be able to claim a gift on this campaign
            <br />
            <br />
            Total claims: {freeClaims}
          </Typography>
        )}
      </Box>
    </>
  );
};

export default RecipientsSection;
