import { reducer, initialState } from '../overview.reducer';
import { overviewLoadSuccess } from '../overview.actions';
import { overviewMock } from '../__mocks__/overview.mock';

describe('Overview reducer', () => {
  it('Should transform API data', () => {
    const actual = reducer(initialState, overviewLoadSuccess(overviewMock));

    expect(actual).toMatchSnapshot();
  });
});
