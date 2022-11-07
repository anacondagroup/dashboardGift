import { TFakeCustomField } from './customFields.types';

export const generateFakeCustomFields = (count: number): TFakeCustomField[] =>
  Array.from({ length: count }, () => ({ isFake: true, label: '', name: '', required: false, active: false }));
