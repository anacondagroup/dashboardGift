import { buildApiUrl, buildReportUrl, getReportFileName } from '../campaigns.selectors';
import { fullStateMock } from '../../../../../../mocks/fullState.mock';

describe('Campaigns selector', () => {
  describe('getReportFileName', () => {
    it('Should build name without params', () => {
      const actual = getReportFileName({})(fullStateMock);
      expect(actual).toMatchSnapshot();
    });

    it('Should build name with all params', () => {
      const actual = getReportFileName({
        teamId: '1',
        dateRangeFrom: '2019-03-22',
        dateRangeTo: '2019-03-24',
        memberId: '1210',
      })(fullStateMock);

      expect(actual).toMatchSnapshot();
    });
  });
  describe('buildApiUrl', () => {
    it('Should get api url with team and member ids', () => {
      const actual = buildApiUrl({
        teamId: 1,
        memberId: 4,
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });

    it('Should get api url with team id', () => {
      const actual = buildApiUrl({
        teamId: 1,
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });

    it('Should get api url', () => {
      const actual = buildApiUrl({
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });
  });

  describe('buildReportUrl', () => {
    it('Should get api url with team and member ids', () => {
      const actual = buildReportUrl({
        teamId: 1,
        memberId: 4,
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });

    it('Should get api url with team id', () => {
      const actual = buildReportUrl({
        teamId: 1,
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });

    it('Should get api url', () => {
      const actual = buildReportUrl({
        sort: 'name',
        sortDirection: 'asc',
        search: 'asd',
      });

      expect(actual).toMatchSnapshot();
    });
  });
});
