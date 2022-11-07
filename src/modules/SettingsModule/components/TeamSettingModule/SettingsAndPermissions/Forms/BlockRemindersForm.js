import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { Box, Checkbox, FormControlLabel, Link, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { applyEach } from '@alycecom/utils';
import { ActionButton, HtmlTip } from '@alycecom/ui';

import { selectors } from '../../../../store/teams/generalSettings';

const useStyles = makeStyles(({ palette, spacing }) => ({
  table: {
    borderBottom: 'none',
    '& .MuiTableCell-head': {
      textTransform: 'none',
      color: palette.text.primary,
    },
    '& .MuiTableCell-root': {
      padding: spacing(1),
    },
    '& .MuiTableBody-root > .MuiTableRow-root:last-child .MuiTableCell-root': {
      borderBottom: 'none',
    },
  },
}));

const BlockRemindersForm = ({ onSubmit }) => {
  const classes = useStyles();
  const isLoading = useSelector(selectors.getIsLoading);
  const teamName = useSelector(selectors.getTeamName);
  const blockReminders = useSelector(selectors.getIsBlockReminders);
  const error = useSelector(useMemo(() => selectors.getErrorByProp('blockReminders'), []));

  const {
    control,
    formState: { isDirty },
    handleSubmit,
    setError,
    reset,
  } = useForm({
    mode: 'all',
    defaultValues: {
      blockReminders,
    },
  });
  const isSubmitDisabled = isLoading || !isDirty;

  useEffect(() => {
    if (error) {
      setError('blockReminders', {
        type: 'manual',
        message: error,
      });
    }
  }, [error, setError]);

  return (
    <Box component="form" mt={2} width={1} onSubmit={handleSubmit(applyEach([onSubmit, reset]))}>
      <Controller
        name="blockReminders"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormControlLabel
            checked={!value}
            onChange={event => onChange(!event.target.checked)}
            control={<Checkbox color="primary" />}
            label={`Allow Alyce to send reminder emails to recipients for ${teamName}`}
          />
        )}
      />

      <HtmlTip>
        <Box color="text.primary" mb={1}>
          Pro-tip: when checked, Alyce will send reminder emails for digital invites at the following time:
        </Box>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Recipient action</TableCell>
              <TableCell>Email Reminder Cadence</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Accessed, but not claimed</TableCell>
              <TableCell>
                Sent at 11:00AM EST on the 2nd day and 5th day after the gift was accessed + 7 days before expiry
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Have not attempted to claim their gift</TableCell>
              <TableCell>
                Sent at 11:00AM EST on the 2nd day and 5th day after the invitation was sent + 7 days expiry
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Gift declined</TableCell>
              <TableCell>No email reminders will be sent.</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box color="text.primary" mt={2}>
          For physical gift invitations sent via the post, email reminders will be sent at 11:00AM EST after 7 & 14 days
          respectively.&nbsp;
          <Link
            display="inline"
            target="__blank"
            rel="noopener noreferrer"
            href="https://help.alyce.com/hc/en-us/articles/360039996031-Gift-Recipient-Notification-Emails-Sent-from-Alyce"
          >
            Learn more about follow-up cadences.
          </Link>
        </Box>
      </HtmlTip>

      <Box mt={2} width={1}>
        <ActionButton disabled={isSubmitDisabled} type="submit">
          Save
        </ActionButton>
      </Box>
    </Box>
  );
};

BlockRemindersForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default BlockRemindersForm;
