import { GIFT_REPORT } from './giftReport.types';

/**
 * Create send gift invitation report action.
 * You may not pass memberId, teamId or campaignId and report will builded by all contacts.
 *
 * @namespace
 * @param {Object} data - Invitation report request details.
 * @prop {string} data.email
 * @prop {string | null} data.from
 * @prop {string | null} data.to
 * @prop {number | null} data.teamId - Pass team id for build report by team.
 * @prop {number | null} data.memberId - Pass member id when teamId passed to build report by member of the team.
 * @prop {number | null} data.campaignId - Pass campaign id to build report by campaign.
 * @returns {Object} - Send gift reports action.
 */
export const sendGiftReport = ({ email, from, to, memberId, teamId, campaignId }) => ({
  type: GIFT_REPORT.SEND,
  meta: { email, from, to, memberId, teamId, campaignId },
});
