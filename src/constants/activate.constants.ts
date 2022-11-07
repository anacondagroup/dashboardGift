export const ACTIVATE_FLOW_STATES = {
  ACTIVE: 'ACTIVE',
  UNTOUCHED: 'UNTOUCHED',
  SKIPPED: 'SKIPPED',
  COMPLETED: 'COMPLETED',
} as const;

export const RECIPIENT_LIST_PROCESSING_STATES = {
  COMPLETE: 'complete',
  PROCESS: 'process',
  ERROR: 'error',
} as const;
