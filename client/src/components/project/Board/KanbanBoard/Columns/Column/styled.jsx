import styled from 'styled-components';

const Column = styled.li`
  padding: 1px 5px 5px 5px;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table-cell;
  list-style: none;
  margin: 0;
  position: relative;
  vertical-align: top;
  -webkit-border-radius: 0 0 4px 4px;
  border-radius: 0 0 4px 4px;
  background: #f4f5f7;
`;

const Container = styled.div`
  width: 100%;
  height: inherit;
  position: absolute;
  top: 0;
  left: 0;
`;

const Outer = styled.div`
  min-height: 79px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export default {
  Column,
  Container,
  Outer,
};
