import React, { useCallback, memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { VirtualizedTable, Icon, AlyceTheme, ModalConfirmationMessage } from '@alycecom/ui';
import { ButtonBase, Box, Typography, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Column, AutoSizer } from 'react-virtualized';

import { actions, selectors } from '../../../../store/organisation/customFields';

import CustomFieldTableSelectInput from './CustomFieldTableSelectInput';
import emptyCustomFields from './EmptyCustomFields.svg';

// TODO: reserve place for required checkbox
// TODO: add Collapse for additional field in create contact

const useStyles = makeStyles<AlyceTheme>(({ palette }) => ({
  table: {
    margin: 0,
    '& .ReactVirtualized__Table__rowColumn': {
      justifyContent: 'flex-start',
    },
    '& .ReactVirtualized__Table__row': {
      borderBottom: `solid 1px ${palette.divider}`,
    },
    '& .ReactVirtualized__Table__row:last-child': {
      borderBottom: 'none',
    },
    '& .ReactVirtualized__Table__rowColumn[aria-colindex="3"]': {
      justifyContent: 'flex-end',
    },
    '& .ReactVirtualized__Table__Grid': {
      paddingTop: 0,
    },
  },
}));

const CustomFieldsTable = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectors.getIsLoading);
  const customFields = useSelector(selectors.getCustomFields);
  const [fieldNameToDelete, setFieldNameToDelete] = useState<string>('');

  const handleRequiredChange = useCallback(
    ({ index, value, field }) => {
      const { name } = customFields[index];
      dispatch(actions.updateCustomField({ name, [field]: value === 'true' }));
    },
    [customFields, dispatch],
  );

  const handleDeleteCustomField = useCallback(event => {
    const { name } = event.currentTarget.dataset;
    setFieldNameToDelete(name);
  }, []);

  const handleConfirmDeleteCustomField = useCallback(() => {
    dispatch(actions.deleteCustomField(fieldNameToDelete));
    setFieldNameToDelete('');
  }, [fieldNameToDelete, dispatch]);

  const handleCancelDeleteCustomField = useCallback(() => {
    setFieldNameToDelete('');
  }, []);

  const renderSelectRequiredField = useCallback(
    ({ cellData, dataKey, rowIndex, rowData }) =>
      rowData.isFake ? (
        <Skeleton width="100%" height="100%" />
      ) : (
        <CustomFieldTableSelectInput
          index={rowIndex}
          field={dataKey}
          value={cellData}
          disabled={isLoading}
          onChange={handleRequiredChange}
          options={{ Yes: 'true', No: 'false' }}
        />
      ),
    [handleRequiredChange, isLoading],
  );

  const renderSelectActiveField = useCallback(
    ({ cellData, dataKey, rowIndex, rowData }) =>
      rowData.isFake ? (
        <Skeleton width="100%" height="100%" />
      ) : (
        <CustomFieldTableSelectInput
          index={rowIndex}
          field={dataKey}
          value={cellData}
          disabled={isLoading}
          onChange={handleRequiredChange}
          options={{ Active: 'true', Disabled: 'false' }}
        />
      ),
    [handleRequiredChange, isLoading],
  );

  const renderDeleteCustomField = useCallback(
    ({ cellData, rowIndex, rowData }) =>
      !rowData.isFake && (
        <Box width={1} height={1} pt={1} display="flex" alignItems="flex-start" justifyContent="center">
          <ButtonBase
            data-testid={`OrgSettings.CustomFields.DeleteCustomField.${rowIndex}`}
            disabled={isLoading}
            data-name={cellData}
            onClick={handleDeleteCustomField}
          >
            <Icon icon="times" color="grey.main" />
          </ButtonBase>
        </Box>
      ),
    [handleDeleteCustomField, isLoading],
  );

  const renderFieldName = useCallback(
    ({ cellData, rowData }) => (rowData.isFake ? <Skeleton variant="text" width="50%" /> : cellData),
    [],
  );

  const getRow = useCallback(({ index }) => customFields[index], [customFields]);

  if (customFields.length === 0) {
    return (
      <Box
        my={8}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        color="text.primary"
      >
        <Box mb={2}>
          <img src={emptyCustomFields} alt="" />
        </Box>
        <Typography variant="h3">You have no custom fields</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <ModalConfirmationMessage
        width="100%"
        variant="warning"
        icon="eye-slash"
        title="Are you sure?"
        submitButtonText="Remove field"
        cancelButtonText="Cancel"
        onSubmit={handleConfirmDeleteCustomField}
        onDiscard={handleCancelDeleteCustomField}
        isOpen={!!fieldNameToDelete}
        backdropStyles={{ top: 0 }}
      >
        By removing this custom field, you will no longer be able to collect custom data for all future gifts. Alyce
        will store all historical data (IE past gifts) and you can recreate the custom field in the future. If you would
        like to keep the field but hide it from your users, we recommend changing the option in the “status” dropdown to
        “disabled”. How would you like to continue?
      </ModalConfirmationMessage>
      <AutoSizer disableHeight>
        {({ width }) => (
          <VirtualizedTable className={classes.table} width={width} rowCount={customFields.length} rowGetter={getRow}>
            <Column label="Custom field name" dataKey="label" width={(width * 5) / 12} cellRenderer={renderFieldName} />
            <Column
              label="Required field"
              dataKey="required"
              width={(width * 3) / 12}
              cellRenderer={renderSelectRequiredField}
            />
            <Column label="Status" dataKey="active" width={(width * 3) / 12} cellRenderer={renderSelectActiveField} />
            <Column label="" dataKey="name" width={width / 12} cellRenderer={renderDeleteCustomField} />
          </VirtualizedTable>
        )}
      </AutoSizer>
    </Box>
  );
};

CustomFieldsTable.propTypes = {};

export default memo(CustomFieldsTable);
