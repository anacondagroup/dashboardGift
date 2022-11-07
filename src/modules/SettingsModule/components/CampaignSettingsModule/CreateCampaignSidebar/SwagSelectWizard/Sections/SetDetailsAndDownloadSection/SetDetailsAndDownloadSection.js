import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import { useDispatch } from 'react-redux';
import { useRouting } from '@alycecom/hooks';

import {
  SS_GENERATE_CODES_STEP,
  SWAG_SELECT_FLOW_STATES,
} from '../../../../../../../../constants/swagSelect.constants';
import UntouchedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/UntouchedSection/UntouchedSection';
import CompletedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/CompletedSection/CompletedSection';
import SkippedSection from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSection/SkippedSection/SkippedSection';
import CampaignSidebarSectionAvatar from '../../../../../CampaignSettings/CreateCampaignSidebar/CampaignSidebarSectionAvatar/CampaignSidebarSectionAvatar';
import {
  swagSelectChangeStep,
  swagSelectGenerateCodesRequest,
  swagSelectSetStepData,
} from '../../../../../../store/campaign/swagSelect/swagSelect.actions';
import { createCampaignSidebarClose } from '../../../../../../store/campaign/createCampaignSidebar/createCampaignSidebar.actions';
import { StandardCampaignRoutes } from '../../../../../StandardCampaignModule/routePaths';

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
  const go = useRouting();
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
    (codesBatchName, codesAmount, codesExpirationDate) => {
      dispatch(
        swagSelectSetStepData({
          step: SS_GENERATE_CODES_STEP,
          data: { codesBatchName, codesAmount, codesExpirationDate },
        }),
      );
      if (campaignId) {
        dispatch(swagSelectGenerateCodesRequest(campaignId));
      }
    },
    [campaignId, dispatch],
  );

  const handleCloseAndGoToSettings = useCallback(() => {
    go(StandardCampaignRoutes.buildEditorUrl(campaignId));
    dispatch(createCampaignSidebarClose());
  }, [campaignId, dispatch, go]);

  if (status === SWAG_SELECT_FLOW_STATES.UNTOUCHED) {
    return <UntouchedSection order={order} title={title} status={status} />;
  }

  if (status === SWAG_SELECT_FLOW_STATES.COMPLETED) {
    return (
      <CompletedSection
        order={order}
        title={title}
        status={status}
        campaignId={campaignId}
        handleEdit={() => dispatch(swagSelectChangeStep({ next: SS_GENERATE_CODES_STEP }))}
        rButtonText="View"
      >
        {codesState === GENERATION_CODES_STATE.PROCESSING && 'Generation codes in progress'}
        {codesState === GENERATION_CODES_STATE.DOWNLOAD_CSV && 'Digital codes are ready'}
      </CompletedSection>
    );
  }

  if (status === SWAG_SELECT_FLOW_STATES.SKIPPED) {
    return (
      <SkippedSection order={order} title={title} status={status} campaignId={campaignId}>
        {data.campaignName}
      </SkippedSection>
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
          createdCodesAmount={data.createdCodesAmount}
          codesAmount={data.codesAmount}
        />
      )}
      {codesState === GENERATION_CODES_STATE.DOWNLOAD_CSV && (
        <DownloadCsvCodes
          classes={classes}
          csvUrl={codesCsvFileUrl}
          handleCloseAndGoToSettings={handleCloseAndGoToSettings}
        />
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
