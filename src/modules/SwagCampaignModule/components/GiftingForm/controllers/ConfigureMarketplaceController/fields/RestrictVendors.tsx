import React, { ChangeEvent, useEffect, useRef, useState, memo } from 'react';
import { Control, useController } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { Collapse, FormControl, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { SFormLabel } from '@alycecom/modules';

import {
  ProductVendorsRestrictionForm,
  TProductVendorsRestrictionFormValue,
} from '../../../../../../MarketplaceModule/components/Shared/ProductVendorsRestrictionForm';
import { getDetailsData } from '../../../../../store/swagCampaign/steps/details/details.selectors';
import {
  GiftingStepFields,
  MarketplaceDataFields,
  TSwagCampaignGiftingForm,
} from '../../../../../store/swagCampaign/steps/gifting/gifting.types';

export interface IRestrictVendorsProps {
  control: Control<TSwagCampaignGiftingForm>;
}

enum VendorsAllowing {
  All = 'all',
  Custom = 'custom',
}

const RestrictVendors = ({ control }: IRestrictVendorsProps): JSX.Element => {
  const isMountRef = useRef(false);
  const [vendorsAllowing, setVendorsAllowing] = useState(VendorsAllowing.All);
  const { teamId } = useSelector(getDetailsData) || {};
  const { field: brandIdsField } = useController({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.RestrictedBrandIds}` as const,
  });
  const { field: merchantIdsField } = useController({
    control,
    name: `${GiftingStepFields.ExchangeMarketplaceSettings}.${MarketplaceDataFields.RestrictedMerchantIds}` as const,
  });

  const value: TProductVendorsRestrictionFormValue = {
    brandIds: brandIdsField.value as number[],
    merchantIds: merchantIdsField.value as number[],
  };

  const isAllPermitted = brandIdsField.value.length === 0 && merchantIdsField.value.length === 0;

  const handleChange = (data: TProductVendorsRestrictionFormValue) => {
    brandIdsField.onChange(data.brandIds);
    merchantIdsField.onChange(data.merchantIds);
    brandIdsField.onBlur();
    merchantIdsField.onBlur();
  };

  useEffect(() => {
    if (isMountRef.current) {
      return;
    }

    setVendorsAllowing(isAllPermitted ? VendorsAllowing.All : VendorsAllowing.Custom);

    isMountRef.current = true;
  }, [isAllPermitted]);

  const handleVendorsAllowingChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVendorsAllowing(event.target.value as VendorsAllowing);

    if (event.target.value === VendorsAllowing.All) {
      brandIdsField.onChange([]);
      merchantIdsField.onChange([]);
    }
  };

  return (
    <>
      <FormControl>
        <SFormLabel>Allowed Vendors</SFormLabel>
        <RadioGroup
          name={`${GiftingStepFields.ExchangeMarketplaceSettings}.IsAllVendorsAllowed`}
          value={vendorsAllowing}
          onChange={handleVendorsAllowingChange}
        >
          <FormControlLabel value={VendorsAllowing.All} control={<Radio color="primary" />} label="Allow all vendors" />
          <FormControlLabel
            value={VendorsAllowing.Custom}
            control={<Radio color="primary" />}
            label="Allow specific vendors"
          />
        </RadioGroup>
      </FormControl>
      <Collapse in={vendorsAllowing === VendorsAllowing.Custom} unmountOnExit mountOnEnter>
        <ProductVendorsRestrictionForm teamId={teamId} value={value} onChange={handleChange} />
      </Collapse>
    </>
  );
};

export default memo(RestrictVendors);
