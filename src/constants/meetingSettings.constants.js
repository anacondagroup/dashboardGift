import moment from 'moment-timezone';

export const timeZones = [
  {
    text: 'US/Hawaii',
    abbr: 'HT',
    name: 'Pacific/Honolulu',
  },
  {
    text: 'US/Alaska',
    abbr: 'AT',
    name: 'US/Alaska',
  },
  {
    text: 'US/Pacific',
    abbr: 'PT',
    name: 'America/Los_Angeles',
  },
  {
    text: 'US/Mountain',
    abbr: 'MT',
    name: 'America/Denver',
  },
  {
    text: 'US/Central',
    abbr: 'CT',
    name: 'America/Chicago',
  },
  {
    text: 'US/Eastern',
    abbr: 'ET',
    name: 'America/New_York',
  },
  {
    text: 'Canada/Atlantic',
    abbr: 'AT',
    name: 'Canada/Atlantic',
  },
  {
    text: 'UTC',
    abbr: 'UTC',
    name: 'UTC',
  },
];

export const timeZoneOptions = timeZones.map(zone => ({
  id: zone.name,
  value: zone.text,
  name: `${zone.abbr}-${zone.text} (UTC ${moment().tz(zone.name).format('ZZ')}) `,
}));

export const respectOptions = [
  { id: 'true', name: 'Yes, do not allow recipients to book over existing meetings in my calendar.' },
  { id: 'false', name: 'No, allow recipients to book over existing meetings in my calendar' },
];

export const durationOptions = [
  { id: 15, name: '15 minutes' },
  { id: 30, name: '30 minutes' },
  { id: 45, name: '45 minutes' },
  { id: 60, name: '1 hour' },
];

export const MINIMUM_FREQUENCY_OPTION = 15; // Minutes

export const frequencyOptions = [
  { id: 15, name: '15 minutes' },
  { id: 30, name: '30 minutes' },
  { id: 45, name: '45 minutes' },
  { id: 60, name: '1 hour' },
];

export const minutesInDay = 24 * 60;
export const meetingLimitOptions = [
  {
    name: '15 days',
    id: minutesInDay * 15,
  },
  {
    name: '30 days',
    id: minutesInDay * 30,
  },
  {
    name: '45 days',
    id: minutesInDay * 45,
  },
  {
    name: '60 days',
    id: minutesInDay * 60,
  },
  {
    name: '90 days',
    id: minutesInDay * 90,
  },
];

export const placeOptions = [
  { name: 'Phone Call', id: 'phone_call' },
  { name: 'In Person', id: 'in_person' },
  { name: 'Video Conference', id: 'video_conference' },
];

export const additionalHeader = {
  phone_call: 'Type phone number',
  in_person: 'Type address',
  video_conference: 'Type link',
};

export const DEFAULT_START_OF_THE_DAY = moment().set({ hour: 9, minutes: 0, seconds: 0 });

export const DEFAULT_END_OF_THE_DAY = moment().set({ hour: 17, minutes: 0, seconds: 0 });
