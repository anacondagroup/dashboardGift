import { makeGetMemberById } from '../members.selectors';

describe('members selectors', () => {
  const members = [{ id: 1 }, { id: 2 }];

  test('makeGetMemberById', () => {
    expect(makeGetMemberById('1').resultFunc(members)).toBe(members[0]);
    expect(makeGetMemberById('3').resultFunc(members)).not.toBeDefined();
  });
});
