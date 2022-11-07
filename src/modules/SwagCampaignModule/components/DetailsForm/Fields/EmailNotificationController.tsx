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
import { SFormLabel } from '@alycecom/modules';

import {
  SwagDetailsFormFields,
  SwagNotificationStatus,
  SwagNotificationStatusRecipient,
} from '../../../store/swagCampaign/swagCampaign.types';

const styles = {
  subtitle: {
    fontSize: '0.875rem',
    color: ({ palette }: Theme) => palette.grey.main,
  },
} as const;

const ROWS = {
  [SwagNotificationStatus.GiftClaimed]: 'Gift claimed',
};

const COLS = {
  [SwagNotificationStatusRecipient.Owner]: 'CAMPAIGN MANAGER',
};

type TEmailNotificationsControllerProps<FormInterface extends FieldValues> = Omit<TextFieldProps, 'error'> & {
  control: Control<FormInterface>;
};

const EmailNotificationsController = <FormInterface,>({
  control,
}: TEmailNotificationsControllerProps<FormInterface>): JSX.Element => (
  <>
    <SFormLabel>Gift Notifications</SFormLabel>
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
                    name={`${SwagDetailsFormFields.NotificationSettings}.${type}.${recipient}` as Path<FormInterface>}
                    render={({ field: { value, onChange } }) => (
                      <Checkbox
                        color="primary"
                        checked={value as boolean}
                        onChange={(_, checked) => onChange(checked)}
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
