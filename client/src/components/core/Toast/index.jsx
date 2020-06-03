import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';

const StyledToastContainer = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress',
})`
  button[aria-label='close'] {
    color: rgb(255, 255, 255);
  }

  .toast {
    border-radius: 4px;
    padding: 6px 16px;
    padding-right: 6px;
    line-height: 1.43;
    min-height: auto;

    &.top-offset {
      top: 10em;
    }
  }
  .body {
    padding: 8px 0;
  }
  .progress {
    background: rgba(0, 136, 169, 1);
  }

  .Toastify__toast--dark {
    background-color: rgb(36, 37, 42);
    color: rgb(255, 255, 255);
  }
`;

export default StyledToastContainer;
