import styled from 'styled-components';
import { Box } from 'rebass';

const ButtonGroup = styled(Box)`
  & button:nth-of-type(2) {
    margin-left: 0.25rem;
  }
`;

export default {
  ButtonGroup,
};
