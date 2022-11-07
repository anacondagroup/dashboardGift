import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { getTeamMembers } from '../../../store/campaign/teamMembers/teamMembers.selectors';
import { loadTeamMembersRequest } from '../../../store/campaign/teamMembers/teamMembers.actions';

const CampaignSendAsLoader = ({ campaignId, render }) => {
  const dispatch = useDispatch();

  const { members, isLoading } = useSelector(getTeamMembers);

  useEffect(() => {
    dispatch(loadTeamMembersRequest({ campaignId }));
  }, [campaignId, dispatch]);

  return render({ members, isLoading });
};

CampaignSendAsLoader.propTypes = {
  campaignId: PropTypes.number.isRequired,
  render: PropTypes.func.isRequired,
};

export default CampaignSendAsLoader;
