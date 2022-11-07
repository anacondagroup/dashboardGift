import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, SearchField, VirtualizedTable } from '@alycecom/ui';
import { useDebouncedValue } from '@alycecom/hooks';
import { AutoSizer, Column, SortDirection, SortDirectionType } from 'react-virtualized';
import { ascend, descend, pipe, prop, sort, toLower, without } from 'ramda';
import { Box, BoxProps, Checkbox, Grid, MenuItem, Select, SelectChangeEvent, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';

import { fetchProductVendors } from '../../../store/entities/productVendors/productVendors.actions';
import {
  getVendors,
  getVendorsIds,
  getVendorsMap,
} from '../../../store/entities/productVendors/productVendors.selectors';
import { ProductVendorsTypes, TProductVendor } from '../../../store/entities/productVendors/productVendors.types';
import { getVendorId } from '../../../store/entities/productVendors/productVendors.reducer';
import { fetchTeamSettings } from '../../../store/teamSettings/teamSettings.actions';
import {
  getPermittedBrandIds,
  getPermittedMerchantIds,
  getIsLoaded as getIsTeamSettingsLoaded,
  getIsLoading as getIsTeamSettingsLoading,
  getRestrictedBrandIds,
  getRestrictedMerchantIds,
} from '../../../store/teamSettings/teamSettings.selectors';

const useStyles = makeStyles(({ spacing, palette }) => ({
  table: {
    margin: `${spacing(0)} !important`,
    padding: `${spacing(0, -3)} !important`,
    '& .ReactVirtualized__Table__headerColumn': {
      padding: spacing(0, 0, 0, 0),
      display: 'flex',
      alignItems: 'center',
      outline: 'none',
      cursor: 'pointer',
    },
    '& .ReactVirtualized__Table__row': {
      padding: 0,
      borderBottom: `1px solid ${palette.text.disabled}`,
    },
    '& .ReactVirtualized__Table__headerRow': {
      padding: 0,
    },
    '& .ReactVirtualized__Table__rowColumn': {
      margin: spacing(0.5, 0),
      padding: 0,
      display: 'flex',
      justifyContent: 'start',
    },
  },
}));

export enum VendorStatusFilter {
  All = 'all',
  Restricted = 'restricted',
  Allowed = 'allowed',
}

export type TProductVendorsRestrictionFormValue = { brandIds?: number[]; merchantIds?: number[] };

export interface IProductVendorsRestrictionFormProps extends Omit<BoxProps, 'onChange'> {
  teamId?: number;
  value: TProductVendorsRestrictionFormValue;
  onChange: (value: TProductVendorsRestrictionFormValue) => void;
}

const ProductVendorsRestrictionForm = ({
  teamId,
  value,
  onChange,
  ...rootProps
}: IProductVendorsRestrictionFormProps): JSX.Element => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(VendorStatusFilter.All);
  const [sortDir, setSortDir] = useState<undefined | SortDirectionType>(undefined);
  const filters = useMemo(() => ({ search, filter, sortDir }), [search, filter, sortDir]);
  const [debouncedFilters, getIsDebounceReady] = useDebouncedValue(filters, 500);
  const isLoading = getIsDebounceReady() === false;
  const disabledBrandIds = useSelector(getRestrictedBrandIds);
  const disabledMerchantIds = useSelector(getRestrictedMerchantIds);

  const vendors = useSelector(getVendors);
  const vendorsMap = useSelector(getVendorsMap);
  const vendorIds = useSelector(getVendorsIds);
  const isTeamSettingsLoaded = useSelector(getIsTeamSettingsLoaded);
  const isTeamSettingsLoading = useSelector(getIsTeamSettingsLoading);
  const brandIds = useSelector(getPermittedBrandIds);
  const merchantIds = useSelector(getPermittedMerchantIds);

  const restrictedTotal = (value.brandIds?.length ?? 0) + (value.merchantIds?.length ?? 0);
  const permittedTotal = vendorIds.length - restrictedTotal;

  useEffect(() => {
    if (teamId && !isTeamSettingsLoaded && !isTeamSettingsLoading) {
      dispatch(fetchTeamSettings({ teamId }));
    }
  }, [dispatch, teamId, isTeamSettingsLoaded, isTeamSettingsLoading]);

  useEffect(() => {
    if (teamId) {
      dispatch(fetchProductVendors({ teamIds: [teamId] }));
    }
  }, [teamId, dispatch]);

  const getIsVendorRestricted = useCallback(
    (vendor: TProductVendor) => {
      if (vendor.type === ProductVendorsTypes.Merchant) {
        return value?.merchantIds?.includes(vendor.id) ?? false;
      }

      return value?.brandIds?.includes(vendor.id) ?? false;
    },
    [value],
  );

  const getIsVendorDisabled = useCallback(
    (vendor: TProductVendor) => {
      if (vendor.type === ProductVendorsTypes.Merchant) {
        return disabledMerchantIds.includes(vendor.id) ?? false;
      }

      return disabledBrandIds.includes(vendor.id) ?? false;
    },
    [disabledMerchantIds, disabledBrandIds],
  );

  const handleSetSorting = useCallback(({ sortDirection }: { sortDirection: SortDirectionType }) => {
    setSortDir(curSortDir =>
      curSortDir === SortDirection.ASC && sortDirection === SortDirection.DESC ? undefined : sortDirection,
    );
  }, []);

  const filteredVendorIds = useMemo(() => {
    let result = vendors;
    if (debouncedFilters.sortDir) {
      const sortFn = debouncedFilters.sortDir === SortDirection.ASC ? ascend : descend;
      result = sort(sortFn(pipe(prop('label'), toLower)), result);
    }

    return result.reduce((ids, vendor) => {
      const isRestricted = debouncedFilters.filter === 'all' ? false : getIsVendorRestricted(vendor);
      if (
        (!debouncedFilters.search || vendor.label.toLowerCase().includes(debouncedFilters.search.toLowerCase())) &&
        (debouncedFilters.filter === VendorStatusFilter.All ||
          (debouncedFilters.filter === VendorStatusFilter.Restricted &&
            (isRestricted || getIsVendorDisabled(vendor))) ||
          (debouncedFilters.filter === VendorStatusFilter.Allowed && !isRestricted && !getIsVendorDisabled(vendor)))
      ) {
        ids.push(getVendorId(vendor));
      }

      return ids;
    }, [] as string[]);
  }, [debouncedFilters, vendors, getIsVendorRestricted, getIsVendorDisabled]);

  const rowGetter = useCallback(
    ({ index }: { index: number }) => (isLoading ? {} : vendorsMap[filteredVendorIds[index]]),
    [filteredVendorIds, isLoading, vendorsMap],
  );

  const setIsVendorRestricted = useCallback(
    (vendor, isRestrict) => {
      const changedProp = vendor.type === ProductVendorsTypes.Merchant ? 'merchantIds' : 'brandIds';

      onChange({
        ...value,
        [changedProp]: isRestrict
          ? [...(value?.[changedProp] ?? []), vendor.id]
          : without([vendor.id], value?.[changedProp] ?? []),
      });
    },
    [value, onChange],
  );

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value.trimLeft());
  }, []);

  const handleFilterChange = useCallback((event: SelectChangeEvent) => {
    setFilter(event.target.value as VendorStatusFilter);
  }, []);

  const renderHeaderCheckbox = useCallback(
    () => (
      <Box>
        <Checkbox
          color="primary"
          disabled={isLoading}
          indeterminate={restrictedTotal !== vendorIds.length && restrictedTotal !== 0}
          checked={restrictedTotal === 0}
          onChange={(event, isChecked) => {
            onChange({
              brandIds: isChecked ? [] : brandIds,
              merchantIds: isChecked ? [] : merchantIds,
            });
          }}
        />
      </Box>
    ),
    [restrictedTotal, brandIds, merchantIds, vendorIds, onChange, isLoading],
  );

  const renderHeaderWithSort = useCallback(({ label, sortDirection }) => {
    const isSorted = sortDirection !== undefined;
    const iconName = sortDirection === SortDirection.ASC ? 'sort-alpha-down' : 'sort-alpha-up';
    return (
      <>
        {label}
        <Box pl={0.5}>
          <Icon icon={isSorted ? iconName : 'sort-alt'} color="grey.timberWolfDark" />
        </Box>
      </>
    );
  }, []);

  const renderCheckbox = useCallback(
    ({ rowData }) => {
      const isDisabled = getIsVendorDisabled(rowData);
      const isChecked = !getIsVendorRestricted(rowData);

      return (
        <Box height={1} display="flex" alignItems="center">
          <Checkbox
            color="primary"
            disabled={isLoading || isDisabled}
            icon={isDisabled ? <Icon icon="lock" /> : undefined}
            checked={!isLoading && isChecked && !isDisabled}
            onChange={(event, checked) => {
              setIsVendorRestricted(rowData, !checked);
            }}
          />
        </Box>
      );
    },
    [getIsVendorRestricted, setIsVendorRestricted, getIsVendorDisabled, isLoading],
  );

  const renderName = useCallback(
    ({ cellData, rowIndex }) => (
      <Box height={1} display="flex" alignItems="center">
        {isLoading ? <Skeleton variant="text" width={rowIndex % 2 === 0 ? 200 : 125} /> : cellData}
      </Box>
    ),
    [isLoading],
  );

  return (
    <Box {...rootProps}>
      <Grid container spacing={2}>
        <Grid item xs={8}>
          <SearchField value={search} onChange={handleSearchChange} placeholder="Search gift vendors" />
        </Grid>
        <Grid item xs={4}>
          <Select variant="outlined" value={filter} onChange={handleFilterChange} fullWidth>
            <MenuItem value={VendorStatusFilter.All}>View all vendors ({vendorIds.length})</MenuItem>
            <MenuItem value={VendorStatusFilter.Allowed}>View only allowed vendors ({permittedTotal})</MenuItem>
            <MenuItem value={VendorStatusFilter.Restricted}>View only restricted vendors ({restrictedTotal})</MenuItem>
          </Select>
        </Grid>
      </Grid>
      <Box mt={3}>
        <AutoSizer style={{ width: '100%' }} disableHeight>
          {({ width }) => (
            <VirtualizedTable
              width={width}
              maxVisibleRows={7.5}
              headerHeight={45}
              rowHeight={56}
              rowCount={isLoading ? 10 : filteredVendorIds.length}
              rowGetter={rowGetter}
              sort={handleSetSorting}
              sortBy="label"
              sortDirection={sortDir}
              className={classes.table}
            >
              <Column
                dataKey="id"
                width={46}
                headerRenderer={renderHeaderCheckbox}
                cellRenderer={renderCheckbox}
                disableSort
              />
              <Column
                label="VENDOR"
                dataKey="label"
                width={width}
                headerRenderer={renderHeaderWithSort}
                cellRenderer={renderName}
              />
            </VirtualizedTable>
          )}
        </AutoSizer>
      </Box>
    </Box>
  );
};

export default memo(ProductVendorsRestrictionForm);
