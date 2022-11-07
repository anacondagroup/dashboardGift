import React from 'react';
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { DashboardIcon, ActionButton } from '@alycecom/ui';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';

import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';

const useStyles = makeStyles(() => ({
  avatar: {
    boxShadow: 'none',
    color: '#8f9aaa',
    background: '#ffffff',
  },
  notificationRole: {
    lineHeight: '1.5 !important',
  },
}));

const titles = {
  need_more_information: 'Need more information',
  options_are_ready: 'Gift options ready',
  invitation_is_delivered: 'Gift invitation delivered',
  gift_viewed: 'Gift viewed',
  gift_recipient_actions_group: 'Gift accepted/declined',
  gift_expired_unexpired: 'Gift expired',
};

const NotificationsTable = ({ notifications, owner, sendAs, onToggle, onSave, campaignType }) => {
  const classes = useStyles();
  return (
    <Box>
      <Box mt={2} mb={2}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Gift status</TableCell>
              <TableCell colSpan={3}>Email recipient(s)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(notifications).map(([key, notification]) => (
              <TableRow key={key}>
                <TableCell className="Body-Regular-Left-Static-Bold">{titles[key]}</TableCell>
                <TableCell>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={notification.notify_owner}
                        onChange={(e, value) => onToggle(key, 'notify_owner', value)}
                        value="notify_owner"
                        color="primary"
                      />
                    }
                    label={
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Box mr={1}>
                          <Avatar className={classes.avatar} alt={owner.full_name} src={owner.avatar}>
                            <DashboardIcon icon="user" />
                          </Avatar>
                        </Box>
                        <Box>
                          <Typography className={classNames('Tables-Textual', classes.notificationRole)}>
                            Campaign owner
                          </Typography>
                          <Typography className="Body-Small-Inactive">{owner.full_name}</Typography>
                        </Box>
                      </Box>
                    }
                  />
                </TableCell>
                {campaignType !== CAMPAIGN_TYPES.ACTIVATE && (
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notification.notify_sender}
                          onChange={(e, value) => onToggle(key, 'notify_sender', value)}
                          value="notify_sender"
                          color="primary"
                        />
                      }
                      label={
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Box mr={1}>
                            <Avatar className={classes.avatar} alt="Sender">
                              <DashboardIcon icon="users" />
                            </Avatar>
                          </Box>
                          <Box>
                            <Typography className={classNames('Tables-Textual', classes.notificationRole)}>
                              Gift sender
                            </Typography>
                            <Typography className="Body-Small-Inactive">Multiple users</Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </TableCell>
                )}
                {campaignType === CAMPAIGN_TYPES.STANDARD && (
                  <TableCell>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={notification.notify_send_as_person}
                          onChange={(e, value) => onToggle(key, 'notify_send_as_person', value)}
                          value="notify_send_as"
                          color="primary"
                        />
                      }
                      label={
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Box mr={1}>
                            <Avatar className={classes.avatar} alt={sendAs.full_name} src={sendAs.avatar}>
                              <DashboardIcon icon="user" />
                            </Avatar>
                          </Box>
                          <Box>
                            <Typography className={classNames('Tables-Textual', classes.notificationRole)}>
                              Campaign send as
                            </Typography>
                            <Typography className="Body-Small-Inactive">{sendAs.full_name}</Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton width={100} onClick={onSave}>
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

NotificationsTable.propTypes = {
  onSave: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  notifications: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  owner: PropTypes.object,
  // eslint-disable-next-line react/forbid-prop-types
  sendAs: PropTypes.object,
  campaignType: PropTypes.string,
};
NotificationsTable.defaultProps = {
  sendAs: {},
  notifications: {},
  owner: {},
  campaignType: 'standard',
};

export default NotificationsTable;
