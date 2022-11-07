import {
  makeGetCampaignById,
  makeGetCampaignByTeamId,
  makeGetTeamIdByCampaignId,
  makeIsCanEditCampaignByTeamId,
} from './campaigns.selectors';

describe('Campaigns selector', () => {
  const campaigns = [
    { id: 1, team_id: 10, can_edit: false },
    { id: 2, team_id: 11, can_edit: true },
  ];

  const teams = [
    { id: 10, settings: { enterprise_mode_enabled: false } },
    { id: 11, settings: { enterprise_mode_enabled: true } },
  ];

  test('makeGetCampaignByTeamId', () => {
    expect(makeGetCampaignByTeamId('11').resultFunc(campaigns)).toBe(campaigns[1]);

    expect(makeGetCampaignByTeamId('12').resultFunc(campaigns)).not.toBeDefined();
  });

  test('makeGetCampaignById', () => {
    expect(makeGetCampaignById('2').resultFunc(campaigns)).toBe(campaigns[1]);

    expect(makeGetCampaignById('3').resultFunc(campaigns)).not.toBeDefined();
  });

  test('makeIsCanEditCampaignByTeamId', () => {
    expect(makeIsCanEditCampaignByTeamId('11').resultFunc(campaigns[1], teams[0])).toBe(false);
    expect(makeIsCanEditCampaignByTeamId('11').resultFunc(campaigns[0], teams[1])).toBe(false);
    expect(makeIsCanEditCampaignByTeamId('11').resultFunc(campaigns[1], null)).toBe(false);
    expect(makeIsCanEditCampaignByTeamId('11').resultFunc(campaigns[1], teams[1])).toBe(true);
  });

  test('makeGetTeamIdByCampaignId', () => {
    expect(makeGetTeamIdByCampaignId('1').resultFunc(campaigns[1])).toBe(11);
    expect(makeGetTeamIdByCampaignId('1').resultFunc([])).toBe(null);
  });
});
