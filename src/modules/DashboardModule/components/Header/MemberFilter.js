import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, MenuItem } from '@mui/material';
import { DateRangeSelect } from '@alycecom/ui';

import { memberShape } from '../../shapes/member.shape';
import SelectFilter from '../../../../components/Dashboard/Header/SelectFilter';

const MemberFilter = ({ onFilterChange, onMemberChange, members, memberId, dateRangeFrom, dateRangeTo, isLoading }) => {
  const handleDatesChange = useCallback(
    event => {
      onFilterChange(event);
    },
    [onFilterChange],
  );

  const handleMemberChange = useCallback(
    event => {
      onMemberChange(event.memberId);
    },
    [onMemberChange],
  );

  return (
    <Grid item container direction="row" justifyContent="flex-end" alignItems="flex-end" xs={4}>
      <SelectFilter
        disabled={isLoading}
        label="All members"
        value={memberId}
        name="memberId"
        onFilterChange={handleMemberChange}
        renderItems={() =>
          members.map(member => (
            <MenuItem key={member.id} value={member.id}>
              {member.fullName}
            </MenuItem>
          ))
        }
      />
      <Box ml={1}>
        <DateRangeSelect disabled={isLoading} from={dateRangeFrom} to={dateRangeTo} onChange={handleDatesChange} />
      </Box>
    </Grid>
  );
};

MemberFilter.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  onMemberChange: PropTypes.func.isRequired,
  members: PropTypes.arrayOf(memberShape).isRequired,
  memberId: PropTypes.string,
  dateRangeFrom: PropTypes.string,
  dateRangeTo: PropTypes.string,
  isLoading: PropTypes.bool,
};

MemberFilter.defaultProps = {
  memberId: '',
  dateRangeFrom: '',
  dateRangeTo: '',
  isLoading: false,
};

export default memo(MemberFilter);
