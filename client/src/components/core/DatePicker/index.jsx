import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';

import Arrow from './Arrow';
import DaysHeader from './DaysHeader';
import Month from './Month';
import Styled from './styled';

const navCarouselStyle = {
  default: {
    width: '1200px',
    transform: 'translateX(0px)',
  },
  left: {
    width: '1200px',
    transform: 'translate(300px',
    transitionDuration: '200ms',
    transitionDelay: '0ms',
    transition: 'transform 200ms ease-in-out 0s',
  },
  right: {
    width: '1200px',
    transform: 'translate(-300px',
    transitionDuration: '200ms',
    transitionDelay: '0ms',
    transition: 'transform 200ms ease-in-out 0s',
  },
};

const DatePicker = ({
  open,
  disabled,
  anchorPosition,
  isEditStart,
  isEditEnd,
  initialDate,
  initialStartDate,
  initialEndDate,
  containerRef,
  onClose,
  onSelectDate,
}) => {
  const menuRef = useRef();
  const [show, setShow] = useState(false);
  const [position, setPosition] = useState();
  const [arrowOffset, setArrowOffset] = useState();
  const [targetMonth, setTargetMonth] = useState(
    initialStartDate || initialEndDate || initialDate || moment(),
  );
  const [carouselStyle, setCarouselStyle] = useState(navCarouselStyle.default);
  const [hoveredDate, setHoveredDate] = useState(null);
  const [bodyHeight, setBodyHeight] = useState(0);
  const [isNavLeftActive, setIsNavLeftActive] = useState(false);
  const [isNavRightActive, setIsNavRightActive] = useState(false);
  const isNavActive = isNavLeftActive || isNavRightActive;

  const monthsToRender = new Map();
  for (let i = -1; i < 3; i += 1) {
    const month = moment(targetMonth).add(i, 'months');
    const monthRef = React.createRef();
    monthsToRender.set(monthRef, month);
  }

  const setBodyHeightByDirection = sliceRefs => {
    const monthRefs = sliceRefs([...monthsToRender.keys()]);
    const height = monthRefs.reduce((currentHeight, ref) => {
      if (ref && ref.current && ref.current.clientHeight > currentHeight) {
        return ref.current.children[0].clientHeight;
      }
      return currentHeight;
    }, 0);
    setBodyHeight(height);
  };

  const handleNavigateLeft = () => {
    setCarouselStyle(navCarouselStyle.left);
    setIsNavLeftActive(true);
    setBodyHeightByDirection(refs => refs.slice(0, 2));

    setTimeout(() => {
      setCarouselStyle(navCarouselStyle.default);
      setIsNavLeftActive(false);

      const previousMonth = moment(targetMonth).subtract(1, 'months');
      setTargetMonth(previousMonth);
    }, 200);
  };

  const handleNavigateRight = () => {
    setCarouselStyle(navCarouselStyle.right);
    setIsNavRightActive(true);
    setBodyHeightByDirection(refs =>
      refs
        .reverse()
        .slice(0, 2)
        .reverse(),
    );

    setTimeout(() => {
      setCarouselStyle(navCarouselStyle.default);
      setIsNavRightActive(false);

      const nextMonth = moment(targetMonth).add(1, 'months');
      setTargetMonth(nextMonth);
    }, 200);
  };

  const handleHoverDate = date => {
    if (
      (!disabled && isEditEnd && date && date?.isAfter(initialStartDate)) ||
      (!disabled && isEditStart && date && date?.isBefore(initialEndDate))
    ) {
      setHoveredDate(date);
    } else {
      setHoveredDate(null);
    }
  };

  useEffect(() => {
    if (bodyHeight === 0) {
      const monthRefs = [...monthsToRender.keys()];
      const height = monthRefs.reduce((maxHeight, ref, index) => {
        const isMonthRefVisible = index > 0 && index < monthRefs.length - 1;
        if (isMonthRefVisible) {
          const isMounted = ref && ref.current;
          if (isMounted && ref.current.clientHeight > maxHeight) {
            return ref.current.children[0].clientHeight;
          }
        }
        return maxHeight;
      }, 0);
      setBodyHeight(height);
    }
  });

  const handleClick = event => {
    if (
      menuRef?.current?.contains(event.target) ||
      containerRef?.current?.contains(event.target)
    ) {
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

  useEffect(() => {
    setArrowOffset(isEditEnd ? 183 : 0);
  }, [isEditStart, isEditEnd]);

  const popover = (
    <>
      <Arrow offset={arrowOffset} position={position} />
      <Styled.Popover
        ref={menuRef}
        open={open}
        show={show}
        anchorPosition={position}
      >
        <Styled.Wrapper>
          <div className="inner">
            <div>
              <div style={{ width: '618px', boxSizing: 'inherit' }}>
                <Styled.DaysHeadersContainer>
                  <DaysHeader left />
                  <DaysHeader right />
                </Styled.DaysHeadersContainer>
                <Styled.Container>
                  <Styled.NavContainer>
                    <Styled.NavButton
                      type="button"
                      primary
                      left
                      onClick={handleNavigateLeft}
                    >
                      <span
                        style={{
                          width: '100%',
                          display: 'inherit',
                          alignItems: 'inherit',
                          justifyContent: 'inherit',
                        }}
                      >
                        <Styled.PreviousMonth />
                      </span>
                    </Styled.NavButton>
                    <Styled.NavButton
                      type="button"
                      primary
                      right
                      onClick={handleNavigateRight}
                    >
                      <Styled.NextMonth />
                    </Styled.NavButton>
                  </Styled.NavContainer>
                  <Styled.Body height={bodyHeight}>
                    <Styled.Carousel style={carouselStyle} active={isNavActive}>
                      {[...monthsToRender.keys()].map((ref, index) => {
                        const month = monthsToRender.get(ref);
                        const isLeft = index === 0;
                        const isRight = index === monthsToRender.size - 1;

                        return (
                          <Month
                            ref={ref}
                            key={month.month()}
                            month={month.month()}
                            year={month.year()}
                            left={isLeft}
                            right={isRight}
                            visible={isNavActive}
                            disabled={disabled}
                            initialDate={initialDate}
                            initialStartDate={initialStartDate}
                            initialEndDate={initialEndDate}
                            isEditStart={isEditStart}
                            isEditEnd={isEditEnd}
                            hoveredDate={hoveredDate}
                            onHoverDate={handleHoverDate}
                            onClick={onSelectDate}
                          />
                        );
                      })}
                    </Styled.Carousel>
                  </Styled.Body>
                </Styled.Container>
              </div>
            </div>
          </div>
        </Styled.Wrapper>
      </Styled.Popover>
    </>
  );

  return ReactDOM.createPortal(
    popover,
    document.getElementById('popover-root'),
  );
};

export default DatePicker;
