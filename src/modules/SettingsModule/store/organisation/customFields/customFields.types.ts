export type TCustomField = {
  label: string;
  name: string;
  required: boolean;
  active: boolean;
  isFake?: boolean;
};

export type TFakeCustomField = TCustomField & {
  isFake: true;
};

export type TGetCustomFieldResponse = {
  data: TCustomField[];
};

export type TCustomFieldFormErrors = Partial<Record<keyof TCustomField, string[]>>;

export type TCustomFieldResponseError = {
  error?: {
    message: string;
    code: string | number;
    errors: TCustomFieldFormErrors;
  };
};
