import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';

import CampaignSidebarSectionAvatar from '../../CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';

const useStyles = makeStyles(theme => ({
  title: {
    padding: `0px ${theme.spacing(4)}`,
  },
}));

const UntouchedSection = ({ title, status, order }) => {
  const classes = useStyles();
  return (
    <>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box className={classnames('Body-Regular-Left-Inactive', classes.title)}>{title}</Box>
    </>
  );
};

UntouchedSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
};

export default UntouchedSection;
