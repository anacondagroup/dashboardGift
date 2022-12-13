import React, { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Table, TableRow, TableHead, TableBody, Grid, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { fakeItemsFactory } from '@alycecom/utils';

import HeaderCell from '../BillingTableBreakdown/HeaderCell';
import {
  getAcceptedGroups,
  getAcceptedIsLoading,
  getAcceptedTotalInvites,
  getAcceptedTotalMoney,
} from '../../../store/breakdowns';
import { TGroup } from '../../../types';

import Group from './Group';
import Total from './Total';

const useStyles = makeStyles(({ spacing }) => ({
  paper: {
    padding: spacing(2, 3, 1, 3),
    marginTop: spacing(1),
  },
  header: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: spacing(1),
  },
  table: {
    tableLayout: 'fixed',
  },
  acceptedCostCol: {
    width: 125,
  },
  acceptedCountCol: {
    width: 125,
  },
  expandCol: {
    width: 40,
  },
}));

const BreakdownAcceptedGifts = () => {
  const classes = useStyles();

  const groups = useSelector(getAcceptedGroups);
  const isLoading = useSelector(getAcceptedIsLoading);
  const totalInvites = useSelector(getAcceptedTotalInvites);
  const totalMoney = useSelector(getAcceptedTotalMoney);

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
          } as TGroup),
      ),
    [groups, isLoading],
  );

  return (
    <Box className={classes.paper}>
      <Grid container className={classes.header}>
        <Grid item>
          <Total totalMoney={totalMoney} totalCount={totalInvites} isLoading={isLoading} />
        </Grid>
      </Grid>
      <Table className={classes.table}>
        <colgroup>
          <col />
          <col className={classes.acceptedCostCol} />
          <col className={classes.acceptedCountCol} />
          <col className={classes.expandCol} />
        </colgroup>
        <TableHead>
          <TableRow>
            <HeaderCell padding="none">Team</HeaderCell>
            <HeaderCell align="right">Accepted ($)</HeaderCell>
            <HeaderCell align="right">Accepted (#)</HeaderCell>
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
            No gifts were accepted during the selected period
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default memo(BreakdownAcceptedGifts);
