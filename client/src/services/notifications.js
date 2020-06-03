import { toast } from 'react-toastify';

import {
  defaultQueryErrorMessage,
  defaultMutationErrorMessage,
} from 'constants';

export const showInfoAlert = (message, options = {}) => {
  toast.dark(message, {
    position: 'bottom-right',
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

export const showErrorAlert = (message, options = {}) => {
  toast.error(message, {
    className: 'toast top-offset',
    position: 'top-center',
    transition: false,
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

export const showQueryErrorAlert = (
  message = defaultQueryErrorMessage,
  options = {},
) => {
  toast.error(message, {
    className: 'toast top-offset',
    position: 'top-center',
    transition: false,
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};

export const showMutationErrorAlert = (
  message = defaultMutationErrorMessage,
  options = {},
) => {
  toast.error(message, {
    className: 'toast top-offset',
    position: 'top-center',
    transition: false,
    autoClose: false,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    ...options,
  });
};
