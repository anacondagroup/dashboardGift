import React, { useMemo, useCallback, useReducer, useEffect, memo } from 'react';
import { EntityId } from '@alycecom/utils';
import { Box, FormControlLabel, Radio, Typography, RadioGroup, Collapse, Checkbox, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, SearchField, SelectFilter, VirtualizedTable, Icon } from '@alycecom/ui';
import { Column } from 'react-virtualized';
import { useSelector } from 'react-redux';
import numeral from 'numeral';

import { IGiftVendor, VendorTypes } from '../../../store/entities/giftVendors/giftVendors.types';
import { FilterKeys, VendorsOptions } from '../../../constants/marketplaceSidebar.constants';
import {
  getGiftVendors,
  getRestrictedByTeamAmount,
  getRestrictedByTeamBrandIds,
  getRestrictedByTeamMerchantIds,
} from '../../../store/entities/giftVendors/giftVendors.selectors';
import { getVendorKey } from '../../../store/entities/giftVendors/giftVendors.helpers';
import { IRestrictedVendors } from '../../../store/steps/gift/gift.types';

import { getVendorItems, unionVendorsRestriction } from './store/allowedVendors.helpers';
import { allowedVendors, initialState } from './store/allowedVendors.reducer';
import { setFilter, setSearch, setSorting, setVendorsOption } from './store/allowedVendors.actions';

export interface IGiftTypesProps {
  value: IRestrictedVendors;
  onChange: (value: IRestrictedVendors) => void;
}

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
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
  restrictIcon: {
    marginLeft: spacing(1 / 2),
  },
}));

