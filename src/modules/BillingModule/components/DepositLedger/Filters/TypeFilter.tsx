import React, { useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatTestId } from '@alycecom/utils';
import { useGetTransactionTypesQuery } from '@alycecom/services';

import { useBillingTrackEvent } from '../../../hooks/useBillingTrackEvent';
import { getTransactionTypeIds } from '../../../store/ui/transactionsFilters/transactionsFilters.selectors';
import { setTransactionTypeIds } from '../../../store/ui/transactionsFilters/transactionsFilters.reducer';

const TypeFilter = (): JSX.Element => {
  const dispatch = useDispatch();
  const trackEvent = useBillingTrackEvent();

  const { data: transactionTypes = [], isFetching } = useGetTransactionTypesQuery();

  const selected = useSelector(getTransactionTypeIds);

  const handleChangeSelected = useCallback(
    ev => {
      const selectedIds = ev.target.value;
      if (selectedIds.length > 0) {
        dispatch(setTransactionTypeIds(selectedIds));
        trackEvent('Deposit ledger - Operation type filter - Changed', { value: selectedIds });
      }
    },
    [dispatch, trackEvent],
  );

  const renderValue = useCallback(
    (value: string[]) => {
      if (value.length === 0 || value.length === transactionTypes.length) {
        return 'View all';
      }
      return transactionTypes?.reduce((label, type) => {
        if (value.indexOf(type.id) !== -1) {
          return label ? `${label}, ${type.name}` : type.name;
        }
        return label;
      }, '');
    },
    [transactionTypes],
  );

  return (
    <FormControl variant="outlined" fullWidth>
      <InputLabel id="type-filter-label">Operation types</InputLabel>
      <Select
        value={selected}
        onChange={handleChangeSelected}
        multiple
        renderValue={renderValue as (selected: unknown) => string}
        disabled={isFetching}
        variant="outlined"
        label="Operation type"
        IconComponent={ExpandMoreIcon}
        labelId="type-filter-label"
        data-testid="DepositLedger.TypeSelect"
      >
        {transactionTypes.map(({ id, name }) => (
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
