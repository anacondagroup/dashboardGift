import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '../../../../../store/campaign/template';
import TemplateSettings from '../../../../CampaignSettings/TemplateSettings/TemplateSettings';

const Template = ({ campaignId }) => {
  const dispatch = useDispatch();
  const isLoaded = useSelector(selectors.getIsLoaded);

  useEffect(() => {
    dispatch(actions.getTemplates(campaignId));
  }, [dispatch, campaignId]);

  return isLoaded && <TemplateSettings campaignId={campaignId} />;
};

Template.propTypes = {
  campaignId: PropTypes.number.isRequired,
};

export default Template;
