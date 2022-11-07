import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'ramda';
import { Box, Select, Button, FormControl, InputLabel, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';
import { User } from '@alycecom/modules';

import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import FullWidthHint from '../../../../../../../../components/Shared/FullWidthHint';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import {
  SS_OWNERSHIP_STEP,
  SS_BUDGET_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import {
  swagSelectChangeStep,
  swagSelectCreateCampaignRequest,
  swagSelectSetStepData,
  swagSelectUpdateCampaignOwnershipRequest,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import useTeamSelect from '../../../../../../hooks/useTeamSelect';
import useTeamOwnerSelect from '../../../../../../hooks/useTeamOwnerSelect';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 155,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
}));

const ChooseCampaignOwnerSection = ({ title, order, status, data, campaignId, isLoading }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector(User.selectors.getUser);

  const transformMemberToOption = useCallback(member => ({ label: member.name, value: member.id }), []);
  const { teamsOptions, teamId, setTeamId, isTeamsLoading } = useTeamSelect({
    selectedId: data.team && data.team.id,
    transformMemberToOption,
  });
  const { membersOptions, ownerId, setOwnerId, isMembersLoading } = useTeamOwnerSelect(teamId, {
    selectedId: user.id,
    transformMemberToOption,
  });

  const handleChooseTeam = useCallback(id => setTeamId(id), [setTeamId]);

  const handleNextStep = useCallback(() => {
    if (isLoading) {
      return;
    }
    // bypass update is data doesn't modify
    const sourceTeamId = data.team && data.team.id;
    const sourceOwnerId = data.owner && data.owner.id;

    if (sourceOwnerId === ownerId && sourceTeamId === teamId) {
      dispatch(swagSelectChangeStep({ next: SS_BUDGET_STEP }));
      return;
    }
    // create/update flow
    const team = teamsOptions.find(item => item.value === teamId);
    const owner = membersOptions.find(item => item.value === ownerId);
    if (!isEmpty(team) && !isEmpty(owner)) {
      dispatch(
        swagSelectSetStepData({
          step: SS_OWNERSHIP_STEP,
          data: { team: { id: team.value, name: team.label }, owner: { id: owner.value, name: owner.label } },
        }),
      );
      if (campaignId) {
        dispatch(swagSelectUpdateCampaignOwnershipRequest(campaignId));
      } else {
        dispatch(swagSelectCreateCampaignRequest());
      }
    }
  }, [isLoading, data.team, data.owner, ownerId, teamId, teamsOptions, membersOptions, dispatch, campaignId]);

  const handleEdit = useCallback(() => {
    dispatch(swagSelectChangeStep({ current: undefined, next: SS_OWNERSHIP_STEP }));
  }, [dispatch]);

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId} handleEdit={handleEdit}>
        {`${data.team.name} > ${data.owner.name}`}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  return (
    <Box width={648}>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box pb={2} pl="52px" className="H4-Chambray">
        {title}
        <Box mt={1} className={classes.description}>
          Set which team and team member are responsible for this Gift Redemption Card campaign.
        </Box>
      </Box>
      <FullWidthHint>
        <Box mb={1} className="Body-Regular-Left-Static-Bold">
          Please note, by default, the campaign owner will:
        </Box>
        <ul className={classes.ul}>
          <li className={classes.li}>Receive all notifications of status updates.</li>
          <li className={classes.li}>Be used for all calendar bookings.</li>
        </ul>
      </FullWidthHint>
      <Box px={3} pt={3}>
        <Box mt={1}>
          <FormControl variant="outlined" fullWidth disabled={isTeamsLoading}>
            <InputLabel id="la_select_team_label">{isTeamsLoading ? 'Loading...' : 'Select a team'}</InputLabel>
            <Select
              labelId="la_select_team_label"
              label={isTeamsLoading ? 'Loading...' : 'Select a team'}
              id="la_select_team_label"
              value={teamId || ''}
              onChange={e => handleChooseTeam(e.target.value)}
              labelWidth={95}
            >
              {teamsOptions.map(team => (
                <MenuItem key={team.value} value={team.value}>
                  {team.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box mt={2}>
          <FormControl variant="outlined" fullWidth disabled={(!teamId && !membersOptions.length) || isMembersLoading}>
            <InputLabel id="la_select_member_label">{isMembersLoading ? 'Loading...' : 'Select a member'}</InputLabel>
            <Select
              labelId="la_select_member_label"
              label={isMembersLoading ? 'Loading...' : 'Select a member'}
              id="la_select_member_label"
              value={ownerId || ''}
              onChange={e => setOwnerId(e.target.value)}
              labelWidth={117}
            >
              {membersOptions.map(member => (
                <MenuItem key={member.value} value={member.value}>
                  {member.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box width="100%" mt={3} display="flex" justifyContent="flex-end">
          <Button
            className={classes.button}
            variant="contained"
            color="secondary"
            onClick={() => handleNextStep()}
            fullWidth
            disabled={!teamId || !ownerId}
          >
            Next step
            {!isLoading ? (
              <DashboardIcon className={classes.buttonIcon} color="inherit" icon="arrow-right" />
            ) : (
              <DashboardIcon className={classes.buttonIcon} spin color="inherit" icon="spinner" />
            )}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

ChooseCampaignOwnerSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  // eslint-disable-next-line react/forbid-prop-types
  campaignId: PropTypes.any,
  isLoading: PropTypes.bool,
};

ChooseCampaignOwnerSection.defaultProps = {
  data: {},
  campaignId: undefined,
  isLoading: false,
};

export default ChooseCampaignOwnerSection;
