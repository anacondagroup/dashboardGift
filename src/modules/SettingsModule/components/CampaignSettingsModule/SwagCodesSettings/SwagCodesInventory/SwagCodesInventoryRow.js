import React from 'react';
import PropTypes from 'prop-types';
import { Box, FormControl, MenuItem, Select, TableCell, TableRow, TextField } from '@mui/material';
import moment from 'moment';
import { Controller, useFormContext } from 'react-hook-form';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterMoment from '@mui/lab/AdapterMoment';
import DatePicker from '@mui/lab/DatePicker';
import { Icon, TableLoadingLabel } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import ErrorTooltip from '../../../../../../components/Shared/ErrorTooltip/ErrorTooltip';

const useStyle = makeStyles(theme => ({
  green: {
    backgroundColor: theme.palette.green.dark,
    boxShadow: 'none',
    color: theme.palette.common.white,
  },
  ava: {
    borderRadius: 50,
  },
  padCell: {
    padding: '0 1rem',
  },
  selectBox: {
    maxHeight: 48,
  },
}));

const SwagCodesInventoryRow = ({ index, isLoading, batch, teamMembers }) => {
  const classes = useStyle();
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const batchErrors = (errors.batches && errors.batches[index]) || {};

  const onBatchNameBlur = (e, formOnBlur, formOnChange) => {
    formOnChange(e.target.value ? e.target.value.trimRight() : '');
    formOnBlur(e);
  };

  return (
    <TableRow>
      <TableCell padding="none">
        <TableLoadingLabel
          maxWidth={190}
          pr={2}
          render={() => (
            <Box>
              <Controller
                name={`batches[${index}].name`}
                control={control}
                render={({ field: { onChange, onBlur, value, name } }) => (
                  <ErrorTooltip
                    title={batchErrors.name?.message ?? ''}
                    open={!!batchErrors.name}
                    placement="bottom-start"
                    arrow
                  >
                    <TextField
                      key={batch.id}
                      variant="outlined"
                      name={name}
                      value={value}
                      onChange={e => onChange(e.target.value.trimLeft())}
                      onBlur={e => onBatchNameBlur(e, onBlur, onChange)}
                      error={!!batchErrors.name}
                    />
                  </ErrorTooltip>
                )}
              />
            </Box>
          )}
          isLoading={isLoading}
        />
      </TableCell>
      <TableCell padding="normal" align="center">
        <TableLoadingLabel maxWidth={190} pr={2} render={() => <Box>{batch.codesCreated}</Box>} isLoading={isLoading} />
      </TableCell>
      <TableCell padding="normal" align="center">
        <TableLoadingLabel maxWidth={190} pr={2} render={() => <Box>{batch.codesClaimed}</Box>} isLoading={isLoading} />
      </TableCell>
      <TableCell className={classes.padCell} align="left">
        <TableLoadingLabel
          maxWidth={190}
          pr={2}
          render={() => <Box>{moment(batch.creationDate).format('D MMM Y')}</Box>}
          isLoading={isLoading}
        />
      </TableCell>
      <TableCell className={classes.padCell} align="left">
        <TableLoadingLabel
          pr={2}
          render={() => (
            <Box>
              <Controller
                name={`batches[${index}].expirationDate`}
                render={({ field: { onChange, onBlur, value } }) => (
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      inputFormat="L"
                      value={value}
                      onChange={onChange}
                      onBlur={onBlur}
                      renderInput={props => <TextField {...props} variant="outlined" fullWidth />}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          )}
          isLoading={isLoading}
        />
      </TableCell>
      <TableCell className={classes.padCell} align="left">
        <TableLoadingLabel
          maxWidth={400}
          pr={2}
          render={() => (
            <FormControl variant="outlined" fullWidth error={!!batchErrors.ownerId}>
              <Controller
                name={`batches[${index}].ownerId`}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Select
                    id="la_select_member_label"
                    labelId="la_select_member_label"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={classes.selectBox}
                  >
                    {teamMembers.map(member => (
                      <MenuItem key={member.id} value={member.id}>
                        <Box display="flex" justifyContent="flex-start" alignItems="center">
                          {member.id === batch.batchOwner.id && (
                            <img className={classes.ava} src={batch.batchOwner.avatar} alt="" width="30" height="30" />
                          )}
                          <Box pl={1}>{member.name}</Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>
          )}
          isLoading={isLoading}
        />
      </TableCell>
      <TableCell padding="normal" align="right">
        <TableLoadingLabel
          pr={2}
          render={() => (
            <a href={batch.codesCsvFileUrl}>
              <Box className="Body-Regular-Center-Link" display="flex" justifyContent="flex-start" alignItems="center">
                <Icon icon="file-download" color="inherit" />
              </Box>
            </a>
          )}
          isLoading={isLoading}
        />
      </TableCell>
    </TableRow>
  );
};

const BatchOwnerShape = PropTypes.shape({
  id: PropTypes.number,
  avatar: PropTypes.string,
  name: PropTypes.string,
});

SwagCodesInventoryRow.propTypes = {
  index: PropTypes.number.isRequired,
  isLoading: PropTypes.bool.isRequired,
  batch: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string,
    batchOwner: BatchOwnerShape,
    codesClaimed: PropTypes.number,
    codesCreated: PropTypes.number,
    codesCsvFileUrl: PropTypes.string,
    creationDate: PropTypes.string,
    expirationDate: PropTypes.string,
  }).isRequired,
  teamMembers: PropTypes.arrayOf(BatchOwnerShape),
};

SwagCodesInventoryRow.defaultProps = {
  teamMembers: [],
};

export default SwagCodesInventoryRow;
