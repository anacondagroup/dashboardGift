import { sendGiftReport } from './giftReport.actions';
import { GIFT_REPORT } from './giftReport.types';

describe('giftReport actions', () => {
  test('sendGiftReport', () => {
    expect(
      sendGiftReport({ email: 'anakin@skywalker.com', from: 'dateFrom', to: 'dateTo', teamId: 1, memberId: 3 }),
    ).toEqual({
      type: GIFT_REPORT.SEND,
      meta: {
        email: 'anakin@skywalker.com',
        from: 'dateFrom',
        to: 'dateTo',
        teamId: 1,
        memberId: 3,
      },
    });
  });

  test('sendGiftReport with real dates', () => {
    expect(
      sendGiftReport({
        email: 'anakin@empire.com',
        from: '11.11.11',
        to: '12.12.12',
        campaignId: null,
        teamId: 1,
        memberId: 1,
      }),
    ).toEqual({
      type: GIFT_REPORT.SEND,
      meta: {
        email: 'anakin@empire.com',
        from: '11.11.11',
        to: '12.12.12',
        campaignId: null,
        teamId: 1,
        memberId: 1,
      },
    });
  });
});