const ActivateAllowedVendors = ({
  value = {
    restrictedBrandIds: [],
    restrictedMerchantIds: [],
  },
  onChange,
}: IGiftTypesProps): JSX.Element => {
  const classes = useStyles();

  const items = useSelector(getGiftVendors);
  const restrictedByTeamAmount = useSelector(getRestrictedByTeamAmount);
  const restrictedByTeamBrandIds = useSelector(getRestrictedByTeamBrandIds);
  const restrictedByTeamMerchantIds = useSelector(getRestrictedByTeamMerchantIds);

  const restrictedItems = useMemo(() => unionVendorsRestriction(value), [value]);
  const restrictedAmount = useMemo(() => Object.keys(restrictedItems).length, [restrictedItems]);

  const [state, uiDispatch] = useReducer(allowedVendors, initialState);

  const { search, filter, sortDirection, vendorsOption } = state;

  const isRestrictedVendors = vendorsOption === VendorsOptions.restricted;

  const vendorItems = useMemo(
    () => getVendorItems({ search, filter, sortDirection, restricted: restrictedItems })(items),
    [items, filter, sortDirection, restrictedItems, search],
  );

  const filters = useMemo(
    () => [
      {
        value: FilterKeys.all,
        label: `View all vendors (${numeral(items.length).format('0,0')})`,
      },
      {
        value: FilterKeys.allowed,
        label: `View only allowed vendors (${numeral(items.length - restrictedAmount).format('0,0')})`,
      },
      {
        value: FilterKeys.restricted,
        label: `View only restricted vendors (${numeral(restrictedAmount).format('0,0')})`,
      },
    ],
    [items, restrictedAmount],
  );

  const handleSelectOption = useCallback(
    ({ target }) => {
      uiDispatch(setVendorsOption({ vendorsOption: target.value }));
      if (target.value === VendorsOptions.all) {
        onChange({
          restrictedBrandIds: restrictedByTeamBrandIds,
          restrictedMerchantIds: restrictedByTeamMerchantIds,
        });
      }
    },
    [uiDispatch, restrictedByTeamBrandIds, restrictedByTeamMerchantIds, onChange],
  );

  const handleSetSearch = useCallback(
    ({ target }) => {
      uiDispatch(setSearch({ search: target.value.trimLeft() }));
    },
    [uiDispatch],
  );

  const handleSetFilter = useCallback(
    filterValue => {
      uiDispatch(setFilter({ filter: filterValue.filter }));
    },
    [uiDispatch],
  );

  const handleSetSorting = useCallback(
    sorting => {
      uiDispatch(setSorting({ direction: sorting.sortDirection }));
    },
    [uiDispatch],
  );

  const iconRenderer = useCallback(
    ({ cellData }) => (
      <Box width={1} pr={1.5} display="flex" alignItems="center" justifyContent="flex-end">
        <img src={cellData} alt="" width={20} />
      </Box>
    ),
    [],
  );

  const nameRenderer = useCallback(
    ({ cellData }) => (
      <Box height={1} display="flex" alignItems="center">
        {cellData}
      </Box>
    ),
    [],
  );

  const handleOnChange = useCallback(
    (vendor: IGiftVendor) => {
      const updatedVendors = { ...restrictedItems };
      const vendorKey = getVendorKey(vendor);
      if (updatedVendors[vendorKey]) {
        delete updatedVendors[vendorKey];
      } else {
        updatedVendors[vendorKey] = vendor;
      }
      const vendorsList = Object.values(updatedVendors);
      onChange({
        restrictedBrandIds: vendorsList.filter(item => item.type === VendorTypes.brand).map(item => item.id),
        restrictedMerchantIds: vendorsList.filter(item => item.type === VendorTypes.merchant).map(item => item.id),
      });
    },
    [restrictedItems, onChange],
  );

  const checkboxRenderer = useCallback(
    ({ rowData: vendor }) => {
      const isChecked = !vendor.isTeamRestricted && !restrictedItems[getVendorKey(vendor)];
      const iconProps = vendor.isTeamRestricted
        ? {
            icon: <Icon icon="lock-alt" className={classes.restrictIcon} />,
          }
        : {};
      return (
        <Box height={1} display="flex" alignItems="center">
          <Checkbox
            color="primary"
            checked={isChecked}
            disabled={vendor.isTeamRestricted}
            onChange={() => handleOnChange(vendor)}
            {...iconProps}
          />
        </Box>
      );
    },
    [handleOnChange, restrictedItems, classes],
  );

  const handleCheckAll = useCallback(
    (isCheckedAll: boolean) => {
      if (!isCheckedAll) {
        onChange({
          restrictedBrandIds: restrictedByTeamBrandIds,
          restrictedMerchantIds: restrictedByTeamMerchantIds,
        });
        return;
      }

      const restrictedBrandIds: EntityId[] = [];
      const restrictedMerchantIds: EntityId[] = [];
      items.forEach(vendor => {
        if (vendor.type === VendorTypes.brand) {
          restrictedBrandIds.push(vendor.id);
        } else {
          restrictedMerchantIds.push(vendor.id);
        }
      });

      onChange({
        restrictedBrandIds,
        restrictedMerchantIds,
      });
    },
    [items, restrictedByTeamBrandIds, restrictedByTeamMerchantIds, onChange],
  );

  const checkAllHeaderRenderer = useCallback(() => {
    const isCheckedAll = restrictedAmount - restrictedByTeamAmount === 0;
    return (
      <Box>
        <Checkbox color="primary" checked={isCheckedAll} onChange={() => handleCheckAll(isCheckedAll)} />
      </Box>
    );
  }, [handleCheckAll, restrictedAmount, restrictedByTeamAmount]);

  useEffect(() => {
    if (restrictedAmount > 0) {
      uiDispatch(setVendorsOption({ vendorsOption: VendorsOptions.restricted }));
    }
  }, [restrictedAmount, uiDispatch]);

  return (
    <Box>
      <RadioGroup aria-label="allowedVendors" name="allowedVendors" value={vendorsOption} onChange={handleSelectOption}>
        <FormControlLabel
          data-testid="ActivateCreation.AllowedAll.FormControlLabel"
          value={VendorsOptions.all}
          control={<Radio classes={{ root: classes.MuiRadioButton }} color="primary" />}
          classes={{ root: classes.MuiFormControlLabel }}
          label={
            <Box>
              <Typography
                className={!isRestrictedVendors ? 'Body-Regular-Center-Chambray-Bold' : 'Body-Regular-Left-Static'}
                data-testid="Activate.AllowedAllVendorsLabel"
              >
                Allowed all vendors
              </Typography>
            </Box>
          }
        />
        <FormControlLabel
          data-testid="ActivateCreation.Restricted.FormControlLabel"
          value={VendorsOptions.restricted}
          control={<Radio classes={{ root: classes.MuiRadioButton }} color="primary" />}
          classes={{ root: classes.MuiFormControlLabel }}
          label={
            <Box>
              <Typography
                className={isRestrictedVendors ? 'Body-Regular-Center-Chambray-Bold' : 'Body-Regular-Left-Static'}
                data-testid="ActivateCreation.Restricted.Label"
              >
                Allowed specific vendors
              </Typography>
            </Box>
          }
        />
        <Collapse in={isRestrictedVendors} unmountOnExit mountOnEnter>
          <Box pb={2} display="flex" flexDirection="row">
            <Box pt={2} pr={2} width="55%">
              <SearchField fullWidth placeholder="Search gift vendors" value={search} onChange={handleSetSearch} />
            </Box>
            <Box width="45%">
              <SelectFilter
                name="filter"
                label=""
                fullWidth
                margin="normal"
                onFilterChange={handleSetFilter}
                renderItems={() =>
                  filters.map(item => (
                    <MenuItem key={item.value} value={item.value}>
                      {item.label}
                    </MenuItem>
                  ))
                }
                value={filter}
              />
            </Box>
          </Box>
          <VirtualizedTable
            className={classes.table}
            width={450}
            height={500}
            headerHeight={45}
            rowHeight={56}
            rowCount={vendorItems.length}
            rowGetter={({ index }: { index: number }) => vendorItems[index]}
            sort={handleSetSorting}
            sortBy="name"
            sortDirection={sortDirection}
          >
            <Column
              dataKey="checked"
              width={46}
              cellRenderer={checkboxRenderer}
              disableSort
              headerRenderer={checkAllHeaderRenderer}
            />
            <Column label="" dataKey="logoUrl" width={35} cellRenderer={iconRenderer} disableSort />
            <Column label="VENDOR" dataKey="name" width={300} cellRenderer={nameRenderer} />
          </VirtualizedTable>
        </Collapse>
      </RadioGroup>
    </Box>
  );
};

export default memo(ActivateAllowedVendors);
