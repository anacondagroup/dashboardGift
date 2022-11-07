import React from 'react';
import PropTypes from 'prop-types';
import { upperFirstLetter } from '@alycecom/utils';
import { Link } from 'react-router-dom';
import qs from 'query-string';

import { CAMPAIGN_TYPES } from '../../../../../constants/campaignSettings.constants';
import DashboardSection from '../../../../../components/Dashboard/Shared/DashboardSection';
import GiftBreakdownTable from '../../Breakdowns/GiftBreakdown/GiftBreakdownTable/GiftBreakdownTable';
import StandardGiftBreakdown from '../../Breakdowns/GiftBreakdown/StandartGiftBreakdown/StandardGiftBreakdown';
import useGiftBreakdown from '../../../hooks/useGiftBreakdown';
import { tabsKeys } from '../../../../../constants/sidebarTabs.constants';

const swagBreakdownTableColumns = [
  {
    name: 'Recipient',
    field: 'recipient.fullName',
  },
  {
    name: 'Email',
    field: 'recipient.email',
  },
  {
    name: 'Batch name',
    field: 'batchName',
  },
  {
    name: 'Accepted gift',
    field: 'acceptedGift',
  },
  {
    name: 'Gift status',
    field: 'giftStatus',
    formatValue: v => upperFirstLetter(v.split('_').join(' ')),
  },
];

const activateBreakdownTableColumns = [
  {
    name: 'Recipient',
    field: 'recipient.fullName',
  },
  {
    name: 'Company',
    field: 'recipient.company',
  },
  {
    name: 'Sent gift',
    field: 'sentProduct',
  },
  {
    name: 'Accepted gift',
    field: 'acceptedProduct',
  },
  {
    name: 'Gift status',
    field: 'giftStatus',
    getValue: item => item,
    /* eslint-disable react/prop-types */
    formatValue: ({ id, giftStatus, recipient }) => (
      <Link
        to={{
          search: qs.stringify({
            ...qs.parse(window.location.search),
            gift_id: id,
            sidebar_tab: tabsKeys.SEND_GIFT,
            contact_id: recipient.id,
          }),
        }}
      >
        {upperFirstLetter(giftStatus.split('_').join(' '))}
      </Link>
    ),
    /* eslint-enable react/prop-types */
  },
];

const getColumnsByCampaignType = campaignType => {
  if (campaignType.includes(CAMPAIGN_TYPES.SWAG)) {
    return swagBreakdownTableColumns;
  }

  if (campaignType.includes(CAMPAIGN_TYPES.ACTIVATE)) {
    return activateBreakdownTableColumns;
  }
  return undefined;
};

const CampaignGiftBreakdownSection = ({ campaignType, teamId, campaignId, campaignName }) => {
  const { isLoading, breakdown, pagination, isGiftReportLoading, downloadReport } = useGiftBreakdown({
    teamId,
    campaignId,
  });
  const columns = getColumnsByCampaignType(campaignType);

  return (
    <DashboardSection
      title="Gift Breakdown"
      icon="gift"
      subtitle={`This is a list of all the gifts that have been sent in the ${campaignName} campaign.`}
      showDownloadReceipt
      isReportLoading={isGiftReportLoading}
      showDownloadReport={breakdown && !!breakdown.length}
      onDownloadReport={downloadReport}
    >
      {campaignType === CAMPAIGN_TYPES.STANDARD || campaignType === CAMPAIGN_TYPES.PROSPECTING ? (
        <StandardGiftBreakdown
          teamId={teamId}
          campaignId={campaignId}
          breakdown={breakdown}
          isLoading={isLoading}
          pagination={pagination}
        />
      ) : (
        <GiftBreakdownTable breakdown={breakdown} isLoading={isLoading} columns={columns} pagination={pagination} />
      )}
    </DashboardSection>
  );
};

CampaignGiftBreakdownSection.propTypes = {
  campaignType: PropTypes.string.isRequired,
  teamId: PropTypes.number.isRequired,
  campaignId: PropTypes.number.isRequired,
  campaignName: PropTypes.string.isRequired,
};

export default CampaignGiftBreakdownSection;
