import React, { useEffect, useCallback, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { LinkButton } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';
import { upperFirstLetter } from '@alycecom/utils';
import { CampaignSettings } from '@alycecom/modules';

import { loadBrandingRequest } from '../../store/branding/branding.actions';
import { getBrandingOwner, getIsLoading } from '../../store/branding/branding.selectors';
import { useActivate } from '../../hooks/useActivate';

const BrandingSection = (): JSX.Element => {
  const dispatch = useDispatch();
  const { campaignId } = useActivate();

  const isLoading = useSelector(getIsLoading);
  const brandingOwner = useSelector(getBrandingOwner);
  const brandingValue = brandingOwner ? upperFirstLetter(brandingOwner) : 'Alyce Default';

  const handleChangeStyling = useCallback(() => {
    if (campaignId) {
      dispatch(loadBrandingRequest({ campaignId, showBranding: true }));
    }
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (campaignId) {
      dispatch(loadBrandingRequest({ campaignId, showBranding: false }));
    }
  }, [campaignId, dispatch]);

  return (
    <Box mt={5} mb={2}>
      <CampaignSettings.SectionTitle>GIFT REDEMPTION PAGE BRANDING</CampaignSettings.SectionTitle>
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <Typography>
          This campaign uses <span className="Body-Regular-Left-Chambray-Bold">{brandingValue}</span>&nbsp;Branding -
        </Typography>
        &nbsp;
        <LinkButton disabled={isLoading} onClick={handleChangeStyling}>
          Preview & Customize
        </LinkButton>
      </Box>
    </Box>
  );
};

export default memo(BrandingSection);
