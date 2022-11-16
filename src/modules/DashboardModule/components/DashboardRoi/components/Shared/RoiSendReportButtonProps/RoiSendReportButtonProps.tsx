import React, { memo, useCallback, useEffect } from 'react';
import { Box, Popover, Theme } from '@mui/material';
import { Button, IButtonProps, Icon } from '@alycecom/ui';
import {
  GlobalMessage,
  MessageType,
  RoiReportTypes,
  TGlobalRoiFilters,
  TRoiTableFilters,
  useSendReportToEmailMutation,
} from '@alycecom/services';
import { useDispatch } from 'react-redux';

import SendReportForm from './SendReportForm';

const styles = {
  link: {
    '&:hover': {
      textDecoration: 'underline',
    },
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    m: ({ spacing }: Theme) => spacing(2, 3),
  },
} as const;

export interface IRoiSendReportButtonProps extends Omit<IButtonProps, 'children'> {
  filters: TGlobalRoiFilters & Pick<TRoiTableFilters<never>, 'search' | 'campaignPurposes'>;
  reportType: RoiReportTypes;
}

const RoiSendReportButton = ({ reportType, filters, ...buttonProps }: IRoiSendReportButtonProps): JSX.Element => {
  const dispatch = useDispatch();

  const [sendReportToEmail, { isLoading, isSuccess, error }] = useSendReportToEmailMutation();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const closePopover = useCallback(() => {
    setAnchorEl(null);
  }, [setAnchorEl]);

  const handleSubmit = useCallback(
    ({ email }) => {
      sendReportToEmail({
        email,
        reportType,
        filters,
      });
    },
    [sendReportToEmail, filters, reportType],
  );

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        GlobalMessage.actions.showGlobalMessage({
          type: MessageType.Success,
          text: 'The report was sent successfully!',
        }),
      );
    }
  }, [dispatch, isSuccess]);

  useEffect(() => {
    if (isSuccess || error) {
      closePopover();
    }
  }, [closePopover, isSuccess, error]);

  return (
    <>
      <Button
        variant="text"
        startIcon={<Icon icon="envelope" />}
        onClick={e => setAnchorEl(e.currentTarget)}
        sx={styles.link}
        {...buttonProps}
      >
        Email report
      </Button>
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={closePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Box sx={styles.modalBody}>
          <SendReportForm isLoading={isLoading} onSubmit={handleSubmit} />
        </Box>
      </Popover>
    </>
  );
};

export default memo(RoiSendReportButton);
