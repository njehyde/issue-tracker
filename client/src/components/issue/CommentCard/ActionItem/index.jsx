import React from 'react';
import PropTypes from 'prop-types';

import Styled from './styled';

const ActionItem = ({ label, onClick }) => (
  <span>
    <Styled.ActionItem onClick={onClick}>{label}</Styled.ActionItem>
  </span>
);

ActionItem.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default ActionItem;
