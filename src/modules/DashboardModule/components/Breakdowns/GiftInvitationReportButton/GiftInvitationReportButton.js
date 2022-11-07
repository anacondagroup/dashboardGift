import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Popover, Typography, TextField, Grid, Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Auth } from '@alycecom/modules';
import { DashboardIcon, DateRangeSelect } from '@alycecom/ui';
import { useDispatch, useSelector } from 'react-redux';

import { sendGiftReport } from '../../../store/breakdowns/giftReport/giftReport.actions';
import { useTrackGiftInvitationReport } from '../../../hooks/useTrackGiftInvitationReport';

const { getUserEmail } = Auth.selectors;

const useStyles = makeStyles(({ spacing, palette }) => ({
  popoverContainer: {
    padding: spacing(2, 3),
    borderRadius: 5,
    backgroundColor: palette.common.white,
  },
  sendReportBtn: {
    backgroundColor: palette.green.dark,
    color: palette.common.white,
    '&:hover': {
      backgroundColor: palette.green.superDark,
    },
  },
  emailField: {
    margin: spacing(2, 0),
  },
}));

const GiftInvitationReportButton = ({ campaignId, memberId, teamId, dateRangeFrom, dateRangeTo, useDateSelect }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const defaultEmail = useSelector(getUserEmail);
  const [anchorEl, setAnchorEl] = useState(null);
  const [email, setEmail] = useState(defaultEmail);
  const [range, setRange] = useState({ from: dateRangeFrom, to: dateRangeTo });
  const isPopoverVisible = !!anchorEl;
  const isSendReportDisabled = !email;
  const id = isPopoverVisible ? 'Dashboard-Gift-Breakdown-Popover' : undefined;
  const trackGiftInvitationReport = useTrackGiftInvitationReport();

  const showPopover = useCallback(
    event => {
      setEmail(defaultEmail);
      setAnchorEl(event.currentTarget);
    },
    [defaultEmail],
  );

  const handleClose = useCallback(() => {
    setEmail('');
    setAnchorEl(null);
  }, []);

  const onEmailType = useCallback(({ currentTarget }) => {
    setEmail(currentTarget.value);
  }, []);

  const onSendReportClick = useCallback(() => {
    trackGiftInvitationReport(teamId ? 'single-team' : 'all-teams');
    dispatch(
      sendGiftReport({
        email,
        from: range.from || dateRangeFrom,
        to: range.to || dateRangeTo,
        memberId: memberId && Number(memberId),
        campaignId: campaignId && Number(campaignId),
        teamId: teamId && Number(teamId),
      }),
    );
    handleClose();
  }, [
    handleClose,
    dispatch,
    email,
    teamId,
    memberId,
    campaignId,
    dateRangeTo,
    dateRangeFrom,
    range,
    trackGiftInvitationReport,
  ]);

  const handleDateSelectChange = useCallback(({ from, to }) => {
    setRange({ from, to });
  }, []);

  return (
    <>
      <Button
        className="Body-Regular-Center-Link-Bold"
        aria-label="open send gift invitation report form"
        aria-describedby={id}
        onClick={showPopover}
        startIcon={<DashboardIcon icon={['fas', 'envelope']} />}
      >
        Gift Invitation Report
      </Button>
      <Popover
        id={id}
        open={isPopoverVisible}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Grid
          data-testid="Dashboard-Breakdown-SendGiftInvitationReportForm"
          container
          direction="column"
          className={classes.popoverContainer}
        >
          <Typography variant="h4">Who should we email it to?</Typography>
          {useDateSelect && (
            <Box mt={2}>
              <DateRangeSelect fullWidth from={range.from} to={range.to} onChange={handleDateSelectChange} />
            </Box>
          )}
          <TextField
            className={classes.emailField}
            value={email}
            onChange={onEmailType}
            label="Email address"
            variant="outlined"
          />
          <Button
            disabled={isSendReportDisabled}
            aria-label="send gift invitation report"
            className={classes.sendReportBtn}
            variant="contained"
            color="link"
            onClick={onSendReportClick}
          >
            Send Report {email}
          </Button>
        </Grid>
      </Popover>
    </>
  );
};

GiftInvitationReportButton.propTypes = {
  dateRangeTo: PropTypes.string,
  dateRangeFrom: PropTypes.string,
  campaignId: PropTypes.number,
  memberId: PropTypes.number,
  teamId: PropTypes.number,
  useDateSelect: PropTypes.bool,
};

GiftInvitationReportButton.defaultProps = {
  dateRangeTo: null,
  dateRangeFrom: null,
  campaignId: null,
  memberId: null,
  teamId: null,
  useDateSelect: false,
};

export default GiftInvitationReportButton;
