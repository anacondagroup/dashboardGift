import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BaseField, ActionButton } from '@alycecom/ui';
import { Box } from '@mui/material';
import { useKeyPressEnter } from '@alycecom/hooks';

const CampaignName = ({ campaignName, errors, isLoading, onSubmit }) => {
  const [localCampaignName, setLocalCampaignName] = useState(campaignName);
  const saveOnEnter = useKeyPressEnter(() => onSubmit(localCampaignName));

  return (
    <>
      <BaseField
        value={localCampaignName}
        name="campaign_name"
        label="Campaign name"
        placeholder="Input campaign name"
        fullWidth
        disabled={isLoading}
        errors={errors}
        onChange={e => setLocalCampaignName(e.target.value)}
        onKeyPress={saveOnEnter}
      />
      <Box mt={2}>
        <ActionButton onClick={() => onSubmit(localCampaignName)}>Save</ActionButton>
      </Box>
    </>
  );
};

CampaignName.propTypes = {
  campaignName: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  isLoading: PropTypes.bool,
  onSubmit: PropTypes.func,
};

CampaignName.defaultProps = {
  campaignName: '',
  errors: {},
  isLoading: false,
  onSubmit: () => {},
};

export default CampaignName;
