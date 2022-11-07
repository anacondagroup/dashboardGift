import {
  SWAG_DIGITAL_CODES_CHANGE_STEP,
  SWAG_DIGITAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  SWAG_DIGITAL_CODES_SET_STEP_DATA,
  SWAG_DIGITAL_GENERATE_CODES_FAIL,
  SWAG_DIGITAL_GENERATE_CODES_REQUEST,
  SWAG_DIGITAL_GENERATE_CODES_SUCCESS,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FAIL,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_REQUEST,
  SWAG_DIGITAL_GENERATION_CODES_PROGRESS_SUCCESS,
  SWAG_DIGITAL_UPDATE_BATCHES_FAIL,
  SWAG_DIGITAL_UPDATE_BATCHES_REQUEST,
  SWAG_DIGITAL_UPDATE_BATCHES_SUCCESS,
} from './swagDigitalCodes.types';

export const swagDigitalCodesGenerateFlowWizardRequest = payload => ({
  type: SWAG_DIGITAL_CODES_GENERATE_FLOW_WIZARD_REQUEST,
  payload,
});

export const swagDigitalCodesChangeStep = payload => ({
  type: SWAG_DIGITAL_CODES_CHANGE_STEP,
  payload,
});

export const swagDigitalCodesSetStep = payload => ({
  type: SWAG_DIGITAL_CODES_SET_STEP_DATA,
  payload,
});

export const swagDigitalGenerateCodesRequest = payload => ({
  type: SWAG_DIGITAL_GENERATE_CODES_REQUEST,
  payload,
});

export const swagDigitalGenerateCodesSuccess = payload => ({
  type: SWAG_DIGITAL_GENERATE_CODES_SUCCESS,
  payload,
});

export const swagDigitalGenerateCodesFail = payload => ({
  type: SWAG_DIGITAL_GENERATE_CODES_FAIL,
  payload,
});

export const swagDigitalGenerationCodesProgressRequest = payload => ({
  type: SWAG_DIGITAL_GENERATION_CODES_PROGRESS_REQUEST,
  payload,
});

export const swagDigitalGenerationCodesProgressSuccess = payload => ({
  type: SWAG_DIGITAL_GENERATION_CODES_PROGRESS_SUCCESS,
  payload,
});

export const swagDigitalGenerationCodesProgressFail = payload => ({
  type: SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FAIL,
  payload,
});

export const swagDigitalGenerationCodesProgressFinish = payload => ({
  type: SWAG_DIGITAL_GENERATION_CODES_PROGRESS_FINISH,
  payload,
});

export const swagDigitalUpdateBatchesRequest = payload => ({
  type: SWAG_DIGITAL_UPDATE_BATCHES_REQUEST,
  payload,
});

export const swagDigitalUpdateBatchesSuccess = payload => ({
  type: SWAG_DIGITAL_UPDATE_BATCHES_SUCCESS,
  payload,
});

export const swagDigitalUpdateBatchesFail = payload => ({
  type: SWAG_DIGITAL_UPDATE_BATCHES_FAIL,
  payload,
});
