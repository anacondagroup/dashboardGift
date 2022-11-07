import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Typography, Box, Avatar } from '@mui/material';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    boxShadow: 'none',
    color: '#8f9aaa',
    background: palette.common.white,
  },
}));

const UserTableInfo = ({ user }) => {
  const classes = useStyles();
  return (
    <Box display="flex" flexDirection="row" alignItems="center">
      <Box mr={1}>
        <Avatar className={classes.root} alt={user.full_name} src={user.image} />
      </Box>
      <Box>
        <Typography className="Body-Regular-Left-ALL-CAP-LINK-Bold">{user.full_name}</Typography>
        <Typography className="Body-Small-Inactive">{user.email}</Typography>
      </Box>
    </Box>
  );
};

UserTableInfo.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string,
    image: PropTypes.string,
    full_name: PropTypes.string.isRequired,
  }).isRequired,
};

UserTableInfo.defaultProps = {};

export default UserTableInfo;
