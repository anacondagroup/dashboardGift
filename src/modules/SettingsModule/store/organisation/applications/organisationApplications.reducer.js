import {
  ORGANISATION_APPLICATIONS,
  ORGANISATION_APPLICATIONS_CREATE,
  ORGANISATION_APPLICATIONS_UPDATE,
} from './organisationApplications.types';

const initialState = {
  isLoading: false,
  isLoaded: false,
  applications: [],
  errors: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ORGANISATION_APPLICATIONS.REQUEST:
    case ORGANISATION_APPLICATIONS_UPDATE.REQUEST:
    case ORGANISATION_APPLICATIONS_CREATE.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        errors: {},
      };
    case ORGANISATION_APPLICATIONS.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        applications: action.payload,
        errors: {},
      };
    case ORGANISATION_APPLICATIONS.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        errors: action.payload,
      };
    case ORGANISATION_APPLICATIONS_UPDATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        applications: state.applications.map(app => {
          if (app.applicationId === action.payload.applicationId) {
            return action.payload;
          }
          return app;
        }),
        errors: {},
      };
    case ORGANISATION_APPLICATIONS_UPDATE.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        errors: action.payload,
      };
    case ORGANISATION_APPLICATIONS_CREATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        applications: [action.payload, ...state.applications],
        errors: {},
      };
    case ORGANISATION_APPLICATIONS_CREATE.FAIL:
      return {
        ...state,
        isLoading: false,
        isLoaded: false,
        errors: action.payload,
      };
    default:
      return state;
  }
};
