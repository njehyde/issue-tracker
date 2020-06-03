import styled from 'styled-components';
import { Box } from 'rebass';

const ButtonGroup = styled(Box)`
  & button:nth-of-type(2) {
    margin-left: 0.25rem;
  }
`;

const CreatedBy = styled(Box)`
  line-height: 2rem;
  color: rgb(107, 119, 140);
  font-weight: 600;
`;

const Duration = styled(Box)`
  line-height: 2.1rem;
  font-size: 0.9rem;
`;

const Text = styled.div`
  line-height: 2rem;
`;

export default {
  ButtonGroup,
  CreatedBy,
  Duration,
  Text,
};
