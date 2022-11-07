import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

import CampaignSidebarSectionAvatar from '../../CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';

const useStyles = makeStyles(() => ({
  title: {
    textTransform: 'uppercase',
    lineHeight: '1 !important',
  },
  editIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
}));

const SkippedSection = ({ title, status, order, campaignId, handleEdit, children }) => {
  const classes = useStyles();
  return (
    <>
      <CampaignSidebarSectionAvatar status={status} avatar={order} />
      <Box ml={6}>
        <Box display="flex" justifyContent="space-between" pr={2}>
          <Box className={classnames('Label-Table-Left-Static', classes.title)}>{title}</Box>
          {campaignId && handleEdit && (
            <Box
              className="Body-Small-Link"
              display="flex"
              alignItems="center"
              style={{ cursor: 'pointer' }}
              onClick={handleEdit}
            >
              <DashboardIcon className={classes.editIcon} color="inherit" icon="pencil" />
              Edit
            </Box>
          )}
        </Box>
        <Box className="H3-Chambray">{children || '-'}</Box>
      </Box>
    </>
  );
};

SkippedSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  campaignId: PropTypes.number,
  handleEdit: PropTypes.func,
  children: PropTypes.node,
};

SkippedSection.defaultProps = {
  campaignId: undefined,
  handleEdit: undefined,
  children: undefined,
};

export default SkippedSection;
