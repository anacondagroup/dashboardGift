import React, { useCallback, useMemo } from 'react';
import { Control, UseFormTrigger } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { VirtualizedTable } from '@alycecom/ui';
import { AutoSizer, Column, Index, SortDirection, WindowScroller } from 'react-virtualized';
import { Box, Theme } from '@mui/material';
import { EntityId } from '@alycecom/utils';
import { SortDirectionType } from 'react-virtualized/dist/es/Table';

import {
  getAllFilteredGiftLimits,
  getGiftLimitsFilters,
  getTotalGiftLimits,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.selectors';
import {
  TGiftLimitsFilters,
  TGiftLimitsForm,
  TGiftLimitsSortBy,
  TProspectingCampaignMember,
  TUpdateRemainingGiftLimitsRequest,
} from '../../../../store/prospectingCampaign/steps/giftLimits/giftLimits.types';

import FirstNameCell from './cells/FirstNameCell';
import LimitFieldCell from './cells/LimitFieldCell';
import PeriodFieldCell from './cells/PeriodFieldCell';
import RowCheckboxCell from './cells/RowCheckboxCell';
import RowHeaderCheckboxCell from './cells/RowHeaderCheckboxCell';
import RemainingFieldCell from './cells/RemainingFieldCell';
import RowSortableHeader, { ALPHA_ICON_SET, NUMERIC_ICON_SET } from './cells/RowSortableHeader';

export interface IGiftLimitsTableControllerProps {
  control: Control<TGiftLimitsForm>;
  trigger: UseFormTrigger<TGiftLimitsForm>;
  isAllChecked: boolean | null;
  setIsAllChecked: (checked: boolean) => void;
  getIsUserIdChecked: (id: EntityId) => boolean;
  setIsUserIdChecked: (id: EntityId, checked: boolean) => void;
  selectedCount: number;
  onSetRemaining?: (value: TUpdateRemainingGiftLimitsRequest) => void;
  onSort?: (sort: TGiftLimitsFilters['sort']) => void;
  loading?: boolean;
}

const calcWidth = (maxWidth: number) => {
  let remainingWidth = maxWidth;

  return (colsOrMaxWidth?: number, width?: number) => {
    if (!colsOrMaxWidth) {
      return remainingWidth;
    }
    const resWidth = width ? Math.max((maxWidth / 12) * colsOrMaxWidth, width) : colsOrMaxWidth;
    remainingWidth -= resWidth;
    return resWidth;
  };
};

const styles = {
  table: {
    margin: ({ spacing }: Theme) => spacing(2.5, 0, 0, 0),
    '& .ReactVirtualized__Table__Grid': {
      paddingTop: 0,
    },
    '& .ReactVirtualized__Table__headerColumn': {
      padding: ({ spacing }: Theme) => spacing(0, 1),
    },
    '& .ReactVirtualized__Table__headerRow': {
      padding: 0,
    },
    '& .ReactVirtualized__Table__row ': {
      padding: 0,
      border: 'none',
    },
    '& .ReactVirtualized__Table__rowColumn': {
      justifyContent: 'flex-start',
      padding: ({ spacing }: Theme) => spacing(0.75, 1),
      margin: 0,
      borderBottom: ({ palette }: Theme) => `1px solid ${palette.divider}`,
    },
    '& .ReactVirtualized__Table__rowColumn[aria-colindex="1"]': {
      borderBottom: 'none',
    },
  },
  selectedCountCellHeader: {
    fontWeight: 700,
    color: ({ palette }: Theme) => palette.text.primary,
    textTransform: 'none',
    fontSize: '0.875rem',
  },
} as const;

const GiftLimitsTableController = ({
  control,
  trigger,
  getIsUserIdChecked,
  setIsUserIdChecked,
  isAllChecked,
  setIsAllChecked,
  selectedCount,
  onSetRemaining,
  onSort,
  loading = false,
}: IGiftLimitsTableControllerProps): JSX.Element => {
  const total = useSelector(getTotalGiftLimits);
  const allPossibleGiftLimits = useSelector(getAllFilteredGiftLimits);
  const filters = useSelector(getGiftLimitsFilters);
  const rowCount = loading ? total || 10 : allPossibleGiftLimits.length;

  const columnData = useMemo(() => ({ control, trigger }), [control, trigger]);

  const handleRowCheckboxChange = useCallback(
    (rowData: TProspectingCampaignMember, checked: boolean) => {
      setIsUserIdChecked(rowData.userId, checked);
    },
    [setIsUserIdChecked],
  );
  const getRowDataByIdx = (idx: Index) => (loading ? {} : allPossibleGiftLimits[idx.index] ?? {});

  const handleChangeSort = useCallback(
    (sort: { sortBy: TGiftLimitsSortBy; sortDirection: SortDirectionType }) => {
      if (!onSort) {
        return;
      }
      const isResetSort =
        sort.sortDirection === SortDirection.ASC &&
        filters.sort?.dir === SortDirection.DESC &&
        filters.sort?.by === sort.sortBy;
      if (isResetSort) {
        onSort({});
        return;
      }
      onSort({ by: sort.sortBy, dir: sort.sortDirection });
    },
    [filters, onSort],
  );

  return (
    <WindowScroller>
      {({ height, registerChild, scrollTop }) => (
        <div ref={el => registerChild(el)}>
          <AutoSizer disableHeight style={{ width: '100%' }}>
            {({ width }) => {
              const reserveWidth = calcWidth(width);
              return (
                <VirtualizedTable
                  sx={styles.table}
                  autoHeight
                  height={height}
                  width={width}
                  scrollTop={scrollTop}
                  rowHeight={57}
                  rowCount={rowCount}
                  rowGetter={getRowDataByIdx}
                  sort={onSort ? handleChangeSort : undefined}
                  sortBy={filters.sort?.by}
                  sortDirection={filters.sort?.dir}
                  disableShadows
                >
                  <Column
                    width={reserveWidth(36)}
                    dataKey="userId"
                    disableSort
                    headerRenderer={props => (
                      <RowHeaderCheckboxCell
                        {...props}
                        checked={!!isAllChecked}
                        indeterminate={isAllChecked === null}
                        onChange={setIsAllChecked}
                        disabled={loading}
                      />
                    )}
                    cellRenderer={props => (
                      <RowCheckboxCell
                        {...props}
                        checked={!!isAllChecked || getIsUserIdChecked(props.cellData)}
                        onChange={handleRowCheckboxChange}
                      />
                    )}
                  />
                  <Column
                    width={reserveWidth(3, 252)}
                    label="Name"
                    dataKey="firstName"
                    headerRenderer={({ label, ...props }) => (
                      <RowSortableHeader
                        iconSet={ALPHA_ICON_SET}
                        label={
                          selectedCount > 0 ? (
                            <Box sx={styles.selectedCountCellHeader}>{selectedCount} Selected</Box>
                          ) : (
                            label
                          )
                        }
                        {...props}
                      />
                    )}
                    cellRenderer={props => <FirstNameCell {...props} />}
                  />
                  <Column
                    width={reserveWidth(1.1, 110)}
                    label="Gift Invites"
                    dataKey="limit"
                    columnData={columnData}
                    cellRenderer={props => <LimitFieldCell {...props} />}
                    headerRenderer={props => <RowSortableHeader iconSet={NUMERIC_ICON_SET} {...props} />}
                  />
                  <Column
                    width={reserveWidth(52)}
                    label=""
                    dataKey="userId"
                    disableSort
                    cellRenderer={() => <Box color="grey.main">that</Box>}
                  />
                  <Column
                    width={reserveWidth(2, 184)}
                    label="Reset Rate"
                    dataKey="period"
                    columnData={columnData}
                    cellRenderer={props => <PeriodFieldCell {...props} />}
                    headerRenderer={props => <RowSortableHeader {...props} />}
                  />
                  <Column
                    width={reserveWidth()}
                    label={onSetRemaining ? 'Remaining' : ''}
                    dataKey="remaining"
                    columnData={columnData}
                    cellRenderer={props =>
                      onSetRemaining ? <RemainingFieldCell onSave={onSetRemaining} {...props} /> : <></>
                    }
                    headerRenderer={props =>
                      onSetRemaining ? <RowSortableHeader iconSet={NUMERIC_ICON_SET} {...props} /> : <></>
                    }
                  />
                </VirtualizedTable>
              );
            }}
          </AutoSizer>
        </div>
      )}
    </WindowScroller>
  );
};

export default GiftLimitsTableController;
