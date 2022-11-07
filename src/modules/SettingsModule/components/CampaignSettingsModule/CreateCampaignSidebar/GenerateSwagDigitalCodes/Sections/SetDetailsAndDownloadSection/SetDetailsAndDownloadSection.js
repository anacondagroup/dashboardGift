import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';

import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import { GENERATE_SWAG_DIGITAL_STATES, GSD_STEP_2 } from '../../../../../../../../constants/swagDigital.constants';
import {
  swagDigitalCodesSetStep,
  swagDigitalGenerateCodesRequest,
} from '../../../../../../store/campaign/swagDigitalCodes/swagDigitalCodes.actions';
import { createCampaignSidebarClose } from '../../../../../../store/campaign/createCampaignSidebar/createCampaignSidebar.actions';

import SetBatchDetails from './SetBatchDetails/SetBatchDetails';
import CreateCodesProcessing from './CreateCodesProcessing/CreateCodesProcessing';
import DownloadCsvCodes from './DownloadCsvCodes/DownloadCsvCodes';

const useStyles = makeStyles(theme => ({
  description: {
    color: theme.palette.grey.main,
    fontSize: 14,
  },
  ul: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
  },
  li: {
    fontSize: 14,
  },
  button: {
    boxShadow: 'none',
    width: 145,
  },
  buttonIcon: {
    marginLeft: theme.spacing(1),
  },
  buttonIconLeft: {
    marginRight: theme.spacing(1),
  },
}));

const GENERATION_CODES_STATE = {
  SET_DETAILS: 'SET_DETAILS',
  PROCESSING: 'PROCESSING',
  DOWNLOAD_CSV: 'DOWNLOAD_CSV',
};

const SetDetailsAndDownloadSection = ({ title, order, status, data, isLoading, campaignId }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { isFinished, codesCreationRequestId, codesCsvFileUrl } = data;

  const codesState = useMemo(() => {
    if (!isFinished && !codesCreationRequestId) {
      return GENERATION_CODES_STATE.SET_DETAILS;
    }
    if (!isFinished && codesCreationRequestId) {
      return GENERATION_CODES_STATE.PROCESSING;
    }
    return GENERATION_CODES_STATE.DOWNLOAD_CSV;
  }, [isFinished, codesCreationRequestId]);

  const handleGenerate = useCallback(
    (codesAmount, codesExpirationDate) => {
      dispatch(swagDigitalCodesSetStep({ step: GSD_STEP_2, data: { codesAmount, codesExpirationDate } }));
      if (campaignId) {
        dispatch(swagDigitalGenerateCodesRequest(campaignId));
      }
    },
    [campaignId, dispatch],
  );

  const handleCloseSidebar = useCallback(() => {
    dispatch(createCampaignSidebarClose());
  }, [dispatch]);

  if (status === GENERATE_SWAG_DIGITAL_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === GENERATE_SWAG_DIGITAL_STATES.COMPLETED) {
    return (
      <CompletedSection order={order} title={title} status={status} campaignId={campaignId}>
        {codesState === GENERATION_CODES_STATE.PROCESSING && 'Generation codes in progress'}
        {codesState === GENERATION_CODES_STATE.DOWNLOAD_CSV && 'Digital codes are ready'}
      </CompletedSection>
    );
  }

  return (
    <>
      {codesState !== GENERATION_CODES_STATE.DOWNLOAD_CSV && (
        <CampaignSidebarSectionAvatar status={status} avatar={order} />
      )}
      {codesState === GENERATION_CODES_STATE.SET_DETAILS && (
        <SetBatchDetails
          isLoading={isLoading}
          title={title}
          classes={classes}
          data={data}
          handleGenerate={handleGenerate}
        />
      )}
      {codesState === GENERATION_CODES_STATE.PROCESSING && (
        <CreateCodesProcessing
          campaignId={campaignId}
          requestId={codesCreationRequestId}
          classes={classes}
          createdCodesAmount={parseInt(data.createdCodesAmount, 10)}
          codesAmount={data.codesAmount}
        />
      )}
      {codesState === GENERATION_CODES_STATE.DOWNLOAD_CSV && (
        <DownloadCsvCodes classes={classes} csvUrl={codesCsvFileUrl} handleCloseSidebar={handleCloseSidebar} />
      )}
    </>
  );
};

SetDetailsAndDownloadSection.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  order: PropTypes.number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  data: PropTypes.any,
  isLoading: PropTypes.bool.isRequired,
  campaignId: PropTypes.number,
};

SetDetailsAndDownloadSection.defaultProps = {
  data: {},
  campaignId: undefined,
};

export default SetDetailsAndDownloadSection;
