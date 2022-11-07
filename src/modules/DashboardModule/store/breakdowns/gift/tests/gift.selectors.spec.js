import { sortGifts, getReportFileName } from '../gift.selectors';
import { fullStateMock } from '../../../../../../mocks/fullState.mock';
import { buildApiUrl, buildReportUrl } from '../gift.epics';

describe('gift selector', () => {
  describe('getReportFileName', () => {
    it('Should build name without params', () => {
      const actual = getReportFileName({})(fullStateMock);
      expect(actual).toMatchSnapshot();
    });

    it('Should build name with all params', () => {
      const actual = getReportFileName({
        teamId: '1',
        dateRangeFrom: '2019-03-12',
        dateRangeTo: '2019-03-13',
        campaignId: '31',
        memberId: '1210',
      })(fullStateMock);

      expect(actual).toMatchSnapshot();
    });
  });
  describe('buildApiUrl', () => {
    it('Should build url', () => {
      const actual = buildApiUrl({
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });
  });
  describe('buildReportUrl', () => {
    it('Should build url', () => {
      const actual = buildReportUrl({
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });
  });
  describe('sortGifts', () => {
    it('Should sort by status id when sort column is giftStatus', () => {
      const gifts = [
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 5,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 2,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 3,
        },
      ];

      expect(sortGifts('giftStatus', 'asc')(gifts)).toEqual([
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 2,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 3,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 5,
        },
      ]);

      expect(sortGifts('giftStatus', 'desc')(gifts)).toEqual([
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 5,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 3,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 2,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
        {
          id: 1,
          giftStatus: 'status',
          giftStatusId: 1,
        },
      ]);
    });

    it('Should sort by full name', () => {
      const gifts = [
        {
          id: 1,
          firstName: 'alyce bob',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
        },
        {
          id: 1,
          firstName: 'bob alyce',
        },
        {
          id: 1,
          firstName: 'bob bob',
        },
      ];

      expect(sortGifts('giftStatus', 'desc')(gifts)).toEqual([
        {
          id: 1,
          firstName: 'bob bob',
        },
        {
          id: 1,
          firstName: 'bob alyce',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
        },
        {
          id: 1,
          firstName: 'alyce bob',
        },
      ]);

      expect(sortGifts('giftStatus', 'asc')(gifts)).toEqual([
        {
          id: 1,
          firstName: 'alyce bob',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
        },
        {
          id: 1,
          firstName: 'bob alyce',
        },
        {
          id: 1,
          firstName: 'bob bob',
        },
      ]);
    });

    it('Should sort by sentOn', () => {
      const gifts = [
        {
          id: 1,
          firstName: 'alyce bob',
          sentOn: '12/14/18',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
          sentOn: '12/14/19',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
        },
        {
          id: 1,
          firstName: 'bob alyce',
          sentOn: '12/14/13',
        },
        {
          id: 1,
          firstName: 'bob bob',
          sentOn: '01/14/18',
        },
      ];

      expect(sortGifts('sentOn', 'asc')(gifts)).toEqual([
        {
          id: 1,
          firstName: 'alyce alyce',
        },
        {
          id: 1,
          firstName: 'bob alyce',
          sentOn: '12/14/13',
        },
        {
          id: 1,
          firstName: 'bob bob',
          sentOn: '01/14/18',
        },
        {
          id: 1,
          firstName: 'alyce bob',
          sentOn: '12/14/18',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
          sentOn: '12/14/19',
        },
      ]);

      expect(sortGifts('sentOn', 'desc')(gifts)).toEqual([
        {
          id: 1,
          firstName: 'alyce alyce',
          sentOn: '12/14/19',
        },
        {
          id: 1,
          firstName: 'alyce bob',
          sentOn: '12/14/18',
        },
        {
          id: 1,
          firstName: 'bob bob',
          sentOn: '01/14/18',
        },
        {
          id: 1,
          firstName: 'bob alyce',
          sentOn: '12/14/13',
        },
        {
          id: 1,
          firstName: 'alyce alyce',
        },
      ]);
    });
  });
});
