import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import classnames from 'classnames';
import { makeStyles } from '@mui/styles';
import { DashboardIcon } from '@alycecom/ui';

import CampaignSidebarSectionAvatar from '../../CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';

const useStyles = makeStyles(theme => ({
  title: {
    textTransform: 'uppercase',
    lineHeight: '1 !important',
  },
  editIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  multilineChildren: {
    overflow: 'hidden',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
    fontSize: '1rem',
    lineHeight: 1.5,
    marginTop: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
}));

const CompletedSection = ({ title, status, order, campaignId, handleEdit, multiline, children, rButtonText }) => {
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
              {rButtonText}
            </Box>
          )}
        </Box>
        {multiline ? (
          <Box className={classes.multilineChildren}>{children || '-'}</Box>
        ) : (
          <Box className="H3-Chambray">{children || '-'}</Box>
        )}
      </Box>
    </>
  );
};

CompletedSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  campaignId: PropTypes.number,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  handleEdit: PropTypes.func,
  rButtonText: PropTypes.string,
  multiline: PropTypes.bool,
};

CompletedSection.defaultProps = {
  campaignId: undefined,
  handleEdit: undefined,
  children: undefined,
  multiline: false,
  rButtonText: 'Edit',
};

export default CompletedSection;
