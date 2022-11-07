import React from 'react';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';

import GiftBudgetForm from '../GiftBudgetForm';

jest.mock('react-router-dom', () => ({
  withRouter: jest.fn(),
  Link: 'Link',
}));
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  TextField: 'TextField',
  Button: 'Button',
  Grid: 'Grid',
  Box: 'Box',
  InputAdornment: 'InputAdornment',
}));
jest.mock('@mui/styles', () => ({
  ...jest.requireActual('@mui/styles'),
  // eslint-disable-next-line global-require
  makeStyles: require('../../../../../../../libs/mocks').mockMakeStyles,
  withStyles: jest.fn(() => jest.fn()),
}));
jest.mock('react-redux', () => ({
  useSelector: jest.fn(() => jest.fn()),
  useDispatch: jest.fn(),
  connect: jest.fn(() => jest.fn()),
}));

describe('GiftBudgetForm', () => {
  let props;
  beforeEach(() => {
    props = {
      isLoading: false,
      giftMinPrice: 50,
      giftMaxPrice: 100,
      giftCardPrice: 100,
      giftDonationPrice: 100,
      onSave: () => {},
      errors: {},
      currencySign: '$',
      campaignCurrencies: [],
      priceAvailability: { isPhysicalAvailable: true, isDigitalAvailable: true, isDonationAvailable: true },
    };
  });

  it('should be rendered without errors', () => {
    const tree = create(shallow(<GiftBudgetForm {...props} />));
    expect(tree).toMatchSnapshot();
  });

  it('should be rendered with errors', () => {
    props.errors = {
      enterprise_min_price: ['Wrong min price'],
      enterprise_max_price: ['Wrong max price'],
      enterprise_gift_card_price: ['Wrong card price'],
      enterprise_donation_price: ['Wrong donation price'],
    };
    const tree = create(shallow(<GiftBudgetForm {...props} />));
    expect(tree).toMatchSnapshot();
  });

  it('should be show loading state', () => {
    props.isLoading = true;

    const tree = create(shallow(<GiftBudgetForm {...props} />));
    expect(tree).toMatchSnapshot();
  });
});
