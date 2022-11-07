import React, { useEffect, useMemo, memo } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@mui/material';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import { getInvitationsAmount } from '../../store/common/invitations/invitations.selectors';
import { getInvitations } from '../../store/common/invitations/invitations.actions';
import { getInvitationParams } from '../../store/common/invitations/invitations.helpers';
import { makeGetCampaignById } from '../../store/campaigns/campaigns.selectors';
import { makeGetTeamById } from '../../store/teams/teams.selectors';

const emptySelector = () => {};

const ToolbarInvitations = ({ boxProps }) => {
  const dispatch = useDispatch();
  const amount = useSelector(getInvitationsAmount);
  const { context, id } = getInvitationParams();
  const selector = useMemo(() => {
    switch (context) {
      case 'campaigns': {
        return makeGetCampaignById(id);
      }
      case 'teams': {
        return makeGetTeamById(id);
      }
      default: {
        return emptySelector;
      }
    }
  }, [context, id]);
  const data = useSelector(selector, shallowEqual);
  const name = data && data.name;

  useEffect(() => {
    dispatch(getInvitations());
  }, [dispatch, name]);

  return (
    <Box display="flex" justifyContent="center" flexDirection="column" {...boxProps}>
      <Box
        variant="inherit"
        lineHeight={1}
        pb={0.5}
        component={Typography}
        align="left"
        color="grey.main"
        fontSize="0.75rem"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        overflow="hidden"
      >
        Invitations
        {!!name && (
          <>
            &nbsp;at
            <br />
            {name}
          </>
        )}
      </Box>
      <Typography data-testid="invites_qty" variant="h4" color="inherit">
        {amount > 999 ? '999+' : amount}
      </Typography>
    </Box>
  );
};

ToolbarInvitations.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  boxProps: PropTypes.object,
};

ToolbarInvitations.defaultProps = {
  boxProps: {},
};

export default memo(ToolbarInvitations);
