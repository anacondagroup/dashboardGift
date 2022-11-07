import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Box, Grid, Table, TableRow, TableHead, TableBody, TableCell, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import classNames from 'classnames';
import { fakeItemsFactory } from '@alycecom/utils';

import { ITeamDetail } from '../../../../store/billingGroups/billingGroups.types';
import HeaderCell from '../../BillingTableBreakdown/HeaderCell';
import { getTeamsListRequest } from '../../../../store/billingGroups';

const useStyles = makeStyles(() => ({
  title: {
    maxWidth: '280px',
    fontWeight: 'bolder',
  },
  container: {
    marginLeft: '1.5em',
    marginRight: '1.5em',
  },
}));

export interface ITeamsTableProps {
  groupId: string | null;
  teamsList: ITeamDetail[];
  isLoadingTeams: boolean;
}

const TeamsTable = ({ teamsList, isLoadingTeams, groupId }: ITeamsTableProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const initialHeight = 30;

  const rows = useMemo(
    () =>
      fakeItemsFactory(
        teamsList,
        isLoadingTeams,
        () =>
          ({
            orgId: 0,
            groupId: null,
            teamId: 0,
            teamName: '',
            teamOwnerId: 0,
            totalUsers: 0,
            totalActiveCampaigns: 0,
          } as ITeamDetail),
      ),
    [teamsList, isLoadingTeams],
  );

  useEffect(() => {
    dispatch(getTeamsListRequest({ groupId }));
  }, [groupId, dispatch]);

  const renderTable = useCallback(() => {
    if (teamsList.length > 0) {
      return (
        <>
          <Table className={classes.container}>
            <TableHead>
              <TableRow>
                <HeaderCell padding="none">NAME</HeaderCell>
                <HeaderCell align="left">TOTAL USERS</HeaderCell>
                <HeaderCell align="left">CURRENT # ACTIVE CAMPAIGNS</HeaderCell>
                <HeaderCell align="left" padding="none" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(team => (
                <TableRow key={`group-id-${team.teamId}`}>
                  <TableCell>
                    {isLoadingTeams ? <Skeleton width="100%" height={initialHeight} /> : <Box>{team.teamName}</Box>}
                  </TableCell>
                  <TableCell>
                    {isLoadingTeams ? <Skeleton width="100%" height={initialHeight} /> : <Box>{team.totalUsers}</Box>}
                  </TableCell>
                  <TableCell>
                    {isLoadingTeams ? (
                      <Skeleton width="100%" height={initialHeight} />
                    ) : (
                      <Box>{team.totalActiveCampaigns}</Box>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      );
    }
    return (
      <>
        <Box ml={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <Typography className="H4-Light" align="center">
            There are no teams associated with this group
          </Typography>
        </Box>
      </>
    );
  }, [teamsList, isLoadingTeams, rows, classes.container]);

  return (
    <>
      <Grid container item xs={12} direction="row">
        <Grid item xs={9}>
          <Box ml={3} mr={3} display="flex" justifyContent="left" alignItems="center" minHeight="5vh">
            <Typography className={classNames('H1', classes.title)}>Teams</Typography>
          </Box>
        </Grid>
      </Grid>
      {renderTable()}
    </>
  );
};

export default memo(TeamsTable);
