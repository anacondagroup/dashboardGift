import React, { memo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Typography,
  Box,
  Grid,
  Popper,
  MenuItem,
  ClickAwayListener,
  Grow,
  Paper,
  MenuList,
  Divider,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { ActionButton, AlyceTheme, Icon } from '@alycecom/ui';

import { IGroupsDetailsComplete, getTeamsListRequest, ITeamDetail } from '../../../../store/billingGroups';
import { TCreateBillingGroupForm } from '../../../../store/editBillingGroups/editBillingGroups.types';
import { setCreateBillingGroupData, setModalOpen } from '../../../../store/editBillingGroups/editBillingGroups.actions';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';
import { createBillingContact } from '../../../../shapes/billingGroupContact.shape';
import { setEditTeamsOpen, setCurrentTeamsToEditGroup } from '../../../../store/editTeams';
import EditTeams from '../EditTeams/EditTeams';

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  title: {
    maxWidth: '280px',
    fontWeight: 'bolder',
  },
  editBillingGroup: {
    background: palette.green.dark,
    color: palette.common.white,
  },
  textAction: {
    color: palette.link.main,
    cursor: 'pointer',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  toolbarMenu: {
    top: 84,
    width: 190,
  },
  buttonDivider: {
    marginLeft: '0.5em',
    marginRight: '0.5em',
  },
}));

export interface IGroupDetailsProps {
  groupDetails: IGroupsDetailsComplete;
  teamsList: ITeamDetail[];
  teamsLoaded: boolean;
}

const buildFormFromGroupDetails = (groupDetails: IGroupsDetailsComplete): TCreateBillingGroupForm => {
  const sendTo =
    groupDetails.emailsCc?.map(value => ({
      firstName: '',
      lastName: '',
      email: value,
    })) ?? [];
  const primaryBillingContact = groupDetails.email
    ? createBillingContact(groupDetails.firstName, groupDetails.lastName, groupDetails.email)
    : null;
  const data = {
    groupId: groupDetails.groupId,
    name: groupDetails.groupName,
    primaryBillingContact,
    sendInvoicesTo: sendTo,
    poNumber: groupDetails.poNumber || '',
  };
  return data as TCreateBillingGroupForm;
};

const GroupDetails = ({ groupDetails, teamsLoaded, teamsList }: IGroupDetailsProps) => {
  const classes = useStyles();
  const { firstName, lastName, email, emailsCc, poNumber, groupId, groupName } = groupDetails;
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const [anchor, setAnchor] = useState();

  const showEditTeamsButton = groupId && groupId.toUpperCase() !== 'UNGROUPED';

  const handleEditGroupOpenModal = useCallback(() => {
    const data = buildFormFromGroupDetails(groupDetails);
    trackEvent('Manage Billing - Billing Groups - Modal Open Edit Billing Group Details', data);
    dispatch(setCreateBillingGroupData(data));
    dispatch(setModalOpen(true));
  }, [dispatch, groupDetails, trackEvent]);

  const handleOpen = useCallback(ev => {
    setAnchor(ev.currentTarget);
  }, []);

  const handleClose = useCallback(() => setAnchor(undefined), []);

  const handleEditTeamSidebarOpen = useCallback(() => {
    dispatch(setEditTeamsOpen({ openModal: true, groupId }));
    dispatch(setCurrentTeamsToEditGroup({ groupName, teamsList }));
    trackEvent('Manage billing - Biling groups - Edit teams - Modal open');
  }, [dispatch, trackEvent, groupId, teamsList, groupName]);

  useEffect(() => {
    if (!teamsLoaded) {
      dispatch(getTeamsListRequest({ groupId }));
    }
  }, [teamsLoaded, groupId, dispatch]);

  return (
    <>
      <Box key={groupId}>
        <Grid container item xs={12}>
          <Grid item xs={6}>
            <Box pb={5}>
              <Box mb={1}>
                <Typography className={classNames('H1', classes.title)}>Billing Contact</Typography>
              </Box>
              <Grid item container xs={12}>
                {firstName || lastName || email ? (
                  <Typography>
                    <span data-testid={`BillingGroups.FirstName.${firstName}`}>{firstName} </span>
                    <span data-testid={`BillingGroups.LastName.${lastName}`}>{lastName}</span>
                    {email ? (
                      <a href={`mailto:${email}`}>
                        <span data-testid={`BillingGroups.Email.${email}`}> ({email})</span>
                      </a>
                    ) : (
                      ''
                    )}
                  </Typography>
                ) : (
                  <Box onClick={handleEditGroupOpenModal}>
                    <span className={classes.textAction}>None specified</span>
                  </Box>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box pb={5}>
              <Box mb={1}>
                <Typography className={classNames('H1', classes.title)}>Invoices are also sent to</Typography>
              </Box>
              {emailsCc && emailsCc.length > 0 ? (
                emailsCc.map((emailContact: string) => (
                  <Typography key={`contact-${emailContact}`} data-testid={`BillingGroups.EmailCc.${emailContact}`}>
                    <a href={`mailto:${emailContact}`}>{emailContact}</a>
                  </Typography>
                ))
              ) : (
                <Box onClick={handleEditGroupOpenModal}>
                  <span className={classes.textAction}>None specified</span>
                </Box>
              )}
            </Box>
          </Grid>
          <Grid item xs={2}>
            <Box pb={4} alignItems="center" display="flex" justifyContent="right" minHeight="10vh">
              <ActionButton onClick={handleOpen}>
                Edit
                <Divider orientation="vertical" variant="middle" flexItem className={classes.buttonDivider} />
                <Box pb={3} alignItems="center" height={20}>
                  <Icon icon="angle-down" />
                </Box>
              </ActionButton>

              <Popper open={Boolean(anchor)} anchorEl={anchor} transition className={classes.toolbarMenu}>
                {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                    <div>
                      <ClickAwayListener onClickAway={handleClose}>
                        <Paper>
                          <MenuList>
                            <MenuItem
                              onClick={handleEditGroupOpenModal}
                              data-testid="BillingGroups.EditButton.BillingDetails"
                            >
                              Billing Details
                            </MenuItem>
                            {showEditTeamsButton && (
                              <MenuItem
                                onClick={handleEditTeamSidebarOpen}
                                data-testid="BillingGroups.EditButton.EditTeams"
                              >
                                Teams
                              </MenuItem>
                            )}
                          </MenuList>
                        </Paper>
                      </ClickAwayListener>
                    </div>
                  </Grow>
                )}
              </Popper>
            </Box>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <Box pb={2}>
            <Typography className={classNames('H1', classes.title)}>PO Number</Typography>
            <Typography>
              {poNumber ? (
                <span data-testid={`BillingGroups.PoNumber.${poNumber}`}>{poNumber}</span>
              ) : (
                <Box onClick={handleEditGroupOpenModal}>
                  <span className={classes.textAction}>None specified</span>
                </Box>
              )}
            </Typography>
            <Typography>You may still specify PO number for individual invoices</Typography>
          </Box>
        </Grid>
      </Box>
      <EditTeams currentGroupId={groupId} />
    </>
  );
};

export default memo(GroupDetails);
