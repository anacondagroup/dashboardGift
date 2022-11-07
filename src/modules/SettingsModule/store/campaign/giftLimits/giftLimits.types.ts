import PropTypes from 'prop-types';

/* eslint-disable camelcase */
export interface IGiftLimit {
  default_gift_limits_amount: number;
  period: string;
  remaining_gift_limits_amount: number;
  user_avatar: string;
  user_email: string;
  user_full_name: string;
  user_id: number;
}

export interface IGiftLimitsSort {
  column: string;
  order: string;
}

export const giftLimitsShape = PropTypes.shape({
  default_gift_limits_amount: PropTypes.number.isRequired,
  period: PropTypes.string.isRequired,
  remaining_gift_limits_amount: PropTypes.number.isRequired,
  user_avatar: PropTypes.string.isRequired,
  user_email: PropTypes.string.isRequired,
  user_full_name: PropTypes.string.isRequired,
  user_id: PropTypes.number.isRequired,
});

export interface IGiftLimitsResponse {
  // eslint-disable-next-line camelcase
  gift_limits: IGiftLimit[];
}
