import React, { useCallback, useEffect, useState } from 'react';
import { Button, SidebarHeader as HeaderTopBar } from '@alycecom/ui';
import { Box, Drawer } from '@mui/material';

import giftingFlowImage from '../../../../../../../../assets/images/contact-details-top-bar.svg';
import {
  ProductVendorsRestrictionForm,
  TProductVendorsRestrictionFormValue,
} from '../../../../../../../MarketplaceModule/components/Shared/ProductVendorsRestrictionForm';
import { getCampaignTypeName } from '../../../../../../../../helpers/campaignSettings.helpers';
import { CAMPAIGN_TYPES } from '../../../../../../../../constants/campaignSettings.constants';
import CampaignSidebarSectionWrapper from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CampaignSidebarSectionWrapper';

export interface ISwagVendorRestrictionControllerProps {
  onChange: (value: TProductVendorsRestrictionFormValue) => void;
  value: TProductVendorsRestrictionFormValue;
  onClose: () => void;
  open: boolean;
  teamId: number;
}

const SwagVendorRestrictionController = ({
  onChange,
  value,
  onClose,
  open,
  teamId,
}: ISwagVendorRestrictionControllerProps): JSX.Element => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = useCallback(restrictedVendors => {
    setLocalValue(restrictedVendors);
  }, []);

  const handleSave = () => {
    onChange(localValue);
    onClose();
  };

  return (
    <Drawer anchor="right" onClose={onClose} open={open}>
      <HeaderTopBar onClose={onClose} bgTheme="green-light-gradient" bgImage={giftingFlowImage}>
        <Box fontSize="1.25rem" color="common.white" width={700}>
          Create a ${getCampaignTypeName(CAMPAIGN_TYPES.SWAG)} campaign!
        </Box>
      </HeaderTopBar>
      <Box px={6} py={4}>
        <CampaignSidebarSectionWrapper status="ACTIVE">
          <Box px={3}>
            <Box mb={4} className="H4-Chambray">
              Vendor Restrictions
            </Box>
            <Box px={4}>
              <ProductVendorsRestrictionForm teamId={teamId} value={localValue} onChange={handleChange} />
              <Box pt={4}>
                <Button variant="contained" color="secondary" onClick={handleSave}>
                  Save
                </Button>
              </Box>
            </Box>
          </Box>
        </CampaignSidebarSectionWrapper>
      </Box>
    </Drawer>
  );
};

export default SwagVendorRestrictionController;
