import React, { memo, useMemo } from 'react';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { TCampaign, useGetBudgetUtilizationByUserIdQuery } from '@alycecom/services';
import { Features, User } from '@alycecom/modules';
import { Tooltip } from '@alycecom/ui';

const styles = {
  button: {
    boxShadow: 'none',
    fontSize: '14px',
  },
} as const;

export interface GiftOptionsReadyButtonProps {
  campaign?: TCampaign;
  giftStatus: string;
  onStatusClick: () => void;
}

const GiftOptionsReadyButton = ({ campaign, giftStatus, onStatusClick }: GiftOptionsReadyButtonProps): JSX.Element => {
  const hasBudgetManagementLimit = useSelector(
    useMemo(() => Features.selectors.hasFeatureFlag(Features.FLAGS.BUDGET_MANAGEMENT_LIMIT), []),
  );

  const userId = useSelector(User.selectors.getUserId);

  const { data: budgetUtilization, isLoading: budgetUtilizationsIsLoading } = useGetBudgetUtilizationByUserIdQuery(
    {
      userId,
    },
    { refetchOnMountOrArgChange: true, skip: !hasBudgetManagementLimit || !campaign },
  );

  if (!campaign) {
    return (
      <Tooltip
        title={`You don't have access to this campaign. If you have questions please contact campaign owner.`}
        arrow
        placement="bottom-end"
      >
        <Button variant="contained" color="secondary" size="small" disabled sx={styles.button}>
          {giftStatus}
        </Button>
      </Tooltip>
    );
  }

  const budgetAvailableForGiftOption = budgetUtilization?.entities[campaign.team.id]?.budgetAmount || 0;

  // User will have insufficient budget to select a gift if their available budget is less then
  // the highest value of the campaigns Gift budget
  const campaignGiftMaxValue = campaign.budgetSettings.maxPrice || 0;
  const campaignDonationValue = campaign.budgetSettings.donationPrice || 0;
  const campaignGiftCardValue = campaign.budgetSettings.giftCardPrice || 0;
  const enforcementLimit = Math.max(campaignGiftMaxValue, campaignDonationValue, campaignGiftCardValue);
  const hasInsufficientBudgetForGifts = budgetAvailableForGiftOption < enforcementLimit;

  if (hasBudgetManagementLimit && hasInsufficientBudgetForGifts) {
    return (
      <Tooltip
        title="You have insufficient budget to send gifts via this campaign. Please reach out to your team admin."
        arrow
        placement="bottom-end"
      >
        <Button
          variant="contained"
          color="secondary"
          size="small"
          disabled={hasInsufficientBudgetForGifts}
          sx={styles.button}
        >
          {giftStatus}
        </Button>
      </Tooltip>
    );
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      sx={styles.button}
      onClick={onStatusClick}
      disabled={budgetUtilizationsIsLoading}
    >
      {giftStatus}
    </Button>
  );
};

export default memo(GiftOptionsReadyButton);
