import { customFields, initialState } from './customFields.reducer';
import * as actions from './customFields.actions';

const activeCustomFieldMock = {
  label: 'Account ID',
  name: 'account_i_d',
  active: true,
  required: true,
};
const inactiveCustomFieldMock = {
  label: 'Phone Number',
  name: 'phone_number',
  active: false,
  required: true,
};
const fakeCustomFieldMock = { isFake: true, active: false, required: false, name: '', label: '' };
const customFieldsList = [activeCustomFieldMock, inactiveCustomFieldMock];

describe('CustomFields reducer', () => {
  it('should return initial state', () => {
    expect(customFields(undefined, { type: '' })).toEqual(initialState);
  });

  it(`should handle ${actions.getCustomFields}`, () => {
    expect(customFields(initialState, actions.getCustomFields())).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should handle ${actions.getCustomFieldsSuccess}`, () => {
    expect(
      customFields({ ...initialState, isLoading: true }, actions.getCustomFieldsSuccess(customFieldsList)),
    ).toEqual({
      ...initialState,
      isLoading: false,
      isLoaded: true,
      list: customFieldsList,
    });
  });

  it(`should handle ${actions.getCustomFieldsFail}`, () => {
    expect(customFields({ ...initialState, isLoading: true }, actions.getCustomFieldsFail())).toEqual({
      ...initialState,
      isLoading: false,
      isLoaded: false,
      list: [],
    });
  });

  it(`should handle ${actions.addCustomField}`, () => {
    expect(customFields(initialState, actions.addCustomField({ label: 'Account ID', required: false }))).toEqual({
      ...initialState,
      isLoading: true,
      list: [...initialState.list, fakeCustomFieldMock],
    });
  });

  it(`should handle ${actions.addCustomFieldSuccess}`, () => {
    expect(
      customFields(
        { ...initialState, list: [activeCustomFieldMock, fakeCustomFieldMock], isLoading: true },
        actions.addCustomFieldSuccess(inactiveCustomFieldMock),
      ),
    ).toEqual({
      ...initialState,
      isLoading: false,
      list: customFieldsList,
    });
  });

  it(`should handle ${actions.addCustomFieldFail}`, () => {
    expect(
      customFields({ ...initialState, isLoading: true }, actions.addCustomFieldFail({ label: ['ne prokatilo'] })),
    ).toEqual({
      ...initialState,
      isLoading: false,
      addFieldFormErrors: { label: ['ne prokatilo'] },
      list: [],
    });
  });

  it(`should handle ${actions.updateCustomField}`, () => {
    expect(customFields(initialState, actions.updateCustomField({ name: 'Account ID', required: true }))).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should handle ${actions.updateCustomFieldSuccess}`, () => {
    expect(
      customFields(
        { ...initialState, isLoading: true, list: customFieldsList },
        actions.updateCustomFieldSuccess({ ...activeCustomFieldMock, required: false }),
      ),
    ).toEqual({
      ...initialState,
      isLoading: false,
      list: [{ ...activeCustomFieldMock, required: false }, inactiveCustomFieldMock],
    });
  });

  it(`should handle ${actions.deleteCustomField}`, () => {
    expect(customFields({ ...initialState, isLoading: false }, actions.deleteCustomField('Account ID'))).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it(`should handle ${actions.deleteCustomFieldSuccess}`, () => {
    expect(
      customFields(
        {
          ...initialState,
          isLoading: true,
          list: customFieldsList,
        },
        actions.deleteCustomFieldSuccess('account_i_d'),
      ),
    ).toEqual({
      ...initialState,
      isLoading: false,
      list: [inactiveCustomFieldMock],
    });
  });

  it(`should handle ${actions.deleteCustomFieldFail}`, () => {
    expect(customFields({ ...initialState, isLoading: true }, actions.deleteCustomFieldFail())).toEqual({
      ...initialState,
      isLoading: false,
    });
  });
});
