import { Control, UseFormSetValue, UseFormTrigger, UseFormWatch } from 'react-hook-form';

import { TCustomMarketplaceForm } from '../../../store/customMarketplace/customMarketplace.types';

export type TFormMethods = 'trigger' | 'watch' | 'setValue';

export interface IField {
  control: Control<TCustomMarketplaceForm>;
  error?: string;
}

export interface IFormMethods {
  trigger?: UseFormTrigger<TCustomMarketplaceForm>;
  watch?: UseFormWatch<TCustomMarketplaceForm>;
  setValue?: UseFormSetValue<TCustomMarketplaceForm>;
}

export type IFieldProps<Methods extends TFormMethods = never, CanBeDisabled extends boolean = true> = Required<
  Pick<IFormMethods, Methods>
> &
  (CanBeDisabled extends true ? IField & { disabled?: boolean } : IField);
