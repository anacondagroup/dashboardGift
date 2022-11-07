import { rest } from 'msw';

const getDashboardTeamsMock = rest.get('/enterprise/dashboard/teams', (req, res, ctx) =>
  res(
    ctx.json({
      success: true,
      teams: [
        { id: 2741, name: 'Test team', settings: { currency_id: 1, enterprise_mode_enabled: true, country_id: 1 } },
      ],
    }),
  ),
);

export const dashboardTeamsMocks = [getDashboardTeamsMock];
