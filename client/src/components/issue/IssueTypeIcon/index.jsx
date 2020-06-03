import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/icons';

const IssueTypeIcon = ({ type }) => {
  switch (type) {
    case 'BUG':
      return <Icon.Bug />;
    case 'EPIC':
      return <Icon.Epic />;
    case 'STORY':
      return <Icon.Story />;
    case 'SUBTASK':
      return <Icon.Subtask />;
    case 'TASK':
      return <Icon.Task />;
    default:
      return null;
  }
};

IssueTypeIcon.propTypes = {
  type: PropTypes.string.isRequired,
};

export default IssueTypeIcon;
