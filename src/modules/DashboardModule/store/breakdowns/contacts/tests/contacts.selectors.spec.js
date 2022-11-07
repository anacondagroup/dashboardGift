import { buildApiUrl, buildReportUrl, getReportFileName } from '../contacts.selectors';
import { fullStateMock } from '../../../../../../mocks/fullState.mock';

describe('contacts selector', () => {
  describe('getReportFileName', () => {
    it('Should build name without params', () => {
      const actual = getReportFileName({})(fullStateMock);
      expect(actual).toMatchSnapshot();
    });

    it('Should build name with all params', () => {
      const actual = getReportFileName({
        dateRangeFrom: '2019-03-22',
        dateRangeTo: '2019-03-29',
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
});
