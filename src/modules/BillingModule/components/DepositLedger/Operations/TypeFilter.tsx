import React, { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatTestId } from '@alycecom/utils';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { getSelectedTypes, getTypes, getTypesIsLoading, setSelectedTypes } from '../../../store/operations';

const TypeFilter = () => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const isLoading = useSelector(getTypesIsLoading);
  const items = useSelector(getTypes);
  const selected = useSelector(getSelectedTypes);
  const handleChangeSelected = useCallback(
    ev => {
      const selectedIds = ev.target.value;
      if (selectedIds.length > 0) {
        dispatch(setSelectedTypes(selectedIds));
        trackEvent('Deposit ledger - Operation type filter - Changed', { value: selectedIds });
      }
    },
    [dispatch, trackEvent],
  );

  const renderValue = useCallback(
    (value: string[]) => {
      if (value.length === 0 || value.length === items.length) {
        return 'View all';
      }
      return items.reduce((label, type) => {
        if (value.indexOf(type.id) !== -1) {
          return label ? `${label}, ${type.name}` : type.name;
        }
        return label;
      }, '');
    },
    [items],
  );

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="type-filter-label">Operation types</InputLabel>
      <Select
        value={selected}
        onChange={handleChangeSelected}
        multiple
        renderValue={renderValue as (selected: unknown) => string}
        disabled={isLoading}
        variant="outlined"
        label="Operation types"
        IconComponent={ExpandMoreIcon}
        labelId="type-filter-label"
        data-testid="DepositLedger.TypeSelect"
      >
        {items.map(({ id, name }) => (
          <MenuItem value={id} data-testid={formatTestId(`DepositLedger.TypeSelect.${name}`)} key={id}>
            <Checkbox color="secondary" checked={selected.some(selectedId => selectedId === id)} />
            {name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default memo(TypeFilter);
