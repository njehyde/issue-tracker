import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Icon from 'components/icons';

const PriorityTypeIcon = ({ priority, priorityTypes }) => {
  const priorityType = priorityTypes.find(pt => pt.id === priority);
  const { id, color } = priorityType || {};
  switch (id) {
    case 'HIGHEST':
      return <Icon.UpArrow color={color} />;
    case 'HIGH':
      return <Icon.UpArrow color={color} />;
    case 'MEDIUM':
      return <Icon.UpArrow color={color} />;
    case 'LOW':
      return <Icon.DownArrow color={color} />;
    case 'LOWEST':
      return <Icon.DownArrow color={color} />;
    default:
      return null;
  }
};

PriorityTypeIcon.propTypes = {
  priority: PropTypes.string.isRequired,
  priorityTypes: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

const mapStateToProps = state => ({
  priorityTypes: state.issueStore.priorityTypes,
});

export default connect(mapStateToProps)(PriorityTypeIcon);
