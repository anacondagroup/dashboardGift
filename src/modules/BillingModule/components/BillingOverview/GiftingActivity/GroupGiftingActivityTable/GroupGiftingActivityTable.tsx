import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { fakeItemsFactory } from '@alycecom/utils';

import { getGroupId } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { StyledHeaderCell, StyledTableHeader } from '../../../styled/Styled';
import { TeamRow } from '../Rows';
import { useGetGiftingActivityByGroup } from '../../../../hooks/useGetGiftingActivityByGroup';
import { UngroupedTeamsOption } from '../../../../store/customerOrg/customerOrg.constants';
import { PurchasedGiftCell } from '../Cells';
import NoDataPlaceholder from '../NoDataPlaceholder/NoDataPlaceholder';
import { TGiftingActivityTeamNode } from '../../../../types';
import { DEFAULT_FAKE_TEAM } from '../../../../constants/billing.constants';

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

  const { entities, isFetching } = useGetGiftingActivityByGroup(groupId);

  const group = entities[groupId];
  const hasData = Boolean(group?.teams?.length);

  const isTableEmpty = !isFetching && !hasData;

  const isRemainingGroup = group?.groupId === UngroupedTeamsOption.id;

  const rows = useMemo(
    () =>
      fakeItemsFactory<TGiftingActivityTeamNode>(
        group?.teams ?? [],
        isFetching,
        id => ({ ...DEFAULT_FAKE_TEAM, teamId: id }),
        5,
      ),
    [group, isFetching],
  );

  return (
    <>
      <Table sx={styles.table}>
        <StyledTableHeader>
          <TableRow>
            <StyledHeaderCell width="30%">Group/Team</StyledHeaderCell>
            {isRemainingGroup && <StyledHeaderCell align="right">Ending balance</StyledHeaderCell>}
            <StyledHeaderCell width={200} align="right">
              Sent
            </StyledHeaderCell>
            <StyledHeaderCell width={200} align="right">
              Accepted
            </StyledHeaderCell>
            <PurchasedGiftCell />
            <StyledHeaderCell align="right">Spent</StyledHeaderCell>
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
