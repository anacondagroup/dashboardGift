import { reducer, initialState } from '../history.reducer';
import { historyLoadSuccess } from '../history.actions';

describe('history reducer', () => {
  describe('success', () => {
    it('Should transform gifts', () => {
      const actual = reducer(
        initialState,
        historyLoadSuccess([
          {
            history: [
              {
                label: 'Gift created',
                status_string: null,
                action_date: '12/19/2017 @ 01:32 pm',
              },
              {
                label: 'Options ready',
                status_string: 'Alyce has completed its research and gift options ready to be choosen!',
                action_date: '12/19/2017 @ 01:32 pm',
              },
              {
                label: 'Invite delivered',
                status_string: null,
                action_date: '12/19/2017 @ 01:32 pm',
              },
              {
                label: 'Invite expired',
                status_string: null,
                action_date: '12/19/2017 @ 01:32 pm',
              },
            ],
            id: 2061,
            status_id: 80,
            shipping_info: null,
            sent_by: {
              avatar: 'http://alyce.site/images/avatar.png',
              id: 1045,
              full_name: 'Super Admin',
              email: 'admin@gmail.com',
            },
            sent_as: null,
            campaign: null,
            product: {
              name: 'Signature Messenger - Blue',
              image: 'https://s3.amazonaws.com/cdn-dev.alyce.co/images/products/p11071_image1_25753.jpg',
            },
            meeting: null,
          },
        ]),
      );

      expect(actual).toMatchSnapshot();
    });
  });
});
