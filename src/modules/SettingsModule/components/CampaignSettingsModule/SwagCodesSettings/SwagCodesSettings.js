import React from 'react';
import PropTypes from 'prop-types';

import SwagCodesInventory from './SwagCodesInventory/SwagCodesInventory';

const SwagCodesSettings = ({ campaignId, campaignName, campaignType }) => (
  <>
    <SwagCodesInventory campaignName={campaignName} campaignId={campaignId} campaignType={campaignType} />
  </>
);

SwagCodesSettings.propTypes = {
  campaignId: PropTypes.number.isRequired,
  campaignName: PropTypes.string.isRequired,
  campaignType: PropTypes.oneOf(['swag digital', 'swag physical']).isRequired,
};

export default SwagCodesSettings;
