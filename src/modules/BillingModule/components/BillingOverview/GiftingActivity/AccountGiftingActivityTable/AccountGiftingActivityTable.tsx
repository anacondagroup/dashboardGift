import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useSelector } from 'react-redux';
import { EntityId } from '@reduxjs/toolkit';

import { StyledHeaderCell, StyledTableHeader } from '../../../styled/Styled';
import { GroupRow } from '../Rows';
import { getOrg } from '../../../../store/customerOrg';
import { useGetGiftingActivityByGroup } from '../../../../hooks/useGetGiftingActivityByGroup';
import { GroupsTeamsConstants } from '../../../../constants/groupsTeams.constants';
import { PurchasedGiftCell } from '../Cells';

const styles = {
  table: {
    tableLayout: 'fixed',
    mt: 3,
  },
} as const;

const AccountGiftingActivityTable = (): JSX.Element => {
  const { id: orgId, isLoading: isOrgInfoLoading } = useSelector(getOrg);

  const { entities, ids, isFetching } = useGetGiftingActivityByGroup(orgId);

  const isLoading = isOrgInfoLoading || isFetching;

  const rowIds = useMemo(() => (isLoading ? Array.from({ length: 5 }, (_, idx) => idx) : ids) as EntityId[], [
    ids,
    isLoading,
  ]);

  return (
    <Table sx={styles.table}>
      <StyledTableHeader>
        <TableRow>
          <StyledHeaderCell width="30%">Group/Team</StyledHeaderCell>
          <StyledHeaderCell align="right">Ending balance</StyledHeaderCell>
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
        {rowIds.map(id => {
          const group = entities[id];

          const isUngrouped = group?.groupId === GroupsTeamsConstants.Ungrouped;
          const isRowVisible = !isUngrouped || (isUngrouped && Boolean(group?.teams.length));
          const isExpandedByDefault = !isFetching && rowIds.length === 1;

          return (
            isRowVisible && (
              <GroupRow key={id} group={group} isLoading={isLoading} isExpandedByDefault={isExpandedByDefault} />
            )
          );
        })}
      </TableBody>
    </Table>
  );
};

export default memo(AccountGiftingActivityTable);
