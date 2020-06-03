import React from 'react';
import moment from 'moment';
import { range } from 'lodash';

import Styled from './styled';

const days = range(1, 8);

const DaysHeader = props => (
  <Styled.DaysHeader {...props}>
    <ul>
      {days.map(day => (
        <li key={day}>
          <small>
            {moment()
              .day(day)
              .format('dd')}
          </small>
        </li>
      ))}
    </ul>
  </Styled.DaysHeader>
);

export default DaysHeader;
