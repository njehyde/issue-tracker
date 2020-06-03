import styled from 'styled-components';
import { Flex } from 'rebass';
import { ArrowRight, Calendar } from 'react-feather';

const ArrowRightIcon = styled(ArrowRight)`
  color: rgba(0, 136, 169, 1);
`;

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
  ArrowRightIcon,
  CalendarIcon,
  Container,
};

export default Styled;
