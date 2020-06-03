import React from 'react';
import PropTypes from 'prop-types';

import Styled from './styled';

const ColumnHeaders = ({ columns }) => (
  <Styled.Container className="fixed sticky">
    <Styled.HeadersGroup>
      {columns &&
        columns.map(column => (
          <Styled.Header key={column?.ordinal}>
            <div className="column-header-flex">
              <div className="column-header-flex-1">
                <h2>{column?.name}</h2>
              </div>
            </div>
          </Styled.Header>
        ))}
    </Styled.HeadersGroup>
  </Styled.Container>
);

ColumnHeaders.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.any)).isRequired,
};

export default ColumnHeaders;
