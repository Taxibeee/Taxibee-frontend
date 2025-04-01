export interface ContactUsProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  formData: {
    name: string;
    email: string;
    message: string;
  };
  isSubmitting: boolean;
}