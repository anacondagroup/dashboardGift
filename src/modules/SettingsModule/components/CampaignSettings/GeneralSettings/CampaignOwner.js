import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { pathOr, hasPath } from 'ramda';
import { ActionButton, SelectFilter } from '@alycecom/ui';
import { Box, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { getTeamMembers } from '../../../store/campaign/teamMembers/teamMembers.selectors';
import { clearData, loadTeamAdminsRequest } from '../../../store/campaign/teamMembers/teamMembers.actions';

const CampaignOwner = ({ onSubmit, campaignOwner, campaignId, error }) => {
  const dispatch = useDispatch();
  const [ownerId, setOwner] = useState(campaignOwner.id);
  const { admins, isLoading } = useSelector(getTeamMembers);

  useEffect(() => {
    if (!admins) {
      dispatch(loadTeamAdminsRequest({ campaignId }));
    }
  }, [campaignId, dispatch, admins]);

  useEffect(
    () => () => {
      dispatch(clearData());
    },
    [dispatch],
  );

  if (!admins) {
    return null;
  }

  return (
    <Box display="flex" flexDirection="column">
      <Box width={1 / 2} mt={2} mb={2}>
        <SelectFilter
          error={hasPath(['email_id'], error)}
          helperText={pathOr([], ['email_id', 0], error).join(' ')}
          disabled={isLoading}
          label="Who should be the campaign owner?"
          value={ownerId}
          name="id"
          fullWidth
          onFilterChange={({ id }) => setOwner(id)}
          renderItems={() =>
            admins.map(admin => (
              <MenuItem key={admin.id} value={admin.id}>
                {`${admin.first_name} ${admin.last_name}`}
              </MenuItem>
            ))
          }
        />
      </Box>
      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} onClick={() => onSubmit(ownerId)} disabled={isLoading}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

CampaignOwner.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object.isRequired,
  campaignId: PropTypes.number.isRequired,
  campaignOwner: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
};

export default CampaignOwner;
