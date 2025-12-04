import { toast } from 'react-toastify';

export const handleApiError = (error: unknown, defaultMessage = 'An error occurred') => {
  const message = error instanceof Error ? error.message : defaultMessage;
  toast.error(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
  console.error(error);
  return message;
};

export const handleApiSuccess = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};
