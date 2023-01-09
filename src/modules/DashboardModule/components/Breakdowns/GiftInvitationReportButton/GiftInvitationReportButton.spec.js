import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserEmail } from '@alycecom/modules/dist/Auth/store/auth.selectors';
import { fireEvent, waitForElementToBeRemoved, cleanup, screen } from '@testing-library/react';

import { mockComponent } from '../../../../../libs/mocks';
import { sendGiftReport } from '../../../store/breakdowns/giftReport/giftReport.actions';
import { useTrackGiftInvitationReport } from '../../../hooks/useTrackGiftInvitationReport';

import GiftInvitationReportButton from './GiftInvitationReportButton';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  connect: jest.fn(() => jest.fn()),
}));
jest.mock('@alycecom/modules/dist/Auth/store/auth.selectors');
jest.mock('../../../store/breakdowns/giftReport/giftReport.actions');
jest.mock('../../../hooks/useTrackGiftInvitationReport');
jest.mock('../../../../../store/teams/teams.selectors');

describe('GiftInvitationReportButton unit', () => {
  const dispatch = jest.fn();
  const trackGiftInvitationReportMock = jest.fn();
  let props;

  const setup = (overrideProps = {}) => {
    const mock = mockComponent(<GiftInvitationReportButton {...props} {...overrideProps} />);

    return {
      ...mock,
      getSendReportButton: () => screen.getByLabelText('send gift invitation report'),
      getEmailInput: () =>
        screen.queryByTestId('Dashboard-Breakdown-SendGiftInvitationReportForm').querySelector('input'),
      getOpenPopoverButton: () => screen.getByLabelText('open send gift invitation report form'),
      getSendReportForm: () => screen.queryByTestId('Dashboard-Breakdown-SendGiftInvitationReportForm'),
    };
  };

  afterEach(cleanup);

  beforeEach(() => {
    props = {
      dateRangeFrom: '11.11.11',
      dateRangeTo: '12.12.12',
      teamId: null,
      memberId: null,
      campaignId: null,
    };
    sendGiftReport.mockReset();
    useSelector.mockReset();
    useDispatch.mockReset();
    getUserEmail.mockReset();
    dispatch.mockReset();
    trackGiftInvitationReportMock.mockReset();
    useTrackGiftInvitationReport.mockReset();

    useTrackGiftInvitationReport.mockReturnValue(trackGiftInvitationReportMock);
    useSelector.mockImplementation(fn => fn());
    useDispatch.mockReturnValue(dispatch);
  });

  it('should show gift invitation report form when "Gift invitation Report" clicked', () => {
    const { getSendReportForm, getOpenPopoverButton } = setup();
    expect(getSendReportForm()).toBe(null);
    fireEvent.click(getOpenPopoverButton());

    expect(getSendReportForm()).not.toBe(null);
  });

  it('should dispatch "sendGiftReport" and call handleClose when "Send Report" clicked', async () => {
    sendGiftReport.mockReturnValue('sendGiftReportAction');
    getUserEmail.mockReturnValue('emperor@empire.com');
    const { getOpenPopoverButton, getEmailInput, getSendReportButton, getSendReportForm } = setup({
      memberId: '1',
      teamId: '2',
      campaignId: '3',
    });
    fireEvent.click(getOpenPopoverButton());
    fireEvent.change(getEmailInput(), {
      target: { value: 'anakin@empire.com' },
    });
    fireEvent.click(getSendReportButton());

    await waitForElementToBeRemoved(() => getSendReportForm());

    expect(trackGiftInvitationReportMock).toBeCalledWith('single-team');
    expect(sendGiftReport).toBeCalledWith({
      email: 'anakin@empire.com',
      from: '11.11.11',
      to: '12.12.12',
      memberId: 1,
      includeArchived: false,
      teamId: 2,
      campaignId: 3,
    });
    expect(dispatch).toBeCalledWith('sendGiftReportAction');
  });

  it('should dispatch "sendGiftReport" and call handleClose when "Send Report" clicked with default props', async () => {
    sendGiftReport.mockReturnValue('sendGiftReportAction');
    getUserEmail.mockReturnValue('emperor@empire.com');
    const { getOpenPopoverButton, getSendReportButton, getSendReportForm } = setup({
      dateRangeFrom: undefined,
      dateRangeTo: undefined,
    });
    fireEvent.click(getOpenPopoverButton());
    fireEvent.click(getSendReportButton());

    await waitForElementToBeRemoved(() => getSendReportForm());

    expect(trackGiftInvitationReportMock).toBeCalledWith('all-teams');
    expect(dispatch).toBeCalledWith('sendGiftReportAction');
    expect(sendGiftReport).toBeCalledWith({
      email: 'emperor@empire.com',
      from: null,
      to: null,
      memberId: null,
      includeArchived: false,
      teamId: null,
      campaignId: null,
    });
    expect(getSendReportForm()).toBe(null);
  });
});
