import React from 'react';
import PropTypes from 'prop-types';

import DashboardSection from '../../../../../components/Dashboard/Shared/DashboardSection';
import StandardGiftBreakdown from '../../Breakdowns/GiftBreakdown/StandartGiftBreakdown/StandardGiftBreakdown';
import useGiftBreakdown from '../../../hooks/useGiftBreakdown';

const GiftBreakdownSection = ({ teamId, memberId, campaignId, title, subtitle, placeholder }) => {
  const { isLoading, breakdown, pagination, isGiftReportLoading, downloadReport } = useGiftBreakdown({
    campaignId,
    teamId,
    memberId,
  });

  return (
    <DashboardSection
      title={title}
      subtitle={subtitle}
      icon="gift"
      showDownloadReceipt
      showDownloadReport={breakdown && !!breakdown.length}
      isReportLoading={isGiftReportLoading}
      onDownloadReport={downloadReport}
    >
      <StandardGiftBreakdown
        teamId={teamId}
        memberId={memberId}
        campaignId={campaignId}
        placeholder={placeholder}
        breakdown={breakdown}
        isLoading={isLoading}
        pagination={pagination}
      />
    </DashboardSection>
  );
};

GiftBreakdownSection.propTypes = {
  teamId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  memberId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  campaignId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

GiftBreakdownSection.defaultProps = {
  teamId: undefined,
  memberId: undefined,
  campaignId: undefined,
  title: 'Gift Breakdown',
  placeholder: undefined,
};

export default GiftBreakdownSection;
