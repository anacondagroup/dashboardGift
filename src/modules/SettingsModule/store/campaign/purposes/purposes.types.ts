export type TPurposeOption = string;
export type TNumberOfRecipientsOption = string;

export interface IPurposesOptionsResponse {
  campaignPurposes: TPurposeOption[];
  numberOfRecipients: TNumberOfRecipientsOption[];
}
