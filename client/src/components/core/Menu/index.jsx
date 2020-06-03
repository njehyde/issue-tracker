import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

const StyledMenu = styled.ul`
  display: none;
  opacity: 0;
  top: 0;
  left: 0;
  position: absolute;
  background-color: rgba(255, 255, 255, 1);
  color: rgba(47, 79, 79, 1);
  box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, 0.2),
    0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
  padding: 8px 0px;
  overflow-x: hidden;
  overflow-y: auto;
  z-index: 200;

  ${props =>
    props.show &&
    css`
      opacity: 1;
    `}
  ${props =>
    props.open &&
    css`
      display: block;
    `}
  ${props => {
    return (
      props?.anchorPosition?.top &&
      css`
        top: ${props.anchorPosition.top}px;
      `
    );
  }}
  ${props =>
    props?.anchorPosition?.left &&
    css`
      left: ${props.anchorPosition.left}px;
    `}
`;

const Menu = ({ open, anchorPosition, onClose, children }) => {
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState();
  const menuRef = useRef(null);

  const handleClick = e => {
    if (menuRef.current.contains(e.target)) {
      return;
    }
    onClose();
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false);
    return () => {
      document.removeEventListener('mousedown', handleClick, false);
    };
  });

  useEffect(() => {
    let updatedPosition = { ...anchorPosition };
    const { innerWidth, innerHeight } = window;
    const {
      offsetLeft = 0,
      offsetTop = 0,
      offsetWidth = 0,
      offsetHeight = 0,
    } = menuRef?.current;

    if (offsetLeft + offsetWidth >= innerWidth) {
      updatedPosition = {
        ...updatedPosition,
        left: position.left - offsetWidth,
      };
    }
    if (offsetTop + offsetHeight >= innerHeight) {
      updatedPosition = {
        ...updatedPosition,
        top: position.top - offsetHeight,
      };
    }
    setPosition(updatedPosition);

    setShow(open);
  }, [menuRef.current]);

  const menu = (
    <StyledMenu ref={menuRef} open={open} show={show} anchorPosition={position}>
      {children}
    </StyledMenu>
  );
  return ReactDOM.createPortal(menu, document.getElementById('popover-root'));
};

Menu.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorPosition: PropTypes.objectOf(PropTypes.any).isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Menu;
