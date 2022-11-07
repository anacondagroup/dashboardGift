import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, InputAdornment } from '@mui/material';
import { ActionButton, NumberField } from '@alycecom/ui';

const SwagBudgetForm = ({ isLoading, settings, onSave, errors, currencySign }) => {
  const [budget, setBudget] = useState({
    enterprise_min_price: settings.enterprise_min_price,
    enterprise_max_price: settings.enterprise_max_price,
    enterprise_donation_price: settings.enterprise_donation_price,
  });

  return (
    <Box display="flex" flexDirection="column">
      <Box width={1 / 3} mt={2} mb={2}>
        <NumberField
          name="enterprise_min_price"
          label="Minimum amount"
          fullWidth
          value={budget.enterprise_min_price}
          disabled={isLoading}
          onChange={minPrice => {
            setBudget({ ...budget, enterprise_min_price: minPrice });
          }}
          placeholder="Minimum amount"
          InputProps={{
            startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
          }}
          errors={errors}
          required
        />
      </Box>

      <Box width={1 / 3} mt={2} mb={2}>
        <NumberField
          name="enterprise_max_price"
          variant="outlined"
          label="Maximum amount"
          fullWidth
          value={budget.enterprise_max_price}
          disabled={isLoading}
          onChange={maxPrice => {
            setBudget({ ...budget, enterprise_max_price: maxPrice });
          }}
          placeholder="Maximum amount"
          InputProps={{
            startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
          }}
          errors={errors}
          required
        />
      </Box>

      <Box width={1 / 3} mt={2} mb={2}>
        <NumberField
          name="enterprise_donation_price"
          label="Swag donation amount"
          fullWidth
          value={budget.enterprise_donation_price}
          disabled={isLoading}
          onChange={donation => {
            setBudget({ ...budget, enterprise_donation_price: donation });
          }}
          placeholder="Swag donation amount"
          InputProps={{
            startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
          }}
          errors={errors}
          required
        />
      </Box>

      <Box width={1} display="flex" justifyContent="space-between">
        <ActionButton
          width={100}
          onClick={() => {
            onSave(budget);
          }}
          disabled={isLoading}
        >
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

SwagBudgetForm.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  settings: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  currencySign: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
};

SwagBudgetForm.defaultProps = {
  isLoading: false,
  errors: {},
};

export default SwagBudgetForm;
