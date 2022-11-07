import { getApiCallQuery } from '../teams.selectors';

describe('getApiCallQuery', () => {
  it('Should pick required props from url and return new url', () => {
    const search =
      'gifts_direction=asc&gifts_sort=name&teams_direction=asc&teams_sort=name&date_range_from=2019-04-17&team_id=1';

    const actual = getApiCallQuery(search);
    expect(actual).toBe('date_range_from=2019-04-17&sort_column=name&sort_direction=asc');
  });
});
