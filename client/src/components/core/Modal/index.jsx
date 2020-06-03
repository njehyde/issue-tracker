import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Flex, Box } from 'rebass';
import { X } from 'react-feather';

import { Heading } from 'components/styled';

const StyledOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(9, 30, 66, 0.54);
  transition: opacity 0.2s ease;
  z-index: 100;
  ${props =>
    props.show &&
    css`
      display: block;
    `}
`;

const getWidthForModalSize = (width, percentage) => css`
  width: calc(${width}px * ${percentage});
`;

const StyledModal = styled.div`
  display: none;
  position: fixed;
  top: 50%;
  left: 50%;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 6px;
  transform: translate(-50%, -50%);
  transition: transform, width 0.2s ease;
  box-shadow: rgba(9, 30, 66, 0.08) 0px 0px 0px 1px,
    rgba(9, 30, 66, 0.08) 0px 2px 1px, rgba(9, 30, 66, 0.31) 0px 0px 20px -6px;
  font-family: Helvetica, Arial, sans-serif;
  z-index: 200;

  ${props =>
    props.show &&
    css`
      display: block;
    `}

  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    width: 600px;
    ${props => props.xs && getWidthForModalSize(600, 0.25)}
    ${props => props.s && getWidthForModalSize(600, 0.35)}
    ${props => props.m && getWidthForModalSize(600, 0.5)}
    ${props => props.l && getWidthForModalSize(600, 0.75)}
  }
  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    width: 600px;
    ${props => props.xs && getWidthForModalSize(600, 0.25)}
    ${props => props.s && getWidthForModalSize(600, 0.35)}
    ${props => props.m && getWidthForModalSize(600, 0.5)}
    ${props => props.l && getWidthForModalSize(600, 0.75)}
  }
  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    width: 768px;
    ${props => props.xs && getWidthForModalSize(768, 0.25)}
    ${props => props.s && getWidthForModalSize(768, 0.35)}
    ${props => props.m && getWidthForModalSize(768, 0.5)}
    ${props => props.l && getWidthForModalSize(768, 0.75)}
  }
  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    width: 992px;
    ${props => props.xs && getWidthForModalSize(992, 0.25)}
    ${props => props.s && getWidthForModalSize(992, 0.35)}
    ${props => props.m && getWidthForModalSize(992, 0.5)}
    ${props => props.l && getWidthForModalSize(992, 0.75)}
  }
  /* Extra large devices (large laptops and desktops, 1200px and up) */
  @media only screen and (min-width: 1200px) {
    width: 1200px;
    ${props => props.xs && getWidthForModalSize(1200, 0.25)}
    ${props => props.s && getWidthForModalSize(1200, 0.35)}
    ${props => props.m && getWidthForModalSize(1200, 0.5)}
    ${props => props.l && getWidthForModalSize(1200, 0.75)}
  }
`;

const StyledModalContainer = styled.div`
  position: relative;
`;

const StyledX = styled(X)`
  color: palevioletred;
  cursor: pointer;
  transition: transform 0.15s ease-in-out;
  &:hover {
    transform: scale(1.5);
  }
`;

const StyledHeader = styled(Flex)`
  box-shadow: rgb(235, 236, 240) 0px 2px 0px 0px;
`;

const StyledBody = styled(Flex)`
  overflow-y: auto;
  max-height: 75vh;
`;

const Modal = ({ title, children, show, closeModal, ...otherProps }) => {
  const modal = (
    <>
      <StyledOverlay show={show}>
        <StyledModal {...otherProps} show={show}>
          <StyledModalContainer>
            <StyledHeader pl="2rem" pr="1.5rem" py="1.5rem">
              <Box flex="1 1 auto">
                <Heading.H3>{title}</Heading.H3>
              </Box>
              <Box>
                <StyledX onClick={closeModal} />
              </Box>
            </StyledHeader>
            <StyledBody p="2rem">
              <Box flex="1 1 auto">{show && children}</Box>
            </StyledBody>
          </StyledModalContainer>
        </StyledModal>
      </StyledOverlay>
    </>
  );
  return ReactDOM.createPortal(modal, document.getElementById('modal-root'));
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
};

export default Modal;
