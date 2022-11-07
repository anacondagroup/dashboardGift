import React, { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, FormProvider } from 'react-hook-form';
import {
  Drawer,
  Typography,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  Skeleton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Icon, Divider, SidebarHeader as HeaderTopBar } from '@alycecom/ui';
import classNames from 'classnames';

import giftingFlowImage from '../../../../../../assets/images/contact-details-top-bar.svg';
import {
  getEditTeamsModalIsOpen,
  getIsSavingInProgress,
  getIsLoadingTeamsList,
  getTeamsList,
  getFilterGrouped,
  setEditTeamsOpen,
  setFilterGroupedTeams,
  addRemoveTeamFromGroup,
  updateTeamsListInGroupRequest,
} from '../../../../store/editTeams';
import { useBillingTrackEvent } from '../../../../hooks/useBillingTrackEvent';

import EditTeamsSearch from './EditTeamsSearch';

const initialWidth = 496;
const useStyles = makeStyles<AlyceTheme>(({ palette, spacing, zIndex }) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    margin: spacing(1),
    background: 'none',
  },
  container: {
    width: initialWidth,
    paddingTop: spacing(2),
    paddingRight: spacing(3),
    paddingLeft: spacing(2),
  },
  title: {
    maxWidth: '280px',
    fontWeight: 'bolder',
  },
  subtitle: {
    fontWeight: 'bolder',
  },
  drawer: {
    width: initialWidth,
  },
  margin: {
    width: '35%',
  },
  marginPurchase: {
    width: '49%',
  },
  buttonSubmit: {
    marginLeft: spacing(3),
    '& svg': {
      marginRight: spacing(1),
    },
    color: palette.common.white,
  },
  buttonCancel: {
    color: palette.link.main,
    marginRight: spacing(5),
  },
  hintText: {
    fontSize: '0.7em',
  },
  footer: {
    zIndex: zIndex.speedDial,
    flex: '0 0 76px',
    marginTop: spacing(4),
    padding: spacing(2, 4),
    position: 'fixed',
    bottom: 10,
    right: '1em',
  },
}));

export interface EditTeamsProps {
  currentGroupId: string | null;
}

const EditTeams = ({ currentGroupId }: EditTeamsProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();
  const initialHeight = 30;

  const formMethods = useForm<{ teamIds: number[] }>({ mode: 'all' });

  const { handleSubmit } = formMethods;

  const isOpen = useSelector(getEditTeamsModalIsOpen);
  const isUpdateInProgress = useSelector(getIsSavingInProgress);
  const isLoadingTeamsList = useSelector(getIsLoadingTeamsList);
  const isFilterGrouped = useSelector(getFilterGrouped);

  const [teamsChanged, setTeamsChanged] = useState<boolean>(false);

  const isDisable = isUpdateInProgress || !teamsChanged;

  const listTeams = useSelector(getTeamsList);

  const onSubmit = useCallback(() => {
    const teamListToSend = listTeams.filter(team => team.chose).map(team => team.teamId);
    dispatch(updateTeamsListInGroupRequest({ teamIds: teamListToSend }));
  }, [dispatch, listTeams]);

  const handleChange = useCallback(() => {
    dispatch(setFilterGroupedTeams(!isFilterGrouped));
    trackEvent(`Manage billing - Biling groups - Edit teams - Filter check used`);
  }, [dispatch, trackEvent, isFilterGrouped]);

  const onCancel = useCallback(
    (buttonName: string) => {
      setTeamsChanged(false);
      dispatch(setEditTeamsOpen({ openModal: false, groupId: '' }));
      trackEvent(`Manage billing - Biling groups - Edit teams - ${buttonName} button clicked`);
    },
    [dispatch, trackEvent],
  );

  const toggleCheck = useCallback(
    (isChecked: boolean, teamId: number) => {
      setTeamsChanged(true);
      dispatch(addRemoveTeamFromGroup({ teamId, chose: isChecked }));
    },
    [dispatch],
  );

  return (
    <Drawer disableEnforceFocus open={isOpen} anchor="right" className={classes.drawer}>
      <Box>
        <HeaderTopBar onClose={() => onCancel('Close')} bgTheme="green-gradient" bgImage={giftingFlowImage}>
          <Box ml={2}>
            <Typography className={classNames('H4-White', classes.title)}>Edit Billing Group Teams</Typography>
          </Box>
        </HeaderTopBar>

        <Box className={classes.container}>
          <Box mt={2} mr={2} ml={2}>
            <Typography className={classes.subtitle} data-testid="BillingGroups.EditTeams.Description">
              Add and remove teams from this billing group. For teams that are already contained in billing groups, you
              will need to remove them from that group before adding it to this group.
            </Typography>
          </Box>

          <Box ml={1}>
            <FormProvider {...formMethods}>
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                <FormControl className={classes.root}>
                  <Box mt={2}>
                    <Typography className={classes.subtitle} data-testid="BillingGroups.EitTeams.SubTitle">
                      Included Teams
                    </Typography>
                  </Box>

                  <Box mt={2} mb={4} mr={2}>
                    <EditTeamsSearch currentGroupId={currentGroupId} />
                    <FormControlLabel
                      control={
                        <Checkbox checked={isFilterGrouped} onChange={handleChange} value="enabled" color="primary" />
                      }
                      label="Limit to teams that are not assigned to any group"
                    />
                  </Box>
                  <Divider />

                  <Box>
                    {!isLoadingTeamsList ? (
                      listTeams.map(({ teamId, teamName, groupId, groupName, chose, disabled }) => (
                        <Box
                          data-testid={`BillingGroups.EditTeams.${teamName}`}
                          key={teamId}
                          display="flex"
                          justifyContent="left"
                          alignItems="center"
                        >
                          <Grid item container xs={12} direction="row">
                            <Grid item xs={6}>
                              <Checkbox
                                edge="start"
                                checked={chose || false}
                                color="primary"
                                disabled={disabled}
                                onClick={() => toggleCheck(!chose, teamId)}
                              />
                              {teamName}
                            </Grid>
                            <Grid item xs={6}>
                              <Box display="flex" justifyContent="left" alignItems="center" minHeight="5vh">
                                <Typography className={classes.hintText}>
                                  {groupId ? `In "${groupName}"` : ''}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </Box>
                      ))
                    ) : (
                      <Box>
                        {Array.from({ length: 5 }, (_, index) => (
                          <Box p={1} key={index}>
                            <Skeleton variant="text" width="75%" height={initialHeight} />
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </FormControl>

                <Box className={classes.footer}>
                  <Button
                    onClick={() => onCancel('Cancel')}
                    className={classes.buttonCancel}
                    variant="outlined"
                    data-testid="BillingGroups.EditTeams.Cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    color="secondary"
                    variant="contained"
                    data-testid="BillingGroups.EditTeams.CreateGroup"
                    disabled={isDisable}
                    className={classes.button}
                    startIcon={isUpdateInProgress && <Icon spin icon="spinner" color="inherit" />}
                  >
                    <Typography>Save Teams</Typography>
                  </Button>
                </Box>
              </Box>
            </FormProvider>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default memo(EditTeams);
