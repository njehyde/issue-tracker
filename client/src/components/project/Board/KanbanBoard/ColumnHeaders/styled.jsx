import styled from 'styled-components';

const Container = styled.div`
  &.fixed {
    position: absolute;
    left: 0;
    top: 0;
  }
  &.sticky {
    position: -ms-sticky;
    position: -webkit-sticky;
    position: sticky;
  }
`;

const Header = styled.li`
  background: #f4f5f7;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  display: table-cell;
  list-style: none;
  margin: 0;
  position: relative;
  vertical-align: top;
  border-radius: 4px 4px 0 0;
  padding: 10px;
  border-bottom-width: 5px;

  .column-header-flex {
    display: flex;
    flex-wrap: wrap;
  }

  .column-header-flex-1 {
    display: flex;
    max-width: 100%;
  }

  h2 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    margin: 0 5px 0 0;
    word-wrap: break-word;
    color: #5e6c84;
    font-size: 0.85714286em;
    line-height: 1.33333333;
    text-transform: uppercase;
    display: inline-block;
    font-weight: normal;
    margin-top: 3px;
    flex: 0 100 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    letter-spacing: -0.24px;
  }
`;

const HeadersGroup = styled.ul`
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-spacing: 10px 0;
  display: table;
  list-style: none;
  margin: 0;
  table-layout: fixed;
  width: 100%;
  padding: 0;
  margin: 0;
`;

export default {
  Container,
  Header,
  HeadersGroup,
};
