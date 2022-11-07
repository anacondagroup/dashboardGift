import { Control } from 'react-hook-form';

export interface IFieldProps {
  control: Control;
  disabled?: boolean;
  error?: string;
}
