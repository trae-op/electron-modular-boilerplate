export type TFormState = {
  errors?: Record<string, string[]>;
  message?: string;
  success?: boolean;
};

export type TMessageFieldProps = {
  defaultValue?: string;
  error?: string[];
};

export type TSubmitButtonProps = {
  label?: string;
};

export type TConfirmFormProps = {
  onSuccess?: (data: { transformedMessage: string; timestamp: number }) => void;
};
