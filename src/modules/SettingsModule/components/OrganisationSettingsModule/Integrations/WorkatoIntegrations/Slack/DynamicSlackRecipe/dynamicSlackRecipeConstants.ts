import { SlackIntegrationField } from '../../../../../../store/organisation/integrations/workato/picklists/picklists.types';

export const channelFieldCode = 'SlackChannel.channel.1';
export const giftStatusFieldCode = 'SlackChannel.giftStatus.1';

export const staticSlackRecipe = {
  id: 'production_messaging_slack_send_a_slack_direct_message_when_a_gift_has_been_viewed_and_not_accepted',
  title: 'Send a Slack direct message when a gift has been viewed but not accepted',
  description:
    'This recipe sends a direct message in Slack to the gift sender when an Alyce gift is viewed and not accepted',
} as const;

export const dynamicSlackRecipe = {
  id: 'production_messaging_slack_post_a_message_to_a_slack_channel_when_an_alyce_gift_status_changes',
  title: 'Sync Alyce to Slack',
  description: 'This recipe posts messages to Slack when an Alyce gift changes status',
} as const;

export const SlackFieldsMap = {
  [SlackIntegrationField.Channel]: channelFieldCode,
  [SlackIntegrationField.GiftStatus]: giftStatusFieldCode,
};
