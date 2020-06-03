import React from 'react';
import PropTypes from 'prop-types';
import { useRouteMatch } from 'react-router-dom';

import Styled from './styled';

const Sidebar = ({ board }) => {
  const { url } = useRouteMatch();
  const { type, isBacklogVisible, isBoardVisible } = board || {};
  let boardLabel = '';

  if (type === 'KANBAN') {
    boardLabel = 'Kanban board';
  }
  if (type === 'SCRUM') {
    boardLabel = 'Active sprints';
  }

  return (
    <ul>
      {isBacklogVisible && (
        <li>
          <Styled.Link to={`${url}/backlog`} activeClassName="is-active">
            Backlog
          </Styled.Link>
        </li>
      )}
      {isBoardVisible && (
        <li>
          <Styled.Link to={`${url}/board`} activeClassName="is-active">
            {boardLabel}
          </Styled.Link>
        </li>
      )}
    </ul>
  );
};

Sidebar.propTypes = {
  board: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default Sidebar;
