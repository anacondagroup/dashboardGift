import React from 'react';
import { useSelector } from 'react-redux';
import * as R from 'ramda';
import { CommonData, Features, HasFeature } from '@alycecom/modules';
import { DashboardIcon } from '@alycecom/ui';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { Table, TableHead, TableCell, TableRow, TableBody, InputBase } from '@mui/material';

const useStyles = makeStyles(({ spacing, palette }) => ({
  tableContainer: {
    width: '100%',
    maxHeight: 300,
    overflow: 'auto',
  },
  table: {
    width: 1120,
  },
  row: {
    background: palette.common.white,
  },
  rowWithError: {
    background: palette.red.superLight,
    transition: 'background .3s',
  },
  tableCell: {
    paddingLeft: 6,
  },
  input: {
    borderRadius: 5,
    borderWidth: 1,
    padding: spacing(1, 2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    '&:focus': {
      borderStyle: 'solid',
      background: palette.common.white,
      borderColor: palette.divider,
    },
  },
  deleteIcon: {
    color: palette.red.main,
  },
  inputError: {
    border: `1px ${palette.red.main} solid`,
    borderRadius: 5,
  },
}));
const fields = [
  {
    id: 1,
    label: 'First name',
    prop: 'recipient_first_name',
  },
  {
    id: 2,
    label: 'Last name',
    prop: 'recipient_last_name',
  },
  {
    id: 3,
    label: 'Email',
    prop: 'recipient_email',
  },
  {
    id: 4,
    label: 'Company',
    prop: 'recipient_company',
  },
  {
    id: 5,
    label: 'Country',
    prop: 'recipient_country',
  },
  {
    id: 9,
    label: 'Sender email',
    prop: 'sender_email',
  },
  {
    id: 10,
    label: 'Send as person',
    prop: 'send_as_email',
  },
];

const ImportTable = ({ rows, onContactUpdate, onRowDelete }) => {
  const classes = useStyles();
  const customFields = useSelector(CommonData.selectors.getCustomFields);
  const fieldsForRender = R.sort(R.ascend(R.prop('id')))(fields);
  return (
    <>
      <div className={classes.tableContainer}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {onRowDelete && <TableCell>&nbsp;</TableCell>}
              {fieldsForRender.map(field => (
                <TableCell key={field.id}>{field.label}</TableCell>
              ))}
              {customFields.map(field => (
                <TableCell key={field.name}>{field.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(contact => (
              <TableRow key={contact.id} className={contact.errors.length ? classes.rowWithError : classes.row}>
                {onRowDelete && (
                  <TableCell>
                    <DashboardIcon
                      icon="minus"
                      className={classes.deleteIcon}
                      onClick={() => {
                        onRowDelete(contact);
                      }}
                    />
                  </TableCell>
                )}
                {fieldsForRender.map(field => (
                  <TableCell key={field.id} className={classes.tableCell}>
                    <InputBase
                      className={contact.errors?.some(error => error.field === field.prop) ? classes.inputError : ''}
                      classes={{ input: classes.input }}
                      value={contact[field.prop] || ''}
                      onChange={event => {
                        onContactUpdate({ contact, updatedData: { [field.prop]: event.target.value }, field });
                      }}
                    />
                  </TableCell>
                ))}
                <HasFeature featureKey={Features.FLAGS.CAN_USE_CUSTOM_FIELDS}>
                  {customFields.map(field => (
                    <TableCell key={field.label} className={classes.tableCell}>
                      <InputBase
                        className={
                          contact.errors?.some(error => error.field === `custom_${field.label}`)
                            ? classes.inputError
                            : ''
                        }
                        classes={{ input: classes.input }}
                        value={contact?.custom_fields?.[field.label] ?? ''}
                        onChange={event => {
                          onContactUpdate({
                            contact,
                            updatedData: {
                              custom_fields: { ...contact.custom_fields, [field.label]: event.target.value },
                            },
                            field,
                          });
                        }}
                      />
                    </TableCell>
                  ))}
                </HasFeature>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

ImportTable.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  rows: PropTypes.array.isRequired,
  onContactUpdate: PropTypes.func.isRequired,
  onRowDelete: PropTypes.func,
};
ImportTable.defaultProps = {
  onRowDelete: null,
};
export default ImportTable;
