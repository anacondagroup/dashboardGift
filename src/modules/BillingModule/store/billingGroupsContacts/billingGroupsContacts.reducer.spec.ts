import { billingGroupsContacts as reducer, initialState } from './billingGroupsContacts.reducer';

import { getBillingContactListSuccess } from './billingGroupsContacts.actions';

describe('billingGroups.reducer', () => {
  test('Should return billing Contacts information', () => {
    const state = reducer(
      initialState,
      getBillingContactListSuccess({
        data: [
          {
            firstName: 'Edward',
            lastName: 'Jhonson',
            email: 'edward@jhonson.com',
          },
          {
            firstName: 'Jhon',
            lastName: 'Doe',
            email: 'jhon@doe.com',
          },
          {
            firstName: 'Ernts',
            lastName: 'Hemingway',
            email: 'abc@gmail.com',
          },
        ],
      }),
    );

    expect(state.ids.length).toBe(3);
    expect(state.entities['edward@jhonson.com'].firstName).toBe('Edward');
  });
});
