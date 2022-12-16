import React, { memo, useMemo } from 'react';
import { Table, TableBody, TableRow } from '@mui/material';
import { useGetOrganizationQuery, GroupsTeamsIdentifier } from '@alycecom/services';
import { fakeItemsFactory } from '@alycecom/utils';
import { useSelector } from 'react-redux';

import { StyledTableHeader } from '../../../styled/Styled';
import { GroupRow } from '../Rows';
import { useGetGiftingActivityByGroup } from '../../../../hooks/useGetGiftingActivityByGroup';
import { PurchasedGiftCell, SortingHeaderCell } from '../Cells';
import { TGiftingActivityGroupNode } from '../../../../types';
import { DEFAULT_FAKE_GROUP } from '../../../../constants/billing.constants';
import { getSorting } from '../../../../store/ui/overviewFilters/overviewFilters.selectors';
import { makeSortByColumn } from '../../../../helpers/billingGroupForm.helpers';

const styles = {
  table: {
    tableLayout: 'fixed',
    mt: 3,
  },
} as const;

const AccountGiftingActivityTable = (): JSX.Element => {
  const sorting = useSelector(getSorting);

  const { data: organization, isFetching: isOrganizationFetching } = useGetOrganizationQuery();

  const { items: groups, isFetching } = useGetGiftingActivityByGroup(organization?.id);

  const isLoading = isOrganizationFetching || isFetching;

  const rows = useMemo(() => {
    if (!isFetching) {
      const sortByColumn = makeSortByColumn<TGiftingActivityGroupNode>(sorting);
      return sortByColumn(groups);
    }

    return fakeItemsFactory<TGiftingActivityGroupNode>(
      groups,
      isFetching,
      id => ({ ...DEFAULT_FAKE_GROUP, groupId: String(id) }),
      5,
    );
  }, [groups, isFetching, sorting]);

  return (
    <Table sx={styles.table}>
      <StyledTableHeader>
        <TableRow>
          <SortingHeaderCell name="groupName" width="30%">
            Group/Team
          </SortingHeaderCell>
          <SortingHeaderCell name="amountAtTheEnd" align="right">
            Ending balance
          </SortingHeaderCell>
          <SortingHeaderCell name="sentCount" width={200} align="right">
            Sent
          </SortingHeaderCell>
          <SortingHeaderCell name="claimedCount" width={200} align="right">
            Accepted
          </SortingHeaderCell>
          <PurchasedGiftCell />
          <SortingHeaderCell name="amountSpent" width={200} align="right">
            Spent
          </SortingHeaderCell>
        </TableRow>
      </StyledTableHeader>
      <TableBody>
        {rows.map(group => {
          const isUngrouped = group?.groupId === GroupsTeamsIdentifier.Ungrouped;
          const isRowVisible = !isUngrouped || (isUngrouped && Boolean(group?.teams.length));
          const isExpandedByDefault = !isLoading && rows.length === 1;

          return (
            isRowVisible && (
              <GroupRow
                key={group?.groupId}
                group={group}
                isLoading={isLoading}
                isExpandedByDefault={isExpandedByDefault}
              />
            )
          );
        })}
      </TableBody>
    </Table>
  );
};

export default memo(AccountGiftingActivityTable);
