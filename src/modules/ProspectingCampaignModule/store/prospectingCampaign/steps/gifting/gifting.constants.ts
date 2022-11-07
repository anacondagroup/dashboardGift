import { daysToSeconds } from './gifting.helpers';

export const GiftExpireOption = {
  15: daysToSeconds(15),
  30: daysToSeconds(30),
  45: daysToSeconds(45),
  60: daysToSeconds(60),
  75: daysToSeconds(76),
  90: daysToSeconds(90),
} as const;
