import React, { memo, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { IColumn, IDefaultRowData, NumberFormat, TableCellTooltip, TableDataRow, TableHeadRow } from '@alycecom/ui';
import { fakeItemsFactory } from '@alycecom/utils';

import {
  getHierarchy,
  getHierarchyIsLoading,
  getSelectedAccount,
  setSelectedAccount,
} from '../../../store/customerOrg';
import { IDeposit } from '../../../types';

const useStyles = makeStyles(() => ({
  table: {
    tableLayout: 'fixed',
  },
  colMoney: {
    width: '40%',
  },
  indent: {
    width: 30,
    height: 1,
    float: 'left',
  },
  row: {
    cursor: 'pointer',
  },
}));

type TRowData = IDefaultRowData & { name: string; deposit: IDeposit; level: number; isUngrouped?: boolean };

const OrgHierarchy = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const hierarchy = useSelector(getHierarchy);
  const isLoading = useSelector(getHierarchyIsLoading);

  const selected = useSelector(getSelectedAccount);
  const handleSelect = useCallback(
    (data: TRowData) => {
      if (data.selectable) {
        dispatch(
          setSelectedAccount({
            id: data.id,
            name: data.name,
            accountId: data.deposit.accountId,
            level: data.level,
          }),
        );
      }
    },
    [dispatch],
  );

  const rows = useMemo(() => {
    const hierarchyList: TRowData[] = [
      {
        id: 'ALLG&T',
        name: 'All Groups and Teams',
        deposit: hierarchy.depositsTotal,
        level: 0,
        selectable: true,
      },
    ];
    hierarchyList.push(
      ...hierarchy.groupGrouped.reduce<TRowData[]>((acc: TRowData[], group) => {
        acc.push({
          id: group.groupInfo.groupId,
          name: group.groupInfo.groupName,
          deposit: group.deposits[0],
          selectable: true,
          level: 0,
        });
        acc.push(
          ...group.teams.map(team => ({
            id: team.teamInfo.teamId,
            name: team.teamInfo.teamName,
            deposit: team.deposits[0],
            selectable: true,
            level: 1,
          })),
        );
        return acc;
      }, []),
    );
    if (hierarchy.ungrouped.length > 0) {
      hierarchyList.push(
        {
          id: 'Ungrouped',
          name: 'Remaining Teams',
          deposit: hierarchy.remainingTeamsTotal,
          level: 0,
          selectable: true,
        },
        ...hierarchy.ungrouped.map(team => ({
          id: team.teamInfo.teamId,
          name: team.teamInfo.teamName,
          deposit: team.deposits[0],
          isUngrouped: true,
          level: 1,
          selectable: true,
        })),
      );
    }

    return fakeItemsFactory(hierarchyList, isLoading, id => ({ id: String(id) } as TRowData));
  }, [hierarchy, isLoading]);
  const isTableEmpty = !isLoading && rows.length === 0;

  /* eslint-disable react/prop-types */
  const [columns] = useState<IColumn<TRowData>[]>([
    {
      id: 'name',
      name: 'Group/Team',
      hideSorting: true,
      render: ({ id, name, level }) => (
        <>
          {level !== 0 && <span className={classes.indent} />}
          <span data-testid={`DepositLedger.Hierarchy.Name.${id}`}>
            <TableCellTooltip title={<>{name}</>} />
          </span>
        </>
      ),
    },
    {
      id: 'deposit',
      name: 'Remaining Deposit',
      hideSorting: true,
      render: ({ id, deposit, level, isUngrouped }) => (
        <span data-testid={`DepositLedger.Hierarchy.Deposit.${id}`}>
          {(level === 0 || isUngrouped) && (
            <TableCellTooltip title={<NumberFormat format="$0,0.00">{deposit.money.amount}</NumberFormat>} />
          )}
        </span>
      ),
    },
  ]);

  /* eslint-enable react/prop-types */

  return (
    <Paper elevation={2}>
      <Box pt={1} pr={1} pb={1} pl={1}>
        <Table className={classes.table}>
          <colgroup>
            <col />
            <col className={classes.colMoney} />
          </colgroup>
          <TableHead>
            <TableHeadRow columns={columns} />
          </TableHead>
          <TableBody>
            {isTableEmpty ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  <Typography className="H3-Dark">Nothing to show</Typography>
                </TableCell>
              </TableRow>
            ) : (
              rows.map(row => (
                <TableDataRow
                  columns={columns}
                  data={row}
                  onClick={handleSelect}
                  isSelected={row.id === selected.id}
                  isLoading={isLoading}
                  key={row.id}
                  className={row.selectable ? classes.row : ''}
                />
              ))
            )}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

export default memo(OrgHierarchy);
