import React, { useCallback, memo } from 'react';
import {
  AutoSizer,
  Column,
  Index,
  InfiniteLoader,
  SortDirection,
  SortDirectionType,
  TableCellProps,
  TableHeaderProps,
} from 'react-virtualized';
import { Box, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useDispatch, useSelector } from 'react-redux';
import { AlyceTheme, Icon, VirtualizedTable } from '@alycecom/ui';

import {
  getContactsIds,
  getContactsMap,
  getContactsPagination,
  getContactsSortDirection,
  getContactsSortField,
  getTotalContacts,
  setContactsFilters,
} from '../../../store/steps/recipients/contacts';
import { IContact } from '../../../store/steps/recipients/contacts/contacts.types';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  table: {
    margin: spacing(4, 0, 0, 0),
    '& .ReactVirtualized__Table__row': {
      borderBottom: `1px solid ${palette.divider}`,
    },
    '& .ReactVirtualized__Table__headerColumn': {
      display: 'flex',
    },
    '& .ReactVirtualized__Table__Grid': {
      paddingTop: 0,
    },
  },
}));

interface IContactsTableProps {
  onLoadMore: () => void;
}

const ContactsTable = ({ onLoadMore }: IContactsTableProps): JSX.Element => {
  const dispatch = useDispatch();
  const classes = useStyles();

  const sortField = useSelector(getContactsSortField);
  const direction = useSelector(getContactsSortDirection);

  const contactsMap = useSelector(getContactsMap);
  const contactsIds = useSelector(getContactsIds);
  const total = useSelector(getTotalContacts) || 0;
  const { limit } = useSelector(getContactsPagination);

  const getRowItem = ({ index }: Index) => contactsMap[contactsIds[index]] || {};
  const getIsRowLoaded = (index: Index) => typeof getRowItem(index).id !== 'undefined';

  const loadMoreRows = useCallback(() => {
    onLoadMore();
    return Promise.resolve();
  }, [onLoadMore]);

  const handleSort = useCallback(
    ({ sortBy, sortDirection }: { sortBy: keyof IContact; sortDirection: SortDirectionType }) => {
      dispatch(setContactsFilters({ sortField: sortBy, sortDirection }));
    },
    [dispatch],
  );

  const renderHeader = ({ label, dataKey, disableSort, sortBy, sortDirection }: TableHeaderProps) => {
    const isSorted = sortBy === dataKey;
    const isUp = sortDirection === SortDirection.ASC;
    const sortIcon = <Icon color="grey.timberWolfDark" icon={isUp ? 'sort-up' : 'sort-down'} />;

    return (
      <>
        {label}
        {!disableSort && <Box pl={0.5}>{isSorted ? sortIcon : <Icon color="grey.timberWolf" icon="sort" />}</Box>}
      </>
    );
  };

  const renderColumn = ({ rowIndex: index, cellData }: TableCellProps) => {
    const isRowLoaded = getIsRowLoaded({ index });

    return (
      <Box display="flex" alignItems="center" width={1}>
        {isRowLoaded && <Typography>{cellData}</Typography>}
        {!isRowLoaded && <Skeleton width="100%" />}
      </Box>
    );
  };

  return (
    <Box mb={3}>
      <InfiniteLoader
        isRowLoaded={getIsRowLoaded}
        loadMoreRows={loadMoreRows}
        rowCount={total}
        minimumBatchSize={limit}
      >
        {({ onRowsRendered }) => (
          <AutoSizer style={{ width: '100%' }} disableHeight>
            {({ width }) => (
              <VirtualizedTable
                className={classes.table}
                rowHeight={46}
                onRowsRendered={onRowsRendered}
                rowCount={total}
                width={width}
                rowGetter={getRowItem}
                sort={handleSort}
                sortBy={sortField}
                sortDirection={direction}
                disableShadows
                maxVisibleRows={10}
              >
                <Column
                  headerRenderer={renderHeader}
                  width={width / 4}
                  label="First Name"
                  dataKey="firstName"
                  cellRenderer={renderColumn}
                />
                <Column
                  headerRenderer={renderHeader}
                  width={width / 4}
                  label="Last Name"
                  dataKey="lastName"
                  cellRenderer={renderColumn}
                />
                <Column
                  headerRenderer={renderHeader}
                  width={width / 4}
                  label="Email"
                  dataKey="email"
                  cellRenderer={renderColumn}
                />
                <Column
                  headerRenderer={renderHeader}
                  width={width / 4}
                  label="Company"
                  dataKey="company"
                  cellRenderer={renderColumn}
                />
              </VirtualizedTable>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </Box>
  );
};

export default memo(ContactsTable);
