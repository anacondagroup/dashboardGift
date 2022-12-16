import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { fakeItemsFactory } from '@alycecom/utils';

import { getGroupId, getSorting } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { StyledTableHeader } from '../../../styled/Styled';
import { TeamRow } from '../Rows';
import { useGetGiftingActivityByGroup } from '../../../../hooks/useGetGiftingActivityByGroup';
import { UngroupedTeamsOption } from '../../../../store/customerOrg/customerOrg.constants';
import { PurchasedGiftCell, SortingHeaderCell } from '../Cells';
import NoDataPlaceholder from '../NoDataPlaceholder/NoDataPlaceholder';
import { TGiftingActivityTeamNode } from '../../../../types';
import { DEFAULT_FAKE_TEAM } from '../../../../constants/billing.constants';
import { makeSortByColumn } from '../../../../helpers/billingGroupForm.helpers';

const styles = {
  root: {
    mt: 3,
    width: '100%',
  },
  table: {
    tableLayout: 'fixed',
    mt: 3,
  },
} as const;

const GroupGiftingActivityTable = (): JSX.Element => {
  const groupId = useSelector(getGroupId);
  const sorting = useSelector(getSorting);

  const { items, isFetching } = useGetGiftingActivityByGroup(groupId);

  const group = useMemo(() => items.find(item => item.groupId === groupId), [items, groupId]);
  const hasData = Boolean(group?.teams?.length);

  const isTableEmpty = !isFetching && !hasData;

  const isRemainingGroup = group?.groupId === UngroupedTeamsOption.id;

  const rows = useMemo(() => {
    const teams = group?.teams ?? [];

    if (!isFetching) {
      const sortByColumn = makeSortByColumn<TGiftingActivityTeamNode>({
        column: sorting.column === 'groupName' ? 'teamName' : sorting.column,
        direction: sorting.direction,
      });
      return sortByColumn(teams);
    }

    return fakeItemsFactory<TGiftingActivityTeamNode>(
      teams,
      isFetching,
      id => ({ ...DEFAULT_FAKE_TEAM, teamId: id }),
      5,
    );
  }, [group, isFetching, sorting]);

  return (
    <>
      <Table sx={styles.table}>
        <StyledTableHeader>
          <TableRow>
            <SortingHeaderCell name="groupName" width="30%">
              Team
            </SortingHeaderCell>
            {isRemainingGroup && (
              <SortingHeaderCell name="amountAtTheEnd" align="right">
                Ending balance
              </SortingHeaderCell>
            )}
            <SortingHeaderCell name="sentCount" width={200} align="right">
              Sent
            </SortingHeaderCell>
            <SortingHeaderCell name="claimedCount" width={200} align="right">
              Accepted
            </SortingHeaderCell>
            <PurchasedGiftCell />
            <SortingHeaderCell name="amountSpent" align="right" width={200}>
              Spent
            </SortingHeaderCell>
          </TableRow>
        </StyledTableHeader>
        <TableBody>
          {rows.map(row => (
            <TeamRow key={row.teamId} team={row} isLoading={isFetching} hasBalanceColumn={isRemainingGroup} />
          ))}
        </TableBody>
      </Table>
      {isTableEmpty && <NoDataPlaceholder />}
    </>
  );
};

export default memo(GroupGiftingActivityTable);
