import styled, { css } from 'styled-components';
import { ChevronLeft, ChevronRight } from 'react-feather';

const Popover = styled.ul`
  ${props =>
    css`
      display: none;
      opacity: 0;
      top: 0;
      left: 0;
      position: absolute;
      background-color: rgba(255, 255, 255, 1);
      color: rgba(47, 79, 79, 1);
      box-shadow: rgba(0, 0, 0, 0.05) 0px 2px 6px, rgba(0, 0, 0, 0.07) 0px 0px 0px 1px !important;
      border-radius: 3px;
      overflow-x: hidden;
      overflow-y: auto;
      z-index: 200;
      ${props.show && `opacity: 1;`}
      ${props.open && `display: block;`}
      ${props?.anchorPosition?.top && `top: ${props.anchorPosition.top}px;`}
      ${props?.anchorPosition?.left && `left: ${props.anchorPosition.left}px;`}
    `}
`;

const Wrapper = styled.div`
  z-index: 1 !important;
  background-color: rgb(255, 255, 255) !important;
  & > .inner {
    position: relative !important;
    text-align: left !important;
    background: rgb(255, 255, 255) !important;
  }
`;

const DaysHeadersContainer = styled.div`
  position: relative !important;
  margin-left: 9px !important;
`;

const DaysHeader = styled.div`
  ${props =>
    css`
      color: rgb(117, 117, 117) !important;
      position: absolute !important;
      top: 62px !important;
      z-index: 2 !important;
      text-align: left !important;
      ${props.left &&
        `
        left: 0px; 
        padding: 0px 13px;
      `}
      ${props.right &&
        `
        left: 300px;
        padding: 0px 13px;
      `}
      & > ul {
        padding-left: 0px !important;
        padding-right: 0px !important;
        font-size: 14px !important;
        list-style: none !important;
        margin: 1px 0px !important;
        & > li {
          display: inline-block !important;
          text-align: center !important;
          width: 39px;
        }
      }
    `}
`;

const Container = styled.div`
  outline: none !important;
`;

const NavContainer = styled.div`
  position: relative !important;
  z-index: 2 !important;
  height: 0px !important;
`;

const NavButton = styled.button`
  ${props =>
    css`
      position: absolute !important;
      top: 18px !important;
      ${props.left && 'left: 22px;'}
      ${props.right && 'right: 22px;'}
      border: 0;
      cursor: pointer;
      color: palevioletred;
      margin: 0;
      display: inline-flex;
      outline: 0;
      align-items: center;
      user-select: none;
      vertical-align: middle;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      font-size: 0.875rem;
      transition: background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
        border 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
      line-height: 1.75;
      border-radius: 50%;
      background-color: #f4f5f7;
    `}
`;

const Body = styled.div`
  ${props =>
    css`
      position: relative !important;
      overflow: hidden !important;
      border-radius: 3px !important;
      ${props.height && `height: ${props.height}px;`}
      transition: height 0.2s ease-in-out 0s !important;
    `}
`;

const Carousel = styled.div`
  ${props =>
    css`
      text-align: left !important;
      z-index: ${props.active ? '1 !important;' : '0 !important;'}
      background: rgb(255, 255, 255) !important;
      padding: 0 9px;
    `}
`;

const MonthContainer = styled.div`
  ${props =>
    css`
      width: 300px;
      display: inline-block !important;
      vertical-align: top !important;
      min-height: 100% !important;
      ${props.left &&
        `
        position: absolute !important;
        z-index: -1 !important;
        opacity: 0 !important;
        pointer-events: none !important;
        visibility: hidden !important;
      `}
      ${props.right &&
        `
        visibility: hidden !important;
      `}
    `}
`;

const MonthHeader = styled.div`
  color: rgb(72, 72, 72) !important;
  font-size: 18px !important;
  text-align: center !important;
  padding-top: 22px !important;
  padding-bottom: 37px !important;
  caption-side: initial !important;
`;

const MonthBody = styled.div`
  text-align: center !important;
  vertical-align: top !important;
  user-select: none !important;
  background: rgb(255, 255, 255) !important;
  padding: 0px 13px;
  padding-bottom: 1rem;
`;

const WeekOfMonth = styled.tr``;

const DayOfWeek = styled.td`
  ${props =>
    css`
      width: 39px;
      height: 39px;
      text-align: center;
      vertical-align: middle;
      border: none;

      ${props.show && `border: solid 1px rgb(228, 231, 231);`}
      ${!props.disabled &&
        `
        &:hover {
          background-color: rgb(228, 231, 231);
          cursor: pointer;
        }
      `}
      ${(props.isBetweenSelected || props.isBetweenHovered) &&
        !props.unavailable &&
        `
        border-color: rgb(96, 181, 201);
        background-color: rgb(128, 196, 212);
        color: rgba(255,255,255,1);
        ${!props.disabled &&
          `
          &:hover {
            background-color: rgb(64, 166, 190);
            color: rgba(255,255,255,1);
            cursor: pointer;
          }
        `}
      `}
      ${props.selected &&
        !props.unavailable &&
        `
        border-color: rgba(0, 119, 148,1);
        background-color: rgba(0,136,169,1);
        color: rgba(255,255,255,1);
        ${!props.disabled &&
          `
          &:hover {
            background-color: rgba(0,136,169,1);
            color: rgba(255,255,255,1);
            cursor: default;
          }
        `}
      `}
      ${props.unavailable &&
        `
        color: rgba(47,79,79,0.3);
        &:hover {
          background-color: rgba(255,255,255,1);
          cursor: default;
        }
      `}
    `}
`;

const PreviousMonth = styled(ChevronLeft)`
  color: rgba(0, 136, 169, 1);
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 2rem;
  flex-shrink: 0;
  user-select: none;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

const NextMonth = styled(ChevronRight)`
  color: rgba(0, 136, 169, 1);
  width: 1em;
  height: 1em;
  display: inline-block;
  font-size: 2rem;
  flex-shrink: 0;
  user-select: none;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

const Styled = {
  Body,
  Carousel,
  Container,
  DaysHeader,
  DaysHeadersContainer,
  DayOfWeek,
  MonthBody,
  MonthContainer,
  MonthHeader,
  NavButton,
  NavContainer,
  NextMonth,
  Popover,
  PreviousMonth,
  WeekOfMonth,
  Wrapper,
};

export default Styled;
