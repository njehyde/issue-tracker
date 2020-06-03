import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import StatusOverlay from './StatusOverlay';
import Styled from './styled';

const Column = ({
  children,
  issueStatuses,
  maxColumnSize,
  name,
  sprintId,
  statuses,
}) => {
  const height = `${79 * maxColumnSize}px`;
  return (
    <Styled.Column>
      <Styled.Outer style={{ height }}>
        {statuses &&
          statuses.map((status, index) => (
            <StatusOverlay
              key={status}
              index={index}
              name={name}
              label={
                issueStatuses.find(issueStatus => issueStatus.id === status)
                  ?.name
              }
              sprintId={sprintId}
              status={status}
              statuses={statuses}
            />
          ))}
        <Styled.Container>{children}</Styled.Container>
      </Styled.Outer>
    </Styled.Column>
  );
};

Column.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  issueStatuses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
  maxColumnSize: PropTypes.number,
  name: PropTypes.string,
  sprintId: PropTypes.string,
  statuses: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)),
};

const mapStateToProps = state => ({
  issueStatuses: state.issueStore.issueStatuses,
});

export default connect(mapStateToProps)(Column);
