import React, { memo, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Paper,
  Box,
  Grid,
  Table,
  TableRow,
  TablePagination,
  TableFooter,
  Skeleton,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, Icon, Button } from '@alycecom/ui';
import { fakeItemsFactory } from '@alycecom/utils';
import classNames from 'classnames';

import {
  IBillingGroup,
  getBillingGroupsIsLoading,
  getBillingGroups,
  getPagination,
  getIsSearching,
  setBillingGroupsCurrentPage,
} from '../../../store/billingGroups';
import { setModalOpen, setCreateBillingGroupData } from '../../../store/editBillingGroups/editBillingGroups.actions';
import { createEmptyBillingGroupData } from '../../../shapes/billingGroupContact.shape';
import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';

import GroupDetails from './GroupDetails/GroupDetails';
import TeamsTable from './TeamsTable/TeamsTable';
import BillingGroupsSearch from './BillingGroupsSearch/BillingGroupsSearch';

export interface IBillingGroupsProps {
  onBillingGroupClick?: () => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  title: {
    maxWidth: '280px',
    fontWeight: 'bolder',
  },
  buttonBillingGroup: {
    border: '1px solid',
    borderColor: palette.grey.regular,
  },
}));

const BillingGroups = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const initialHeight = 80;
  const initialPadding = 2;

  const groupsList = useSelector(getBillingGroups);
  const isLoading = useSelector(getBillingGroupsIsLoading);
  const paginationInfo = useSelector(getPagination);
  const isSearching = useSelector(getIsSearching);

  const rows = useMemo(
    () =>
      fakeItemsFactory(
        groupsList,
        isLoading,
        () =>
          (({
            billingInfo: {},
            teams: [],
            teamsLoaded: false,
            isLoadingTeams: false,
          } as unknown) as IBillingGroup),
      ),
    [groupsList, isLoading],
  );

  const isTableEmpty = rows.length === 0;

  const buildCardHeader = useCallback((groupName, countTeams) => {
    const message = countTeams === 1 ? `${groupName} (${countTeams} Team)` : `${groupName} (${countTeams} Teams)`;
    return message;
  }, []);

  const handlePaginationChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      dispatch(setBillingGroupsCurrentPage(page + 1));
    },
    [dispatch],
  );

  const handleOpenModal = useCallback(() => {
    trackEvent('Manage Billing - Billing Groups - Modal Open Create Billing Group');
    dispatch(setCreateBillingGroupData(createEmptyBillingGroupData()));
    dispatch(setModalOpen(true));
  }, [dispatch, trackEvent]);

  const renderCards = useCallback(() => {
    if (isTableEmpty) {
      return (
        <Box m={2}>
          <Typography className="H4-Light" align="center">
            {!isSearching
              ? 'There are no groups or teams associated with this account'
              : 'No matches found. Please try another search'}
          </Typography>
        </Box>
      );
    }
    return rows.map((group: IBillingGroup) =>
      isLoading ? (
        <Box ml={3} mr={3} pl={initialPadding} pr={initialPadding} key={group.billingInfo.groupId}>
          <Skeleton variant="text" width="100%" height={initialHeight} />
        </Box>
      ) : (
        <Paper elevation={0} key={group.billingInfo.groupId}>
          <Box ml={3} mr={3} p={2} key={group.billingInfo.groupId}>
            <Paper elevation={3}>
              <Accordion expanded={group.isExpanded}>
                <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header">
                  <Box ml={3}>
                    <Typography className={classNames('H1-black', classes.title)}>
                      {buildCardHeader(group.billingInfo.groupName, group.billingInfo.teamsCount)}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <Divider />
                <Box mt={2}>
                  <AccordionDetails>
                    <Grid item xs={12}>
                      <Box ml={3} mr={3}>
                        <GroupDetails
                          groupDetails={group.billingInfo}
                          teamsLoaded={group.teamsLoaded}
                          teamsList={group.teams}
                          key={`info-${group.billingInfo.groupName}`}
                        />
                      </Box>

                      <Grid container>
                        <TeamsTable
                          isLoadingTeams={group.isLoadingTeams}
                          teamsList={group.teams}
                          groupId={group.billingInfo.groupId}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Box>
              </Accordion>
            </Paper>
          </Box>
        </Paper>
      ),
    );
  }, [isTableEmpty, isLoading, initialPadding, initialHeight, classes.title, rows, isSearching, buildCardHeader]);

  return (
    <>
      <Box pl={5} pt={3}>
        <Typography className={classNames('H1-black', classes.title)}>Billing Groups</Typography>
      </Box>
      <Box pl={5} pt={4}>
        <Typography className={classNames('H4-black')}>
          Need to invoice one or more teams separately? <Box component="span">Billing groups </Box>
          allow you to set specific instructions and contacts for one or more teams within your organization.
        </Typography>
      </Box>
      <Box pl={5} pt={4}>
        <Button
          className={classNames(classes.buttonBillingGroup)}
          startIcon={<Icon icon="plus" />}
          onClick={handleOpenModal}
        >
          New Billing Group
        </Button>
      </Box>

      <Box mt={2} mb={2}>
        <Grid container item xs={12}>
          <Grid item xs={3}>
            <Box pl={5}>
              <BillingGroupsSearch />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {renderCards()}

      <Grid container alignItems="center" justifyContent="flex-end">
        {!isTableEmpty && !isLoading && (
          <Box pr={3}>
            <Table>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    data-testid="BillingGroups.Pagination"
                    rowsPerPageOptions={[paginationInfo.perPage]}
                    colSpan={12}
                    count={paginationInfo.total}
                    rowsPerPage={paginationInfo.perPage}
                    page={paginationInfo.currentPage - 1}
                    SelectProps={{
                      native: true,
                    }}
                    onPageChange={handlePaginationChange}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </Box>
        )}
      </Grid>
    </>
  );
};

export default memo(BillingGroups);
