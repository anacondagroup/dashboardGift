import { transformGiftReportRequest } from './giftReport.transformers';

describe('giftReport transformers', () => {
  test('transformGiftReportRequest for current month in team breakdown', () => {
    expect(
      transformGiftReportRequest({
        email: 'anakin@empire.com',
        from: null,
        to: null,
        memberId: null,
        campaignId: null,
        teamId: 2,
      }),
    ).toEqual({
      email: 'anakin@empire.com',
      team_id: 2,
    });
  });

  test('transformGiftReportRequest for specific range for member in campaign breakdown', () => {
    expect(
      transformGiftReportRequest({
        email: 'anakin@empire.com',
        from: '11.11.11',
        to: '12.12.12',
        memberId: 10,
        campaignId: 1,
        teamId: null,
      }),
    ).toEqual({
      email: 'anakin@empire.com',
      from: '11.11.11',
      to: '12.12.12',
      team_member_id: 10,
      campaign_id: 1,
    });
  });
});
