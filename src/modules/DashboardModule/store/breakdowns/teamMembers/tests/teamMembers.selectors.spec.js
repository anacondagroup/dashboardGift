import { getApiCallQuery, buildApiUrl, buildReportUrl, getReportFileName } from '../teamMembers.selectors';
import { fullStateMock } from '../../../../../../mocks/fullState.mock';

describe('team members selector', () => {
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
      })(fullStateMock);

      expect(actual).toMatchSnapshot();
    });
  });
  describe('getApiCallQuery', () => {
    it('Should pick required props from url and return new url', () => {
      const search = { teamId: '1', sort: 'name', sortDirection: 'asc', search: 'asd' };

      const actual = getApiCallQuery(search);
      expect(actual).toBe('search=asd&sort_column=name&sort_direction=asc&team_id=1');
    });
  });

  describe('buildApiUrl', () => {
    const actual = buildApiUrl({ teamId: '1', sort: 'name', sortDirection: 'asc', search: 'asd' });
    expect(actual).toMatchSnapshot();
  });

  describe('buildReportUrl', () => {
    const actual = buildReportUrl({ teamId: '1', sort: 'name', sortDirection: 'asc', search: 'asd' });
    expect(actual).toMatchSnapshot();
  });
});
