import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { Icon, Divider } from '@alycecom/ui';
import { Features } from '@alycecom/modules';
import { upperFirstLetter } from '@alycecom/utils';
import { useSelector } from 'react-redux';

import { CAMPAIGN_TYPES } from '../../../../../../constants/campaignSettings.constants';
import { getCampaignTypeName } from '../../../../../../helpers/campaignSettings.helpers';
import personalGifting from '../../../../../../assets/images/personal_gifting-icon.svg';
import many1 from '../../../../../../assets/images/1_ many-icon.svg';
import giftRedemptionCard from '../../../../../../assets/images/gift_redemption_card-icon.svg';
import prospecting from '../../../../../../assets/images/prospecting-icon.svg';

const useStyles = makeStyles(theme => ({
  container: {
    width: 440,
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(3),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  button: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    cursor: 'pointer',
  },
  chevron: {
    alignSelf: 'center',
  },
}));

export interface IChooseCampaignTypeProps {
  handleStandardCampaign: () => void;
  handleSwagSelectCampaign: () => void;
  handleNewActivateCampaign: () => void;
  handleProspectingCampaign: () => void;
}

const ChooseCampaignType = ({
  handleStandardCampaign,
  handleSwagSelectCampaign,
  handleNewActivateCampaign,
  handleProspectingCampaign,
}: IChooseCampaignTypeProps): JSX.Element => {
  const classes = useStyles();
  const hasA4MFeatureFlag = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.ALYCE_FOR_MARKETING));
  const hasSwagAddonFeature = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.SWAG_ADD_ON));
  const hasNewSwagCampaigns = useSelector(Features.selectors.hasFeatureFlag(Features.FLAGS.GIFT_REDEMPTION_CODES_2_0));
  const showSwagCampaign = hasSwagAddonFeature || hasNewSwagCampaigns;

  return (
    <Box className={classes.container}>
      <Box mb={2}>
        <Typography>Alyce offers several campaign types that you can customize for specific use cases.</Typography>
      </Box>
      <Paper className={classes.paper}>
        <Box>
          <Box display="flex" className={classes.button} onClick={handleStandardCampaign}>
            <img src={personalGifting} alt={getCampaignTypeName(CAMPAIGN_TYPES.STANDARD)} />
            <Box display="flex" flexDirection="column" pr={3} pl={3} width="fill-available">
              <Box
                className="Body-Medium-Link"
                data-testid={`ChooseCampaignTypeSidebar.CampaignType.${upperFirstLetter(CAMPAIGN_TYPES.STANDARD)}`}
              >
                {getCampaignTypeName(CAMPAIGN_TYPES.STANDARD)}
              </Box>
              <Box className="Body-Regular-Left-Inactive" mt={0.5}>
                Create a one-to-one gifting campaign.
              </Box>
            </Box>
            <Icon className={classes.chevron} color="link" icon="chevron-right" />
          </Box>
        </Box>

        {hasA4MFeatureFlag && (
          <>
            <Box pl={5} mt={3} mb={3}>
              <Divider my={1} />
            </Box>
            <Box>
              <Box display="flex" className={classes.button} onClick={handleNewActivateCampaign}>
                <img src={many1} alt={getCampaignTypeName(CAMPAIGN_TYPES.A4M)} />
                <Box display="flex" flexDirection="column" pr={3} pl={3}>
                  <Box
                    className="Body-Medium-Link"
                    data-testid={`ChooseCampaignTypeSidebar.CampaignType.${upperFirstLetter(CAMPAIGN_TYPES.A4M)}`}
                  >
                    {getCampaignTypeName(CAMPAIGN_TYPES.A4M)}
                  </Box>
                  <Box className="Body-Regular-Left-Inactive" mt={0.5}>
                    Generate one or more gift links for your team for gifting at scale.
                  </Box>
                </Box>
                <Icon className={classes.chevron} color="link" icon="chevron-right" />
              </Box>
            </Box>
          </>
        )}

        {showSwagCampaign && (
          <>
            <Box pl={5} mt={3} mb={3}>
              <Divider my={1} />
            </Box>
            <Box>
              <Box display="flex" className={classes.button} onClick={handleSwagSelectCampaign}>
                <img src={giftRedemptionCard} alt={getCampaignTypeName(CAMPAIGN_TYPES.SWAG)} />
                <Box display="flex" flexDirection="column" pr={3} pl={3}>
                  <Box
                    className="Body-Medium-Link"
                    data-testid={`ChooseCampaignTypeSidebar.CampaignType.${upperFirstLetter(CAMPAIGN_TYPES.SWAG)}`}
                  >
                    {getCampaignTypeName(CAMPAIGN_TYPES.SWAG)}
                  </Box>
                  <Box className="Body-Regular-Left-Inactive" mt={0.5}>
                    Order stacks of branded cards with unique codes for in-person events or generate digital codes for
                    virtual events. (US & Canada only)
                  </Box>
                </Box>
                <Icon className={classes.chevron} color="link" icon="chevron-right" />
              </Box>
            </Box>
          </>
        )}

        <>
          <Box pl={5} mt={3} mb={3}>
            <Divider my={1} />
          </Box>
          <Box>
            <Box display="flex" className={classes.button} onClick={handleProspectingCampaign}>
              <img src={prospecting} alt={getCampaignTypeName(CAMPAIGN_TYPES.PROSPECTING)} />
              <Box display="flex" flexDirection="column" pr={3} pl={3}>
                <Box
                  className="Body-Medium-Link"
                  data-testid={`ChooseCampaignTypeSidebar.CampaignType.${upperFirstLetter(CAMPAIGN_TYPES.PROSPECTING)}`}
                >
                  {getCampaignTypeName(CAMPAIGN_TYPES.PROSPECTING)}
                </Box>
                <Box className="Body-Regular-Left-Inactive" mt={0.5}>
                  Upload a list of contacts in order to bulk-send a gift directly from Alyce
                </Box>
              </Box>
              <Icon className={classes.chevron} color="link" icon="chevron-right" />
            </Box>
          </Box>
        </>
      </Paper>
    </Box>
  );
};

export default ChooseCampaignType;
