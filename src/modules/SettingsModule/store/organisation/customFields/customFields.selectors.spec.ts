import * as selectors from './customFields.selectors';

describe('CustomFields selectors', () => {
  test('getIsLoading', () => {
    expect(
      selectors.getIsLoading({
        settings: {
          organisation: {
            customFields: {
              isLoading: false,
            },
          },
        },
      }),
    ).toBe(false);

    expect(
      selectors.getIsLoading({
        settings: {
          organisation: {
            customFields: {
              isLoading: true,
            },
          },
        },
      }),
    ).toBe(true);
  });

  test('getIsLoaded', () => {
    expect(
      selectors.getIsLoaded({
        settings: {
          organisation: {
            customFields: {
              isLoaded: true,
            },
          },
        },
      }),
    ).toBe(true);

    expect(
      selectors.getIsLoaded({
        settings: {
          organisation: {
            customFields: {
              isLoaded: false,
            },
          },
        },
      }),
    ).toBe(false);
  });

  test('getCustomFields', () => {
    expect(
      selectors.getCustomFields({
        settings: {
          organisation: {
            customFields: {
              list: [{ label: 'Account ID', name: 'account_i_d', active: true, required: true }],
            },
          },
        },
      }),
    ).toEqual([{ label: 'Account ID', name: 'account_i_d', active: true, required: true }]);
  });

  test('getAddFieldFormErrors', () => {
    expect(
      selectors.getAddFieldFormErrors({
        settings: {
          organisation: {
            customFields: {
              addFieldFormErrors: {
                label: 'ne prokatilo',
              },
            },
          },
        },
      }),
    ).toEqual({ label: 'ne prokatilo' });
  });
});
