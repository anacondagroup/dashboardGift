import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Box, Checkbox, FormControlLabel, MenuItem, Slide } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SelectFilter, ActionButton, DashboardIcon } from '@alycecom/ui';

const useStyles = makeStyles(theme => ({
  protipIcon: {
    color: theme.palette.green.main,
  },
}));

const CampaignSendAs = ({ selectedMemberId, isLocked, members, isLoading, campaignId, onSubmit }) => {
  const classes = useStyles();
  const [memberId, setMemberId] = useState(selectedMemberId);
  const [isMemberLocked, setIsMemberLocked] = useState(isLocked);

  useEffect(() => {
    setMemberId(selectedMemberId);
  }, [selectedMemberId]);

  useEffect(() => {
    setIsMemberLocked(isLocked);
  }, [isLocked]);

  const membersWithEmpty = [{ id: null, first_name: 'None', last_name: '' }, ...members];

  const selectedMember = useMemo(() => members.find(member => member.id === selectedMemberId), [
    selectedMemberId,
    members,
  ]);

  return (
    <Box display="flex" flexDirection="column" width="50%">
      <SelectFilter
        fullWidth
        disabled={isLoading}
        margin="normal"
        onFilterChange={e => setMemberId(e.sendAs)}
        renderItems={() =>
          membersWithEmpty.map(user => (
            <MenuItem key={user.id} value={user.id}>
              {`${user.first_name} ${user.last_name}`}
            </MenuItem>
          ))
        }
        label="Who is the default send-as?"
        value={memberId}
        name="sendAs"
      />
      {memberId && (
        <Box pt={1} pb={2}>
          <FormControlLabel
            control={
              <Checkbox
                disabled={isLoading}
                checked={!isMemberLocked}
                onChange={() => setIsMemberLocked(!isMemberLocked)}
                color="primary"
              />
            }
            label="Allow team members to change this on a per gift basis"
          />
        </Box>
      )}
      <Slide direction="up" in={isMemberLocked && memberId} mountOnEnter unmountOnExit>
        <Box
          mb={3}
          p={2}
          width={1}
          height="58px"
          bgcolor="green.fruitSaladLight"
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <DashboardIcon icon="graduation-cap" className={classes.protipIcon} />
          <Box pl={2} className="Subcopy-Static-Alt">
            Tip: All existing gifts that have not been sent will now be sent as
            {selectedMember ? ` ${selectedMember.first_name} ${selectedMember.last_name}` : ''}
          </Box>
        </Box>
      </Slide>
      <Box mt={2}>
        <ActionButton
          width={100}
          onClick={() =>
            onSubmit({
              campaignId,
              userId: memberId,
              canOverrideFrom: !isMemberLocked,
            })
          }
          disabled={isLoading}
        >
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

CampaignSendAs.propTypes = {
  selectedMemberId: PropTypes.number,
  isLocked: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  members: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CampaignSendAs.defaultProps = {
  selectedMemberId: null,
};

export default CampaignSendAs;
