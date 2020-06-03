export const getArrayIndexForId = (array, id) => {
  if (!array) {
    return -1;
  }

  return array.findIndex(object => object.id === id);
};

export const updateArrayByIndex = (array, targetIndex, newItem) => {
  if (!array) {
    return [];
  }

  return array.map((item, index) => {
    if (index === targetIndex) {
      return newItem;
    }
    return item;
  });
};

export const getFullName = (name = {}) => {
  return `${name?.firstName} ${name?.lastName}`;
};

export const scrollToElement = (elementRef, scrollableParentRef) => {
  const elementCheck = setInterval(() => {
    const element = elementRef && elementRef.current;
    const scrollingElement = scrollableParentRef && scrollableParentRef.current;

    if (scrollableParentRef && element) {
      scrollingElement.scrollTo({
        top: element.offsetTop - scrollingElement.offsetTop,
        left: 0,
        behavior: 'smooth',
      });
    } else if (element) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      window.scrollTo({
        top: element.getBoundingClientRect().top + scrollTop,
        left: 0,
        behavior: 'smooth',
      });
    }

    clearInterval(elementCheck);
  }, 100);
};
