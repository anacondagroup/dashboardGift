import React, { useCallback } from 'react';
import { Box } from '@mui/material';
import { Icon, Divider, FlatButton, AlyceTheme } from '@alycecom/ui';
import { makeStyles } from '@mui/styles';

import { UploadRequestSourceTypes } from '../../../../../store/steps/recipients/uploadRequest/uploadRequest.types';
import UploadingSectionContent from '../../../UploadingSectionContent';

const useStyles = makeStyles<AlyceTheme>(() => ({
  icon: {
    fontSize: '3rem',
    width: '88px  !important',
  },
  button: {
    cursor: 'pointer',
  },
  linkButton: {
    display: 'flex',
    alignItems: 'center',
  },
}));

interface IChooseMarketoContactSourceProps {
  handleBack: () => void;
  onSelectMarketoListType: (source: UploadRequestSourceTypes) => void;
}

const ChooseMarketoContactSource = ({
  handleBack,
  onSelectMarketoListType,
}: IChooseMarketoContactSourceProps): JSX.Element => {
  const classes = useStyles();
  return (
    <UploadingSectionContent title="What type of Marketo list would you like to connect?">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.button}
        onClick={() => onSelectMarketoListType(UploadRequestSourceTypes.MarketoStatic)}
      >
        <Box display="flex">
          <Icon className={classes.icon} icon={['far', 'list-alt']} color="link" />
          <Box display="flex" flexDirection="column" pr={3}>
            <Box className="Body-Medium-Link">Use a static list</Box>
            <Box className="Subcopy-Static-Alt" mt={0.5}>
              Make all contacts in a Marketo Static List eligible to accept a gift from this Activate link.
            </Box>
          </Box>
        </Box>
        <Icon color="link" icon="chevron-right" />
      </Box>
      <Box mt={3} mb={3}>
        <Divider my={1} />
      </Box>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          className={classes.button}
          onClick={useCallback(() => onSelectMarketoListType(UploadRequestSourceTypes.MarketoDynamic), [
            onSelectMarketoListType,
          ])}
        >
          <Box display="flex">
            <Icon className={classes.icon} icon="lightbulb-on" color="link" />
            <Box display="flex" flexDirection="column" pr={3}>
              <Box className="Body-Medium-Link">Use a smart campaign</Box>
              <Box className="Subcopy-Static-Alt" mt={0.5}>
                Dynamically add contacts to this activate campaign by linking a Marketo Smart Campaign. (This will also
                require adding a “Call a Webhook” flow step in your Smart Campaign before linking.)
              </Box>
            </Box>
          </Box>
          <Icon color="link" icon="chevron-right" />
        </Box>
      </Box>
      <Box mt={2} mb={-3}>
        <FlatButton icon="arrow-left" onClick={handleBack}>
          Back to marketing list
        </FlatButton>
      </Box>
    </UploadingSectionContent>
  );
};

export default ChooseMarketoContactSource;
