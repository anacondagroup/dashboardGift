import { getApiCallQuery, getReportFileName } from '../overview.selectors';
import { fullStateMock } from '../../../../../mocks/fullState.mock';

describe('Overview selector', () => {
  describe('getApiCallQuery', () => {
    it('Should pick required props from url and return new url', () => {
      const search = {
        campaignId: '1',
        teamId: '',
        dateRangeFrom: '2019-03-22',
        dateRangeTo: '2019-03-29',
      };

      const actual = getApiCallQuery(search);
      expect(actual).toBe('campaign_id=1&date_range_from=2019-03-22&date_range_to=2019-03-29');
    });
  });

  describe('getReportFileName', () => {
    it('Should build name without params', () => {
      const actual = getReportFileName({})(fullStateMock);
      expect(actual).toMatchSnapshot();
    });

    it('Should build name with all params', () => {
      const actual = getReportFileName({
        teamId: '1',
        dateRangeFrom: '2019-03-22',
        dateRangeTo: '2019-03-29',
        campaignId: '31',
        memberId: '1210',
      })(fullStateMock);

      expect(actual).toMatchSnapshot();
    });
  });
});
