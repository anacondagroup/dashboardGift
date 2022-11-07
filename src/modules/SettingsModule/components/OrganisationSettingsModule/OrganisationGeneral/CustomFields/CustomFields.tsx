import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from '@mui/material';

import { actions } from '../../../../store/organisation/customFields';

import CustomFieldsForm from './CustomFieldsForm';
import CustomFieldsTable from './CustomFieldsTable';

const CustomFields = (): React.ReactElement => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getCustomFields());
  }, [dispatch]);

  return (
    <Box p={3}>
      <Box color="text.primary">
        Custom fields allow you to create and capture unique information whenever someone bulk uploads a list or creates
        a new gift. Custom fields can be set to be “required” for every gift.
      </Box>
      <Box mb={5}>
        <CustomFieldsForm />
      </Box>
      <CustomFieldsTable />
    </Box>
  );
};

CustomFields.propTypes = {};

export default CustomFields;
