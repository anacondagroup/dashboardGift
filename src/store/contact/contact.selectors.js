import * as R from 'ramda';

export const getContactState = R.prop('contact');

export const getContactCountryId = R.pathOr(null, ['contact', 'profile', 'countryId']);
