import React, { useRef, useState } from 'react';
import { MultiAutocomplete } from '@alycecom/ui';
import { CampaignPurposes, ROI_CAMPAIGN_PURPOSES } from '@alycecom/services';
import { Box } from '@mui/material';
import { useDebounce } from 'react-use';

const styles = {
  filter: {
    width: 290,
  },
} as const;

const ROI_CAMPAIGN_PURPOSE_IDS = ROI_CAMPAIGN_PURPOSES.map(v => v.value);
const getOptionLabel = (option: CampaignPurposes) => ROI_CAMPAIGN_PURPOSES.find(cp => cp.value === option)?.label || '';

export interface IRoiCampaignPurposesFilterProps {
  onChange: (campaignPurposes: CampaignPurposes[]) => void;
  debounce?: number;
}

const RoiCampaignPurposesFilter = ({ onChange, debounce = 400 }: IRoiCampaignPurposesFilterProps): JSX.Element => {
  const isMountRef = useRef(false);
  const [values, setValues] = useState<CampaignPurposes[]>([]);

  useDebounce(
    () => {
      if (isMountRef.current) {
        onChange(values);
      }
      isMountRef.current = true;
    },
    debounce,
    [values, onChange],
  );

  return (
    <Box sx={styles.filter}>
      <MultiAutocomplete<CampaignPurposes, true>
        label="Campaign Purpose"
        name="campaignPurpose"
        value={values}
        options={ROI_CAMPAIGN_PURPOSE_IDS}
        listboxProps={{ maxVisibleRows: 4 }}
        multiple
        getOptionLabel={getOptionLabel}
        onChange={setValues}
      />
    </Box>
  );
};

export default RoiCampaignPurposesFilter;
