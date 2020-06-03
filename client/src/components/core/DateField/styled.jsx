import styled from 'styled-components';
import { Flex } from 'rebass';
import { Calendar } from 'react-feather';

const CalendarIcon = styled(Calendar)`
  color: palevioletred;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

const Container = styled(Flex)`
  line-height: 1.2;
`;

const Styled = {
  CalendarIcon,
  Container,
};

export default Styled;
