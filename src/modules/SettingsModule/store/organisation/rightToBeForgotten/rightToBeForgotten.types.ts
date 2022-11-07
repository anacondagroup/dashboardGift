import { TErrors } from '@alycecom/services';

// FIXME: update typescript-eslint https://github.com/typescript-eslint/tslint-to-eslint-config/issues/856
// eslint-disable-next-line no-shadow
export enum ForgottenChoice {
  ForgetData = 'forget_data',
  ExportData = 'export_data',
  RestrictProcessing = 'restrict_processing',
}

export type TForgottenRequestData = {
  email: string;
  firstName: string;
  lastName: string;
  choice: ForgottenChoice;
  complianceAccepted: boolean;
};

export type TForgottenRequestErrors = Partial<TErrors<TForgottenRequestData>>;
