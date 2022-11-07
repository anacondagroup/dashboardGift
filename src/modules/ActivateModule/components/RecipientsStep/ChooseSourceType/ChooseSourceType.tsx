import React from 'react';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { AlyceTheme, Divider, Icon } from '@alycecom/ui';
import { Features, HasFeature } from '@alycecom/modules';

import MarketoIntegrationItem from '../integrations/MarketoIntegration';
import { SourceTypes } from '../../../constants/recipientSidebar.constants';
import UploadingSectionContent from '../UploadingSectionContent';
import EloquaIntegrationItem from '../integrations/EloquaIntegration';
import { HubSpotIntegrationItem } from '../integrations/HubSpotIntegration';

const useStyles = makeStyles<AlyceTheme>(({ palette, spacing }) => ({
  icon: {
    color: palette.link.main,
    fontSize: '3rem',
    width: '60px!important',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: spacing(3),
    marginLeft: spacing(1),
  },
  blueIcon: {
    color: palette.link.main,
  },
  button: {
    cursor: 'pointer',
  },
}));

interface IChooseSourceTypeProps {
  onSelect: (sourceType: SourceTypes) => void;
}

const ChooseSourceType = ({ onSelect }: IChooseSourceTypeProps): JSX.Element => {
  const classes = useStyles();

  return (
    <UploadingSectionContent
      title="Who will be the recipients of this gift?"
      description="Alyce allows you to either upload your own XLSX list of recipients OR link to one of your pre-exisiting list
          in your external marketing platform."
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        className={classes.button}
        onClick={() => onSelect(SourceTypes.File)}
      >
        <Box display="flex" alignItems="center">
          <Icon icon="file-upload" className={classes.icon} />
          <Box className={classes.content}>
            <Box className="Body-Medium-Link">Upload an XLSX template</Box>
            <Box className="Body-Regular-Left-Inactive" mt={0.5}>
              Upload an XLSX file with contacts from your database
            </Box>
          </Box>
        </Box>
        <Icon icon="chevron-right" className={classes.blueIcon} />
      </Box>

      <Divider my={3} />

      <MarketoIntegrationItem onSelect={() => onSelect(SourceTypes.Marketo)} />

      {/* // TODO Once Eloqua integration app passes the security review we remove this protection  */}
      <HasFeature featureKey={Features.FLAGS.ELOQUA_INTEGRATION}>
        <Divider my={3} />
        <EloquaIntegrationItem onSelect={() => onSelect(SourceTypes.Eloqua)} />
      </HasFeature>

      {/* // TODO Once HubSpot integration app passes the security review we remove this protection  */}
      <HasFeature featureKey={Features.FLAGS.HUBSPOT_INTEGRATION}>
        <Divider my={3} />
        <HubSpotIntegrationItem onSelect={() => onSelect(SourceTypes.HubSpot)} />
      </HasFeature>
    </UploadingSectionContent>
  );
};

export default ChooseSourceType;
