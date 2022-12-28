import React, { memo, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Typography, Box, Grid, Table, TableRow, TableHead, TableBody, TableCell, Skeleton } from '@mui/material';
import { fakeItemsFactory } from '@alycecom/utils';
import { AlyceTheme } from '@alycecom/ui';
import moment from 'moment';
import { SHORT_DATE_FORMAT } from '@alycecom/modules';

import { ITeamDetail } from '../../../../store/billingGroups/billingGroups.types';
import HeaderCell from '../../BillingTableBreakdown/HeaderCell';
import { getTeamsListRequest } from '../../../../store/billingGroups';

const styles = {
  title: {
    maxWidth: 280,
    fontWeight: 'bolder',
  },
  container: {
    mx: 2,
  },
  archivedAt: {
    color: ({ palette }: AlyceTheme) => palette.additional.chambray20,
  },
} as const;

export interface ITeamsTableProps {
  groupId: string | null;
  teamsList: ITeamDetail[];
  isLoadingTeams: boolean;
}

const TeamsTable = ({ teamsList, isLoadingTeams, groupId }: ITeamsTableProps) => {
  const dispatch = useDispatch();

  const hasTeams = teamsList.length > 0;

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

  return (
    <>
      <Grid container item xs={12} direction="row">
        <Grid item xs={9}>
          <Box ml={3} mr={3} display="flex" justifyContent="left" alignItems="center" minHeight="5vh">
            <Typography sx={styles.title}>Teams</Typography>
          </Box>
        </Grid>
      </Grid>
      {hasTeams ? (
        <Table sx={styles.container}>
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
                  {isLoadingTeams ? (
                    <Skeleton width="100%" height={30} />
                  ) : (
                    <Box>
                      {team.teamName}{' '}
                      {team.archivedAt && (
                        <Box component="span" sx={styles.archivedAt}>
                          (Archived {moment(team.archivedAt).format(SHORT_DATE_FORMAT)})
                        </Box>
                      )}
                    </Box>
                  )}
                </TableCell>
                <TableCell>
                  {isLoadingTeams ? <Skeleton width="100%" height={30} /> : <Box>{team.totalUsers}</Box>}
                </TableCell>
                <TableCell>
                  {isLoadingTeams ? <Skeleton width="100%" height={30} /> : <Box>{team.totalActiveCampaigns}</Box>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <Box ml={3} display="flex" justifyContent="center" alignContent="center" alignItems="center">
          <Typography className="H4-Light" align="center">
            There are no teams associated with this group
          </Typography>
        </Box>
      )}
    </>
  );
};

export default memo(TeamsTable);
