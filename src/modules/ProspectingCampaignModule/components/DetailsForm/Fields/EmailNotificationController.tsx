import React from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextFieldProps,
  Theme,
} from '@mui/material';

import {
  NotificationStatus,
  NotificationStatusRecipient,
} from '../../../store/prospectingCampaign/prospectingCampaign.types';
import { DetailsFormFields } from '../../../store/prospectingCampaign/steps/details/details.schemas';
import { SFormLabel } from '../../styled/Styled';

const styles = {
  subtitle: {
    fontSize: '0.875rem',
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

const ROWS = {
  [NotificationStatus.GiftViewed]: 'Gift viewed',
  [NotificationStatus.GiftExpired]: 'Gift expired',
  [NotificationStatus.GiftClaimedOrDeclined]: 'Gift accepted/declined',
};

const COLS = {
  [NotificationStatusRecipient.Owner]: 'CAMPAIGN MANAGER',
  [NotificationStatusRecipient.Sender]: 'GIFT SENDER',
  [NotificationStatusRecipient.SendAs]: 'GIFT SEND-AS',
};

type TEmailNotificationsControllerProps<FormInterface extends FieldValues> = Omit<TextFieldProps, 'error'> & {
  control: Control<FormInterface>;
};

const EmailNotificationsController = <FormInterface,>({
  control,
}: TEmailNotificationsControllerProps<FormInterface>): JSX.Element => (
  <>
    <SFormLabel>Gift & Research Notifications</SFormLabel>
    <Box mt={0.5} sx={styles.subtitle}>
      Gift notifications are sent when when a gift invitation has been delivered, the redemption landing page has been
      viewed, and a gift has been accepted.
    </Box>
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>GIFT STATUS</TableCell>
            {Object.entries(COLS).map(([type, label]) => (
              <TableCell key={type}>{label}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(ROWS).map(([type, label]) => (
            <TableRow key={type}>
              <TableCell>{label}</TableCell>
              {Object.entries(COLS).map(([recipient]) => (
                <TableCell key={recipient}>
                  <Controller
                    control={control}
                    name={`${DetailsFormFields.NotificationSettings}.${type}.${recipient}` as Path<FormInterface>}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        color="primary"
                        checked={value as boolean}
                        onChange={(event, checked) => onChange(checked)}
                      />
                    )}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </>
);

export default EmailNotificationsController;
