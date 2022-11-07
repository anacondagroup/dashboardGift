import React from 'react';

import SendGiftRedirect from '../SendGiftRedirect';
import { render } from '../../../testUtils';

describe('SendGiftRedirect', () => {
  const setup = (
    state: Partial<{
      redirect: Record<string, unknown>;
    }>,
  ) =>
    render(<SendGiftRedirect giftHashId="hashId" />, {
      initialState: {
        redirect: {
          ...state.redirect,
        },
      },
    });

  it('Redirects', () => {
    const { dispatch } = setup({ redirect: { gift: { contact_id: 1, gift_id: 1 } } });

    expect(dispatch).toBeCalledWith(
      expect.objectContaining({
        payload: expect.objectContaining({
          location: expect.objectContaining({ search: '?contact_id=1&gift_id=1&sidebar_tab=send-gift' }),
        }),
      }),
    );
  });
});
