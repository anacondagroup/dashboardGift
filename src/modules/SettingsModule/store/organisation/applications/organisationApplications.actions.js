import {
  ORGANISATION_APPLICATIONS,
  ORGANISATION_APPLICATIONS_CREATE,
  ORGANISATION_APPLICATIONS_UPDATE,
} from './organisationApplications.types';

/** organisation applications loading */
export const organisationApplicationsRequest = () => ({
  type: ORGANISATION_APPLICATIONS.REQUEST,
});

export const organisationApplicationsSuccess = applications => ({
  type: ORGANISATION_APPLICATIONS.SUCCESS,
  payload: applications,
});

export const organisationApplicationsFail = error => ({
  type: ORGANISATION_APPLICATIONS.FAIL,
  payload: error,
});

/** Create auth applications actions */
export const organisationApplicationsCreate = request => ({
  type: ORGANISATION_APPLICATIONS_CREATE.REQUEST,
  payload: request,
});
export const organisationApplicationsCreateSuccess = application => ({
  type: ORGANISATION_APPLICATIONS_CREATE.SUCCESS,
  payload: application,
});
export const organisationApplicationsCreateFail = errors => ({
  type: ORGANISATION_APPLICATIONS_CREATE.FAIL,
  payload: errors,
});

/** Update auth applications actions */
export const organisationApplicationsUpdate = applicationId => ({
  type: ORGANISATION_APPLICATIONS_UPDATE.REQUEST,
  payload: applicationId,
});
export const organisationApplicationsUpdateSuccess = request => ({
  type: ORGANISATION_APPLICATIONS_UPDATE.SUCCESS,
  payload: request,
});
export const organisationApplicationsUpdateFail = request => ({
  type: ORGANISATION_APPLICATIONS_UPDATE.FAIL,
  payload: request,
});
