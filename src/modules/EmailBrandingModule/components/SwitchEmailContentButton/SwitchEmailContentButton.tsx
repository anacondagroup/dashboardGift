import React, { memo } from 'react';
import { Box, ButtonGroup, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { getEmailTypeId } from '../../store/brandingSettings/brandingSettings.selectors';
import { EmailType } from '../../store/emailTypes/emailTypes.types';
import { setEmailTypeId } from '../../store/brandingSettings/brandingSettings.actions';

import { styles } from './SwitchEmailContentButton.styles';

const SwitchEmailContentButton = (): JSX.Element => {
  const dispatch = useDispatch();
  const emailTypeId = useSelector(getEmailTypeId);

  const isIntegrationEmail = emailTypeId === EmailType.initialEmailByIntegration;

  const handleChangeEmailType = (type: EmailType) => {
    dispatch(setEmailTypeId(type));
  };

  return (
    <Box sx={styles.root}>
      <ButtonGroup size="small" variant="contained" aria-label="outlined primary button group">
        <Button
          sx={[styles.button, isIntegrationEmail ? styles.inactive : styles.active]}
          onClick={() => handleChangeEmailType(EmailType.initialEmailSenderToRecipient)}
        >
          Alyce Email
        </Button>
        <Button
          sx={[styles.button, isIntegrationEmail ? styles.active : styles.inactive]}
          onClick={() => handleChangeEmailType(EmailType.initialEmailByIntegration)}
        >
          Integration Email
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default memo(SwitchEmailContentButton);
