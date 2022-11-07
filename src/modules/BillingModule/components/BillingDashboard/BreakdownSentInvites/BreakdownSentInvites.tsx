import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableBody, TableHead, TableRow, Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory } from '@alycecom/utils';

import HeaderCell from '../BillingTableBreakdown/HeaderCell';
import { getSentGroups, getSentIsLoading, getSentTotalInvites } from '../../../store/breakdowns';
import { IGroup } from '../../../types';

import Group from './Group';
import Total from './Total';

const useStyles = makeStyles(({ spacing }) => ({
  paper: {
    padding: spacing(2, 3, 1, 3),
    marginTop: spacing(1),
  },
  header: {
    alignItems: 'flex-end',
    marginLeft: spacing(1),
  },
  table: {
    tableLayout: 'fixed',
  },
  sentCol: {
    width: 100,
  },
  expandCol: {
    width: 40,
  },
}));

const BreakdownSentInvites = () => {
  const classes = useStyles();

  const groups = useSelector(getSentGroups);
  const totalInvites = useSelector(getSentTotalInvites);
  const isLoading = useSelector(getSentIsLoading);

  const rows = useMemo(
    () =>
      fakeItemsFactory(
        groups,
        isLoading,
        id =>
          ({
            groupId: String(id),
            groupName: '',
            teams: [],
            totalInvites: 0,
            totalMoney: 0,
          } as IGroup),
      ),
    [groups, isLoading],
  );

  return (
    <Box className={classes.paper}>
      <Grid container justifyContent="space-between" className={classes.header}>
        <Grid item>
          <Total totalCount={totalInvites} isLoading={isLoading} />
        </Grid>
      </Grid>
      <Table className={classes.table}>
        <colgroup>
          <col />
          <col className={classes.sentCol} />
          <col className={classes.expandCol} />
        </colgroup>
        <TableHead>
          <TableRow>
            <HeaderCell padding="none">Team</HeaderCell>
            <HeaderCell align="right">Sent</HeaderCell>
            <HeaderCell align="right" padding="none" />
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(group => (
            <Group
              group={group}
              isLoading={isLoading}
              isExpandedByDefault={rows.length === 1}
              key={`group-id-${group.groupId}`}
            />
          ))}
        </TableBody>
      </Table>
      {rows.length === 0 && (
        <Box m={2}>
          <Typography className="H4-Light" align="center">
            No invites were sent during the selected period
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default memo(BreakdownSentInvites);
