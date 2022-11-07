import React from 'react';
import userEvent from '@testing-library/user-event';
import moment, { Moment } from 'moment';

import { render, screen } from '../../../testUtils';

import SelectExpirationDate, {
  REQUEST_DATE_FORMAT,
  calculateDateDiff,
  ISelectExpirationDateProps,
} from './SelectExpirationDate';

describe('SelectExpirationDate', () => {
  const inMonthMoment = moment().add(1, 'month');
  const inMonth = inMonthMoment.format(REQUEST_DATE_FORMAT);
  const defaultProps = { label: 'SelectExpirationDate' };

  const setup = (partialProps?: Omit<ISelectExpirationDateProps, 'label'>) => {
    const props: ISelectExpirationDateProps = { ...defaultProps, ...partialProps };
    const utils = render(<SelectExpirationDate {...props} />);
    const getExpirationDateSelect = (optionName: string) => screen.getByRole('button', { name: optionName });
    const getDatePicker = () => screen.getByRole('textbox') as HTMLTextAreaElement;
    return {
      ...utils,
      getExpirationDateSelect,
      getDatePicker,
    };
  };

  it('Should render without errors', () => {
    setup();
  });

  it('Should not display datepicker if value is not provided', () => {
    const { queryByRole } = setup();
    expect(queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('Should set never expires option if value is null', () => {
    const { getExpirationDateSelect } = setup({ value: null });
    expect(getExpirationDateSelect('Never expires')).toBeInTheDocument();
  });

  it('Should display datepicker field when custom date is selected', () => {
    const { getExpirationDateSelect, getDatePicker, getByRole } = setup();

    userEvent.click(getExpirationDateSelect('Never expires'));
    userEvent.click(getByRole('option', { name: 'Custom date' }));

    const datePicker = getDatePicker();
    expect(datePicker).toBeInTheDocument();
    expect(datePicker.value).toMatch(/90 days/i);
  });

  it('Should set custom date option if provided value is not null', () => {
    const { getExpirationDateSelect } = setup({ value: inMonth });

    expect(getExpirationDateSelect('Custom date')).toBeInTheDocument();
  });

  it('Should display datepicker with provided date', () => {
    const { getDatePicker } = setup({ value: inMonth });
    const diff = moment(inMonth).diff(moment().startOf('day'), 'days');

    const datePicker = getDatePicker();
    expect(datePicker).toBeInTheDocument();
    expect(datePicker.value).toMatch(new RegExp(`${diff} days`, 'i'));
  });

  it('Should fire onChange callback with null if Never expires option has been selected', () => {
    const onChangeMock = jest.fn();
    const { getExpirationDateSelect, getByRole } = setup({ value: inMonth, onChange: onChangeMock });

    userEvent.click(getExpirationDateSelect('Custom date'));
    userEvent.click(getByRole('option', { name: 'Never expires' }));

    expect(getExpirationDateSelect('Never expires')).toBeInTheDocument();
    expect(onChangeMock).toHaveBeenCalledWith(null);
  });

  // FIXME: Disabled due to several fails in different branches because of unstable useEffects
  xit('Should fire onChange callback with date string', () => {
    const onChangeMock = jest.fn();
    const { getDatePicker, getByRole } = setup({ value: inMonth, onChange: onChangeMock });

    userEvent.click(getDatePicker());
    userEvent.click(
      getByRole('button', { name: `${inMonthMoment.format('MMM')} 20, ${inMonthMoment.format('YYYY')}` }),
    );

    expect(onChangeMock.mock.calls[2][0]).toMatch(/-20/i);
  });

  it('Should fire default expiration date once custom date is selected', () => {
    const onChangeMock = jest.fn();
    const { getExpirationDateSelect, getByRole } = setup({ onChange: onChangeMock });

    userEvent.click(getExpirationDateSelect('Never expires'));
    userEvent.click(getByRole('option', { name: 'Custom date' }));

    expect(onChangeMock).toHaveBeenCalled();
  });
});

describe('calculateDateDiff', () => {
  let today: Moment;
  let tomorrow: Moment;
  let yesterday: Moment;

  beforeEach(() => {
    today = moment();
    tomorrow = moment().add(1, 'day');
    yesterday = moment().subtract(1, 'day');
  });

  it('Should return `today` if passed date is current date', () => {
    expect(calculateDateDiff(today)).toBe('today');
  });

  it('Should return `1 day` if passed date is tomorrow', () => {
    expect(calculateDateDiff(tomorrow)).toBe('1 day');
  });

  it('Should return `n days` if difference between passed date and today is greater than 0', () => {
    const inTwoDays = moment().add(2, 'day');
    expect(calculateDateDiff(inTwoDays)).toBe('2 days');
  });

  it('Should return `1 day ago` if passed date is yesterday', () => {
    expect(calculateDateDiff(yesterday)).toBe('1 day ago');
  });

  it('Should return `n days ago` if difference between passed date and today is less than 0', () => {
    const twoDaysAgo = moment().subtract(2, 'day');
    expect(calculateDateDiff(twoDaysAgo)).toBe('2 days ago');
  });
});
