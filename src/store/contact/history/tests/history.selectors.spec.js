import { buildApiUrl } from '../history.selectors';

describe('history.selector', () => {
  describe('buildApiUrl', () => {
    it('Should build url', () => {
      const actual = buildApiUrl({
        memberId: '1',
        teamId: '1',
        campaignId: '1',
        dateRangeFrom: '11/11/2019',
        dateRangeTo: '12/12/2019',
      });

      expect(actual).toMatchSnapshot();
    });
  });
});
