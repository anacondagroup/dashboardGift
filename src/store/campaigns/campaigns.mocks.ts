import { rest } from 'msw';

const getDashboardCampaignsMock = rest.get('/enterprise/dashboard/campaigns', (req, res, ctx) =>
  res(
    ctx.json({
      success: true,
      campaigns: [
        {
          id: 8416,
          name: 'Standard 1',
          team_id: 2741,
          can_edit: true,
          type: 'standard',
          isInternational: false,
          giftExchangeOption: 'campaign-budget',
        },
        {
          id: 8417,
          name: 'Standard 2',
          team_id: 2741,
          can_edit: true,
          type: 'standard',
          isInternational: false,
          giftExchangeOption: 'campaign-budget',
        },
      ],
    }),
  ),
);

export const dashboardCampaignsMocks = [getDashboardCampaignsMock];
