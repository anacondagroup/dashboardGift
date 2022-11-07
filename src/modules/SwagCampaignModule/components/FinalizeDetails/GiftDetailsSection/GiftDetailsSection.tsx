import React, { Fragment, useMemo } from 'react';
import { Box, Grid } from '@mui/material';
import { SectionTitleStyled, SFormLabel } from '@alycecom/modules';
import { useSelector } from 'react-redux';
import { Icon } from '@alycecom/ui';

import { getGiftingData } from '../../../store/swagCampaign/steps/gifting/gifting.selectors';
import { RECIPIENT_ACTION_LABELS } from '../../../store/swagCampaign/steps/finalize/finalize.constants';
import LeadingGift from '../../GiftingForm/controllers/ConfigureLeadingGiftController/fields/LeadingGift';

const GiftDetailsSection = (): JSX.Element => {
  const gifting = useSelector(getGiftingData);
  const defaultGiftSelected = gifting?.defaultGiftData?.defaultGift;
  const isExchangeAllowed = gifting?.giftActionsData?.exchange ?? false;
  const isDonationsAllowed = gifting?.giftActionsData?.donate ?? false;
  const recipientActions = gifting?.recipientActionsData?.recipientActions;

  const acceptanceRequirements = useMemo(
    () =>
      Object.entries(recipientActions ?? {}).reduce((labels, [action, value]) => {
        const label = RECIPIENT_ACTION_LABELS?.[action] ?? '';

        if (label && value) {
          labels.push(label);
        }

        return labels;
      }, [] as string[]),
    [recipientActions],
  );
  const hasRecipientActions = acceptanceRequirements.length > 0;

  return (
    <>
      <SectionTitleStyled my={3} mt={5}>
        Gift Details
      </SectionTitleStyled>
      {!!defaultGiftSelected && (
        <>
          <Grid container spacing={4} direction="row">
            <Grid
              component={Box}
              item
              display="flex"
              flexDirection="column"
              data-testid="SwagBuilder.FinalizeStep.Gift.LeadingGift"
            >
              <LeadingGift value={defaultGiftSelected} />
            </Grid>
            <Grid item>
              <Box mt={5}>
                <Grid container spacing={3} direction="column">
                  <Grid item data-testid="SwagBuilder.FinalizeStep.Gift.Exchanges">
                    <Icon width={30} icon={isExchangeAllowed ? 'check' : 'times'} style={{ cursor: 'default' }} />{' '}
                    Exchanges {isExchangeAllowed ? '' : 'dis'}
                    allowed
                  </Grid>
                  <Grid item data-testid="SwagBuilder.FinalizeStep.Gift.Donations">
                    <Icon width={30} icon={isDonationsAllowed ? 'check' : 'times'} /> Donations{' '}
                    {isDonationsAllowed ? 'allowed' : 'disallowed'}
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>

          {hasRecipientActions && (
            <Box maxWidth={603} data-testid="SwagBuilder.FinalizeStep.Gift.Redemption">
              <Box mt={4} mb={1}>
                <SFormLabel>Redemption Requirements</SFormLabel>
              </Box>
              Recipients must{' '}
              {acceptanceRequirements.map((label, idx, arr) => (
                <Fragment key={label}>
                  {idx !== 0 && ', '}
                  {arr.length > 1 && idx === arr.length - 1 && 'and '}
                  {label}
                </Fragment>
              ))}
              .
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default GiftDetailsSection;
