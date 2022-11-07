import * as R from 'ramda';

import {
  INTEGRATIONS_MARKETO,
  INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE,
  INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED,
  INTEGRATIONS_MARKETO_ACTIVITIES_SYNC,
  INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS,
  INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT,
  INTEGRATIONS_MARKETO_CREATE,
  INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC,
  INTEGRATIONS_MARKETO_DISCONNECT,
  INTEGRATIONS_MARKETO_ITEM,
  INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE,
  INTEGRATIONS_MARKETO_UPDATE,
  INTEGRATIONS_MARKETO_WEBHOOKS,
} from './marketo.types';

const initialState = {
  isLoading: false,
  isSyncLoading: false,
  isLoaded: false,
  isSyncActive: false,
  integrations: [],
  apiData: {
    uuid: null,
    status: null,
    statusDescription: null,
    apiUrl: null,
    clientId: null,
    clientSecret: null,
    createdAt: null,
    updatedAt: null,
  },
  customObjects: {
    alyceGift: {
      isLoading: false,
      value: undefined,
      error: undefined,
      syncErrors: undefined,
    },
  },
  webhooks: {
    values: undefined,
    isLoading: false,
    error: undefined,
  },
  lastSyncAt: null,
  enabledActivities: [],
  availableActivities: [],
  errors: {},
  syncErrors: {},
};

export const marketo = (state = initialState, action) => {
  switch (action.type) {
    case INTEGRATIONS_MARKETO.REQUEST:
    case INTEGRATIONS_MARKETO_ITEM.REQUEST:
    case INTEGRATIONS_MARKETO_UPDATE.REQUEST:
    case INTEGRATIONS_MARKETO_DISCONNECT.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.REQUEST:
      return {
        ...state,
        isSyncLoading: true,
        isLoaded: false,
      };
    case INTEGRATIONS_MARKETO_CREATE.REQUEST:
      return {
        ...state,
        isLoading: true,
        isLoaded: false,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.SUCCESS:
      return {
        ...state,
        isSyncLoading: false,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.REQUEST:
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.REQUEST:
      return {
        ...state,
        isSyncLoading: true,
        syncErrors: {},
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.SUCCESS:
      return {
        ...state,
        isSyncLoading: false,
        lastSyncAt: action.payload.completedAt || null,
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC_STATUS.FAIL:
      return {
        ...state,
        isSyncLoading: false,
        syncErrors: action.payload,
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_SYNC.FAIL:
      return {
        ...state,
        isSyncLoading: false,
        isLoaded: true,
        errors: action.payload,
      };
    case INTEGRATIONS_MARKETO.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        integrations: action.payload,
        apiData: action.payload.length ? state.apiData : {},
        errors: {},
      };
    case INTEGRATIONS_MARKETO_DISCONNECT.SUCCESS:
      return {
        ...initialState,
      };
    case INTEGRATIONS_MARKETO_ITEM.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        apiData: action.payload,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_CREATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoaded: true,
        apiData: action.payload,
        errors: {},
      };
    case INTEGRATIONS_MARKETO.FAIL:
    case INTEGRATIONS_MARKETO_CREATE.FAIL:
    case INTEGRATIONS_MARKETO_DISCONNECT.FAIL:
    case INTEGRATIONS_MARKETO_UPDATE.FAIL:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
      };
    case INTEGRATIONS_MARKETO_ITEM.FAIL:
      return {
        ...state,
        isLoading: false,
        errors: action.payload,
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.REQUEST:
      return {
        ...state,
        isSyncLoading: true,
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_ENABLED.SUCCESS:
      return {
        ...state,
        isSyncLoading: false,
        enabledActivities: action.payload,
      };
    case INTEGRATIONS_MARKETO_ACTIVITIES_AVAILABLE.SUCCESS:
      return {
        ...state,
        isSyncLoading: false,
        availableActivities: action.payload,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_WEBHOOKS.REQUEST:
      return {
        ...state,
        webhooks: {
          values: undefined,
          isLoading: true,
          error: undefined,
        },
      };
    case INTEGRATIONS_MARKETO_WEBHOOKS.SUCCESS:
      return {
        ...state,
        webhooks: {
          values: action.payload,
          isLoading: false,
          error: undefined,
        },
      };
    case INTEGRATIONS_MARKETO_WEBHOOKS.FAIL:
      return {
        ...state,
        webhooks: {
          values: undefined,
          isLoading: false,
          error: action.payload,
        },
      };
    case INTEGRATIONS_MARKETO_UPDATE.SUCCESS:
      return {
        ...state,
        isLoading: false,
        apiData: action.payload,
        errors: {},
      };
    case INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.REQUEST: {
      const { customObjects } = state;
      return {
        ...state,
        customObjects: {
          ...customObjects,
          alyceGift: {
            isLoading: true,
            value: undefined,
            error: undefined,
          },
        },
      };
    }
    case INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.SUCCESS: {
      const { customObjects } = state;
      return {
        ...state,
        customObjects: {
          ...customObjects,
          alyceGift: {
            isLoading: false,
            value: action.payload.active,
            error: undefined,
          },
        },
      };
    }
    case INTEGRATIONS_MARKETO_ALYCE_GIFT_OBJECT.FAIL: {
      const { customObjects } = state;
      return {
        ...state,
        customObjects: {
          ...customObjects,
          alyceGift: {
            isLoading: false,
            value: undefined,
            error: action.payload,
          },
        },
      };
    }
    case INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.SUCCESS: {
      if (!action.payload) {
        return state;
      }
      const { customObjects } = state;
      const objectKeys = Object.keys(customObjects);
      const updatedObjects = objectKeys.reduce(
        (objects, key) => ({
          ...objects,
          [key]: { ...customObjects[key], isLoading: false, syncErrors: action.payload[key] },
        }),
        {},
      );
      return {
        ...state,
        customObjects: {
          ...customObjects,
          ...updatedObjects,
        },
      };
    }
    case INTEGRATIONS_MARKETO_CUSTOM_OBJECTS_SYNC.FAIL:
      return {
        ...state,
        isSyncLoading: false,
        isLoaded: true,
        errors: action.payload,
      };
    case INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.REQUEST: {
      const { customObjects } = state;
      const apiObject = customObjects[action.payload.customObjectName];
      customObjects[action.payload.customObjectName] = { ...apiObject, isLoading: true };
      return {
        ...state,
        customObjects: R.clone(customObjects),
      };
    }
    case INTEGRATIONS_MARKETO_SET_CUSTOM_OBJECT_STATE.SUCCESS: {
      const { customObjects } = state;
      return {
        ...state,
        customObjects: {
          ...customObjects,
          [action.payload.customObjectName]: {
            value: action.payload.newValue,
            isLoading: false,
            error: undefined,
            syncErrors: undefined,
          },
        },
      };
    }
    default:
      return state;
  }
};
